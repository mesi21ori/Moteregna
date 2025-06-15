import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

const validateAdmin = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string, role: string };
    if (!['ADMIN', 'SUPERADMIN'].includes(decoded.role)) return null;
    return decoded;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const decoded = validateAdmin(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  try {
    const validatedData = createCategorySchema.parse(req.body);

    const existingCategory = await prisma.packageCategory.findFirst({
      where: { name: validatedData.name },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await prisma.packageCategory.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
    });

    return res.status(201).json({
      message: 'category created successfully',
      category
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.errors 
      });
    }
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}