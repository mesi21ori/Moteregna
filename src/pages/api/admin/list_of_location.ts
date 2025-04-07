import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const validateAdminToken = (token: string): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string; role: string };
    return ['ADMIN', 'SUPERADMIN'].includes(decoded.role) ? decoded : null;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = validateAdminToken(token);
    if (!decoded) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string || '';

    const locations = await prisma.location.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: {
            startDeliveries: true,
            endDeliveries: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedLocations = locations.map(location => ({
      id: location.id,
      name: location.name,
      address: location.address,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      deliveryStats: {
        asPickup: location._count.startDeliveries,
        asDropoff: location._count.endDeliveries,
        total: location._count.startDeliveries + location._count.endDeliveries,
      },
      createdAt: location.createdAt.toISOString().split('T')[0],
      updatedAt: location.updatedAt.toISOString().split('T')[0],
    }));

    const totalCount = await prisma.location.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      },
    });

    return res.status(200).json({
      success: true,
      data: formattedLocations,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  } finally {
    await prisma.$disconnect();
  }
}