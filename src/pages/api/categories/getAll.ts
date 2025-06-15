import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const validateAdmin = (token: string | undefined): boolean => {
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { role: string };
    return ['ADMIN', 'SUPERADMIN'].includes(decoded.role);
  } catch {
    return false;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
  const isAdmin = validateAdmin(token);

  try {
    const categories = await prisma.packageCategory.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });

    return res.status(200).json({
      message: 'category fetch  successfully',
      categories
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
