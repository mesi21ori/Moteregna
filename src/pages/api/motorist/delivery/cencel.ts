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
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = validateToken(token);
      if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      const { deliveryId } = cancelDeliverySchema.parse(req.body);

      const delivery = await prisma.delivery.findUnique({
        where: { id: deliveryId },
        include: {
          customer: true,
          startLocation: true,
        },
      });

      if (!delivery) {
        return res.status(404).json({ message: 'Delivery not found' });
      }

      if (!delivery.motoristId) {
        return res.status(400).json({ message: 'Delivery has no assigned motorist' });
      }

      const motorist = await prisma.motorist.findUnique({
        where: { id: delivery.motoristId! },
      });

      if (!motorist || motorist.userId !== decoded.userId) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to cancel this delivery' });
      }

      const updatedDelivery = await prisma.delivery.update({
        where: { id: deliveryId },
        data: { status: 'CANCELLED' },
        include: {
          customer: true, 
          startLocation: true, 
        },
      });

      await prisma.motorist.update({
        where: { id: delivery.motoristId! },
        data: { isAvailable: true },
      });

      const response = {
        id: updatedDelivery.id,
        customerphone: updatedDelivery.customer?.phonenumber || null,
        source: updatedDelivery.startLocation.name,
        sourceLat: updatedDelivery.startLocation.latitude,
        sourceLong: updatedDelivery.startLocation.longitude,
        status: updatedDelivery.status,
        startTime: updatedDelivery.startTime,
      };

      res.status(200).json({ message: 'Delivery cancelled successfully', data: response });
    } catch (error) {
      console.error('Error canceling delivery:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

<<<<<<< HEAD
      let errorMessage = 'Failed to cancel delivery';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
=======
      res.status(500).json({ 
        message: 'Failed to cancel delivery', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
>>>>>>> 4a89896c59c857c211774feff6af57c0819d3a2d

      res.status(500).json({ message: errorMessage });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}