import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { is } from 'date-fns/locale';

const prisma = new PrismaClient();

const validateToken = (token: string): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Preflight request
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
    const decoded = validateToken(token);
    if (!decoded) return res.status(403).json({ message: 'Forbidden' });

    if (!['ADMIN', 'SUPERADMIN'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }

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
        name: `${motorist.user?.firstName} ${motorist.user?.lastName}`,
        phone: motorist.user?.phone,
        licenseNumber: motorist.licenseNumber,
        vehicle: `${motorist.vehicleModel} (${motorist.vehiclePlateNumber})`,
        status: motorist.isAvailable ? 'Available' : 'Unavailable',
        onlineStatus: motorist.isOnline ? 'Online' : 'Offline',
        totalDeliveries,
        totalDistance: `${totalDistance.toFixed(2)} km`,
        joinedDate: motorist.createdAt.toISOString().split('T')[0],
        isAvailable: motorist.isAvailable,
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
  } finally {
    await prisma.$disconnect();
  }
}