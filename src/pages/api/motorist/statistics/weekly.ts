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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
  
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = validateToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { motoristId } = querySchema.parse(req.query);

    console.log(`Request received for motoristId: ${motoristId}`);

    const motorist = await prisma.motorist.findUnique({
      where: { id: motoristId },
    });

    if (!motorist) {
      return res.status(404).json({ message: 'Motorist not found' });
    }

    if (motorist.userId !== decoded.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this motorist' });
    }

    const now = new Date();
    const startOfWeek = new Date(now.setHours(0, 0, 0, 0)); 
    startOfWeek.setDate(now.getDate() - now.getDay()); 
    const endOfWeek = new Date(now.setHours(23, 59, 59, 999)); 
    endOfWeek.setDate(now.getDate() + (6 - now.getDay())); 

    const weeklyDeliveries = await prisma.delivery.findMany({
      where: {
        motoristId,
        status: 'DELIVERED', 
        createdAt: {
          gte: startOfWeek, 
          lte: endOfWeek, 
        },
      },
    });

<<<<<<< HEAD
    const totalDistance = weeklyDeliveries.reduce((sum, delivery) => sum + (delivery.distance ?? 0), 0);
    const totalEarning = weeklyDeliveries.reduce((sum, delivery) => sum + ( delivery.fee ?? 0), 0);
=======
    const totalDistance = weeklyDeliveries.reduce((sum, delivery) => sum + delivery.distance!, 0);
    const totalEarning = weeklyDeliveries.reduce((sum, delivery) => sum + delivery.fee!, 0);
>>>>>>> 4a89896c59c857c211774feff6af57c0819d3a2d
    const deliveryCount = weeklyDeliveries.length;

    res.status(200).json({
      totalDistance,
      totalEarning,
      delivery: deliveryCount,
    });
  } catch (error) {
    console.error('Error fetching weekly motorist statistics:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}