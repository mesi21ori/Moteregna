import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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
  if (req.method !== 'DELETE') {
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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  try {
    const existingCategory = await prisma.packageCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const packagesCount = await prisma.package.count({
      where: { categoryId: id },
    });

    if (packagesCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category in use by packages',
        packageCount: packagesCount,
      });
    }

    await prisma.packageCategory.update({
      where: { id },
      data: { isActive: false },
    });

    return res.status(200).json({ message: 'Category deactivated successfully' });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}