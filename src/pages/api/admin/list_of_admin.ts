import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
   
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { role: string };
    if (decoded.role !== 'SUPERADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: SuperAdmin access required' });
    }

    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedAdmins = admins.map(admin => ({
      Name: `${admin.firstName} ${admin.lastName}`,
      Phone: admin.phone,
      Status: admin.status ? 'Active' : 'Inactive',
      Created: admin.createdAt.toISOString().split('T')[0] 
    }));

    return res.status(200).json({
      success: true,
      data: formattedAdmins
    });

  } catch (error) {
    console.error('Error fetching admins:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
}