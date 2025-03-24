import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const validateAdminToken = (token: string): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string; role: string };
    return decoded.role === 'ADMIN' ? decoded : null;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
  
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
    const decoded = validateAdminToken(token);
    if (!decoded) return res.status(403).json({ message: 'Forbidden' });

   
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search as string || '';
    const status = req.query.status as string || undefined;
    const vehicleType = req.query.vehicleType as string || undefined;

    const sortField = req.query.sortField as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const where: any = {
      AND: [
        {
          OR: [
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
            { user: { lastName: { contains: search, mode: 'insensitive' } } },
            { licenseNumber: { contains: search, mode: 'insensitive' } },
            { vehiclePlateNumber: { contains: search, mode: 'insensitive' } },
          ],
        },
        ...(status ? [{ isAvailable: status === 'available' }] : []),
        ...(vehicleType ? [{ vehicleModel: { contains: vehicleType, mode: 'insensitive' } }] : []),
      ],
    };

    const totalCount = await prisma.motorist.count({ where });

    const motorists = await prisma.motorist.findMany({
      skip,
      take: limit,
      where,
      orderBy: { [sortField]: sortOrder },
      include: {
        user: true,
        deliveries: {
          select: {
            distance: true,
            status: true,
          },
        },
      },
    });

    const formattedMotorists = motorists.map(motorist => {
      const totalDeliveries = motorist.deliveries.length;
      const totalDistance = motorist.deliveries.reduce((sum, d) => sum + (d.distance || 0), 0);

      return {
        id: motorist.id,
        firstName: motorist.user.firstName,
        middleName: motorist.user.middleName,
        lastName: motorist.user.lastName,
        phone: motorist.user.phone,
        gender: motorist.user.gender,
        address: motorist.user.address,
        birthdate: motorist.user.birthdate,
        licenseNumber: motorist.licenseNumber,
        vehicleModel: motorist.vehicleModel,
        vehiclePlateNumber: motorist.vehiclePlateNumber,
        driversLicencephotoBack: motorist.Librephoto,
        driversLicencephotoFront: motorist.driversLicencephotoFront,
        isAvailable: motorist.isAvailable,
        isOnline: motorist.isOnline,
        totalDeliveries,
        totalDistance,
        createdAt: motorist.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedMotorists,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}