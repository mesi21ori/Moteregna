import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const validateToken = (token: string): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string; role: string };
    return ['SUPERADMIN', 'ADMIN'].includes(decoded.role) ? decoded : null;
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

    const decoded = validateToken(token);
    if (!decoded) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search as string || '';
    const status = req.query.status as string || undefined;
    const dateFrom = req.query.dateFrom as string || undefined;
    const dateTo = req.query.dateTo as string || undefined;
    const motoristId = req.query.motoristId as string || undefined;
    const customerId = req.query.customerId as string || undefined;

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
            { motorist: { licenseNumber: { contains: search, mode: 'insensitive' } } },
            { customer: { phonenumber: { contains: search, mode: 'insensitive' } } },
          ],
        },
        ...(status ? [{ status }] : []),
        ...(motoristId ? [{ motoristId }] : []),
        ...(customerId ? [{ customerId }] : []),
        ...(dateFrom || dateTo ? [{
          createdAt: {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(`${dateTo}T23:59:59.999Z`) }),
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
      startPoint: delivery.startLocation.name,
      endPoint: delivery.endLocation?.name || 'N/A',
      motorist: delivery.motorist 
        ? `${delivery.motorist.user.firstName} ${delivery.motorist.user.lastName}`
        : 'Unassigned',
      motoristContact: delivery.motorist?.user.phone || 'N/A',
      customer: delivery.customer?.phonenumber || 'N/A',
      distance: delivery.distance ? `${delivery.distance.toFixed(2)} km` : 'N/A',
      fee: delivery.fee ? `$${delivery.fee.toFixed(2)}` : 'Pending',
      status: delivery.status,
      startTime: delivery.startTime?.toISOString() || 'Not started',
      endTime: delivery.endTime?.toISOString() || 'In progress',
      createdAt: delivery.createdAt.toISOString().split('T')[0],
      coordinates: {
        start: {
          lat: delivery.startLocation.latitude,
          lng: delivery.startLocation.longitude,
        },
        end: delivery.endLocation ? {
          lat: delivery.endLocation.latitude,
          lng: delivery.endLocation.longitude,
        } : null,
      },
    }));

    return res.status(200).json({
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
    console.error('Error fetching deliveries:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  } finally {
    await prisma.$disconnect();
  }
}