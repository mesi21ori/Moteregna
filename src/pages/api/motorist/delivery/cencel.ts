import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const cancelDeliverySchema = z.object({
  deliveryId: z.string().min(1, "Delivery ID is required"),
  status: z.literal("CANCELLED"), 
});

interface DecodedToken {
  userId: string;
}

const validateToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!) as DecodedToken;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
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

    // Validation
    const { deliveryId } = cancelDeliverySchema.parse(req.body);

    // Fetch delivery with necessary relations
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        customer: true,
        startLocation: true,
        motorist: true,
      },
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (!delivery.motoristId) {
      return res.status(400).json({ message: 'Delivery has no assigned motorist' });
    }

    // Authorization check
    if (!delivery.motorist || delivery.motorist.userId !== decoded.userId) {
      return res.status(403).json({ 
        message: 'Forbidden: You do not have permission to cancel this delivery' 
      });
    }

    // Transaction for data consistency
    const [updatedDelivery] = await prisma.$transaction([
      prisma.delivery.update({
        where: { id: deliveryId },
        data: { status: 'CANCELLED' },
        include: {
          customer: true,
          startLocation: true,
        },
      }),
      prisma.motorist.update({
        where: { id: delivery.motoristId },
        data: { isAvailable: true },
      }),
    ]);

    // Response formatting
    const response = {
      id: updatedDelivery.id,
      customerPhone: updatedDelivery.customer?.phonenumber || null,
      source: updatedDelivery.startLocation.name,
      sourceLat: updatedDelivery.startLocation.latitude,
      sourceLong: updatedDelivery.startLocation.longitude,
      status: updatedDelivery.status,
      startTime: updatedDelivery.startTime,
    };

    return res.status(200).json({ 
      message: 'Delivery cancelled successfully', 
      data: response 
    });

  } catch (error) {
    console.error('Error canceling delivery:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        })) 
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    return res.status(500).json({ 
      message: 'Failed to cancel delivery',
      error: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : 'Unknown error'
        : undefined
    });
  }
}