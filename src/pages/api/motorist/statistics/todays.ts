import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next/types';

const prisma = new PrismaClient();

const querySchema = z.object({
  motoristId: z.string().min(1, "Motorist ID is required"),
});

const validateToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };
    return decoded;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

function getTodayDateRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.setHours(0, 0, 0, 0));
  const end = new Date(now.setHours(23, 59, 59, 999));
  return { start, end };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    // Authentication
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

    // Input validation
    const { motoristId } = querySchema.parse(req.query);
    console.log(`Fetching daily stats for motorist: ${motoristId}`);

    // Verify motorist exists and belongs to user
    const motorist = await prisma.motorist.findUnique({
      where: { id: motoristId },
      select: { userId: true }
    });

    if (!motorist) {
      return res.status(404).json({ 
        success: false,
        message: 'Motorist not found' 
      });
    }

    if (motorist.userId !== decoded.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: You do not have permission to access this motorist' 
      });
    }

    // Get today's date range
    const { start: startOfDay, end: endOfDay } = getTodayDateRange();

    // Fetch today's deliveries
    const todayDeliveries = await prisma.delivery.findMany({
      where: {
        motoristId,
        status: 'DELIVERED',
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        distance: true,
        fee: true
      }
    });

    // Calculate statistics
    const stats = todayDeliveries.reduce(
      (acc, delivery) => {
        acc.totalDistance += delivery.distance ?? 0;
        acc.totalEarning += delivery.fee ?? 0;
        return acc;
      },
      { totalDistance: 0, totalEarning: 0 }
    );

    return res.status(200).json({
      success: true,
      data: {
        ...stats,
        deliveryCount: todayDeliveries.length,
        date: startOfDay.toISOString().split('T')[0] // YYYY-MM-DD format
      }
    });
  } catch (error) {
    console.error('Error fetching daily motorist statistics:', error);

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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}