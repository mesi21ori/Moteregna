
import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { 
      userId: string;
      role: string;
    };

    if (decoded.role !== 'CUSTOMER') {
      return res.status(403).json({ message: 'Forbidden: Only customers can access this endpoint' });
    }

    const validatedData = changePasswordSchema.parse(req.body);

    const customer = await prisma.customer.findUnique({
      where: { id: decoded.userId },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, customer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    await prisma.customer.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}