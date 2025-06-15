import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const updateDeliverySchema = z.object({
  deliveryId: z.string().min(1, "Delivery ID is required"),
  totalDistance: z.number().min(0, "Total distance must be a positive number"),
  totalCost: z.number().min(0, "Total cost must be a positive number"),
  status: z.enum(["PENDING", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "CANCELLED"]),
  endTime: z.string().min(1, "End time is required"),
  destination: z.string(), 
  destinationLat: z.number().min(1, "destination latitude location is required"),  
  destinationLong: z.number().min(1, "destination longitude is required"), 
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

    const validatedData = updateDeliverySchema.parse(req.body);

    const delivery = await prisma.delivery.findUnique({
      where: { id: validatedData.deliveryId },
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (!delivery.motoristId) {
      return res.status(400).json({ message: 'Delivery has no assigned motorist' });
    }

    if (delivery.status === "DELIVERED" || delivery.status === "CANCELLED") {
      return res.status(400).json({ message: 'Delivery is already completed or cancelled' });
    }

    let endLocationId = delivery.endLocationId;
    if(validatedData.destination == ''){
      validatedData.destination = 'N/A'
    }

    if (validatedData.status === "DELIVERED" && validatedData.destination && validatedData.destinationLat && validatedData.destinationLong) {
      const endLocation = await prisma.location.create({
        data: {
          name: validatedData.destination,
          address: validatedData.destination,
          latitude: validatedData.destinationLat,
          longitude: validatedData.destinationLong,
        },
      });
      endLocationId = endLocation.id;
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id: validatedData.deliveryId },
      data: {
        distance: validatedData.totalDistance,
        fee: validatedData.totalCost,
        status: validatedData.status,
        endTime: new Date(validatedData.endTime),
        endLocationId: endLocationId, 
      },
    });

    let isAvailable = false;
    if (validatedData.status === "DELIVERED" || validatedData.status === "CANCELLED") {
      isAvailable = true;
    }

    await prisma.motorist.update({
      where: { id: delivery.motoristId! },
      data: { isAvailable },
    });

    res.status(200).json({
      message: 'Delivery updated successfully',
      delivery: {
        id: updatedDelivery.id,
        status: updatedDelivery.status,
        totalDistance: updatedDelivery.distance,
        totalCost: updatedDelivery.fee,
      },
    });
  } catch (error) {
    console.error('Error updating delivery:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}