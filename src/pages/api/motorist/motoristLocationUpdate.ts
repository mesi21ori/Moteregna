import { z } from 'zod';
import prisma from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const updateLocationSchema = z.object({
  motoristId: z.string().min(1, "Motorist ID is required"),
  latitude: z.number().min(-90).max(90, "Invalid latitude value"),
  longitude: z.number().min(-180).max(180, "Invalid longitude value"),
  address: z.string().optional(), 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };

    const validatedData = updateLocationSchema.parse(req.body);

    // Verify motorist exists and belongs to the authenticated user
    const motorist = await prisma.motorist.findUnique({
      where: { id: validatedData.motoristId },
      include: { user: true },
    });

    if (!motorist) {
      return res.status(404).json({ message: 'Motorist not found' });
    }

    if (motorist.user?.id !== decoded.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to update this motorist' });
    }

    // Create or update location
    let location;
    if (motorist.currentLocationId) {
      // Update existing location
      location = await prisma.location.update({
        where: { id: motorist.currentLocationId },
        data: {
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
          address: validatedData.address || undefined,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new location
      location = await prisma.location.create({
        data: {
          name: validatedData.address || `Motorist ${motorist.id} Location`,
          address: validatedData.address || '',
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
        },
      });

      // Associate the new location with the motorist
      await prisma.motorist.update({
        where: { id: validatedData.motoristId },
        data: {
          currentLocationId: location.id,
        },
      });
    }

    res.status(200).json({
      message: 'Motorist location updated successfully',
      location: {
        id: location.id,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      },
    });
  } catch (error) {
    console.error('Error updating motorist location:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}