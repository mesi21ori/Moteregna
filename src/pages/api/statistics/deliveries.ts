import { PrismaClient, DeliveryStatus, Role } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const timeRangeSchema = z.object({
  range: z.enum(['30days', '3months', '6months', '1year'])
});

const validateToken = (token: string): { userId: string; role: Role } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { 
      userId: string; 
      role: Role;
    };
    return decoded;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: No token provided' 
      });
    }

    const decoded = validateToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: Invalid token' 
      });
    }

    if (!['ADMIN', 'SUPERADMIN'].includes(decoded.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: Insufficient permissions' 
      });
    }

    const { range } = timeRangeSchema.parse(req.query);

    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '3months':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 6));
    }

    const deliveries = await prisma.delivery.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        _all: true,
      },
    });

    const completedCount = await prisma.delivery.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'DELIVERED',
      },
    });

    const cancelledCount = await prisma.delivery.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'CANCELLED',
      },
    });

    const monthlyData: Record<string, { 
      month: string; 
      completed: number; 
      pending: number; 
      cancelled: number 
    }> = {};

    deliveries.forEach(delivery => {
      const monthYear = new Date(delivery.createdAt).toLocaleString('default', { 
        month: 'short', 
        year: 'numeric' 
      });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: new Date(delivery.createdAt).toLocaleString('default', { month: 'short' }),
          completed: 0,
          pending: delivery._count._all,
          cancelled: 0
        };
      } else {
        monthlyData[monthYear].pending += delivery._count._all;
      }
    });

    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].completed = Math.floor(completedCount / Object.keys(monthlyData).length);
      monthlyData[month].cancelled = Math.floor(cancelledCount / Object.keys(monthlyData).length);
      monthlyData[month].pending -= monthlyData[month].completed + monthlyData[month].cancelled;
    });

    const formattedData = Object.values(monthlyData);

    return res.status(200).json({
      success: true,
      data: formattedData,
    });

  } catch (error) {
    console.error('Error fetching delivery statistics:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: error.errors 
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: Invalid token' 
      });
    }

    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
}