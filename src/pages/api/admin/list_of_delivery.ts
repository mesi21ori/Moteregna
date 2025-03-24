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
    const dateFrom = req.query.dateFrom as string || undefined;
    const dateTo = req.query.dateTo as string || undefined;

    const sortField = req.query.sortField as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const where: any = {
      AND: [
        {
          OR: [
            { startLocation: { name: { contains: search, mode: 'insensitive' } } },
            { endLocation: { name: { contains: search, mode: 'insensitive' } } },
            { motorist: { user: { firstName: { contains: search, mode: 'insensitive' } } } },
            { motorist: { user: { lastName: { contains: search, mode: 'insensitive' } } } },
          ],
        },
        ...(status ? [{ status }] : []),
        ...(dateFrom || dateTo ? [{
          createdAt: {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          },
        }] : []),
      ],
    };

    const totalCount = await prisma.delivery.count({ where });

    const deliveries = await prisma.delivery.findMany({
      skip,
      take: limit,
      where,
      orderBy: { [sortField]: sortOrder },
      include: {
        startLocation: true,
        endLocation: true,
        motorist: {
          include: {
            user: true,
          },
        },
        customer: true,
      },
    });

    const formattedDeliveries = deliveries.map(delivery => ({
      id: delivery.id,
      startLocation: delivery.startLocation.name,
      startLat: delivery.startLocation.latitude,
      startLong: delivery.startLocation.longitude,
      endLocation: delivery.endLocation?.name || 'N/A',
      endLat: delivery.endLocation?.latitude || null,
      endLong: delivery.endLocation?.longitude || null,
      motorist: delivery.motorist 
        ? `${delivery.motorist.user.firstName} ${delivery.motorist.user.lastName}`
        : 'Unassigned',
      motoristPhone: delivery.motorist?.user.phone || 'N/A',
      customerPhone: delivery.customer?.phonenumber || 'N/A',
      distance: delivery.distance,
      fee: delivery.fee,
      status: delivery.status,
      startTime: delivery.startTime,
      endTime: delivery.endTime,
      createdAt: delivery.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedDeliveries,
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