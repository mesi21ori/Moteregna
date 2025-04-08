import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const toggleAvailabilitySchema = z.object({
  motoristId: z.string().min(1, "Motorist ID is required"),
  isAvailable: z.boolean(),
});

const createDeliverySchema = z.object({
  motoristId: z.string().min(1, "Motorist ID is required"),
  customerPhone: z.string().min(1, "Customer phone number is required"),
  source: z.string().min(1, "Source location is required"),
  sourceLat: z.number(),
  sourceLong: z.number(),
  startTime: z.string().min(1, "Start time is required") 
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

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    console.log('Request Body:', req.body);

    if (req.body.isAvailable !== undefined) {
      const validatedData = toggleAvailabilitySchema.parse(req.body);

      const motorist = await prisma.motorist.findUnique({
        where: { id: validatedData.motoristId },
      });

      if (!motorist) {
        return res.status(404).json({ message: 'Motorist not found' });
      }

      if (motorist.userId !== decoded.userId) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to update this motorist' });
      }

      if (!motorist.isOnline) {
        return res.status(400).json({ message: 'Motorist is offline. Cannot toggle availability.' });
      }

      const updatedMotorist = await prisma.motorist.update({
        where: { id: validatedData.motoristId },
        data: { isAvailable: validatedData.isAvailable },
      });

      return res.status(200).json({
        message: `Motorist is now ${validatedData.isAvailable ? 'available' : 'unavailable'}`,
        motorist: {
          id: updatedMotorist.id,
          isAvailable: updatedMotorist.isAvailable,
        },
      });
    } else {
      const validatedData = createDeliverySchema.parse(req.body);

      const motorist = await prisma.motorist.findUnique({
        where: { id: validatedData.motoristId },
      });

      if (!motorist) {
        return res.status(404).json({ message: 'Motorist not found' });
      }

      if (motorist.userId !== decoded.userId) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to create a delivery for this motorist' });
      }

      if (!motorist.isAvailable) {
        return res.status(400).json({ message: 'Motorist is not available for a new delivery.' });
      }

      const activeDelivery = await prisma.delivery.findFirst({
        where: {
          motoristId: validatedData.motoristId,
          status: {
            notIn: ['DELIVERED', 'CANCELLED'],
          },
        },
      });

      if (activeDelivery) {
        return res.status(400).json({ message: 'Motorist already has an active delivery.' });
      }

      let customer = await prisma.customer.findUnique({
        where: { phonenumber: validatedData.customerPhone },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            phonenumber: validatedData.customerPhone,
          },
        });
      }

      const startLocation = await prisma.location.create({
        data: {
          name: validatedData.source,
          address: validatedData.source,
          latitude: validatedData.sourceLat,
          longitude: validatedData.sourceLong,
        },
      });

      const price = await prisma.price.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }

      const delivery = await prisma.delivery.create({
        data: {
          motoristId: validatedData.motoristId,
          customerId: customer.id,
          startLocationId: startLocation.id,
          status: 'PENDING',
          fee: price.initialPrice,
          startTime: validatedData.startTime ? new Date(validatedData.startTime) : null,
        },
      });

      await prisma.motorist.update({
        where: { id: validatedData.motoristId },
        data: { isAvailable: false },
      });

      return res.status(200).json({
        message: 'Delivery created successfully',
        deliveryId: delivery.id,
        initialPrice: price.initialPrice,
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}