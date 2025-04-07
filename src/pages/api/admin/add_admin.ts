import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const createAdminSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const validateToken = (token: string): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { 
      userId: string; 
      role: string 
    };
    return decoded;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
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

    if (decoded.role !== 'SUPERADMIN') {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: Only superadmins can create admin accounts' 
      });
    }

    const validatedData = createAdminSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { phone: validatedData.phone },
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this phone number already exists' 
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    const newAdmin = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        password: hashedPassword,
        role: 'ADMIN',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: newAdmin,
    });

  } catch (error) {
    console.error('Error creating admin:', error);

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
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
}