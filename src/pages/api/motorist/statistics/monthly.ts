import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

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

function getMonthDateRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authentication
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = validateToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Input validation
    const { motoristId } = querySchema.parse(req.query);
    console.log(`Request received for motoristId: ${motoristId}`);

    // Verify motorist exists and belongs to user
    const motorist = await prisma.motorist.findUnique({
      where: { id: motoristId },
    });

    if (!motorist) {
      return res.status(404).json({ message: 'Motorist not found' });
    }

    if (motorist.userId !== decoded.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this motorist' });
    }

    // Get monthly date range
    const { start: startOfMonth, end: endOfMonth } = getMonthDateRange();

    // Fetch deliveries for the current month
    const monthlyDeliveries = await prisma.delivery.findMany({
      where: {
        motoristId,
        status: 'DELIVERED',
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        distance: { not: null },
        fee: { not: null },
      },
    });

    // Calculate statistics
    const totalDistance = monthlyDeliveries.reduce(
      (sum, delivery) => sum + (delivery.distance || 0),
      0
    );
    
    const totalEarning = monthlyDeliveries.reduce(
      (sum, delivery) => sum + (delivery.fee || 0),
      0
    );
    
    const deliveryCount = monthlyDeliveries.length;

    return res.status(200).json({
      totalDistance,
      totalEarning,
      deliveryCount,
      month: startOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
    });
  } catch (error) {
    console.error('Error fetching monthly motorist statistics:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.errors 
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}