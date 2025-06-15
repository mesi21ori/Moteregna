import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const updatePrivacyTermSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(['privacy', 'terms']),
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
  if (req.method !== 'PUT') {
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
    const { id } = req.query;
    const validatedData = updatePrivacyTermSchema.parse(req.body);

    const privacyTerm = await prisma.privacyTerm.update({
      where: { id: id as string },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        type: validatedData.type,
      },
    });

    return res.status(200).json(
        {Message: 'Privacy term updated successfully'
        ,privacyTerm});
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