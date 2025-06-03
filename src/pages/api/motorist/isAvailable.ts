import { z } from 'zod';
import prisma from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const toggleOnlineSchema = z.object({
  motoristId: z.string().min(1, "Motorist ID is required"),
  isAvailable: z.boolean(),
});

function validateToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

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
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    // Check if user has ADMIN or SUPERADMIN role
    if (!['ADMIN', 'SUPERADMIN'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }

    const validatedData = toggleOnlineSchema.parse(req.body);

    const motorist = await prisma.motorist.findUnique({
      where: { id: validatedData.motoristId },
    });

    if (!motorist) {
      return res.status(404).json({ message: 'Motorist not found' });
    }

    const updatedMotorist = await prisma.motorist.update({
      where: { id: validatedData.motoristId },
      data: { isAvailable: validatedData.isAvailable },
    });

    res.status(200).json({
      message: `Motorist is now ${validatedData.isAvailable ? 'available' : 'unavailable'}`,
      motorist: {
        id: updatedMotorist.id,
        isAvailable: updatedMotorist.isAvailable,
      },
    });
  } catch (error) {
    console.error('Error toggling motorist availability:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}