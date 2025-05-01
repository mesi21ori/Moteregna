import { PrismaClient } from '@prisma/client';

type Role = 'USER' | 'ADMIN' | 'SUPERADMIN'; // Define Role type manually
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const validateToken = (token: string): { userId: string; role: Role } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { 
      userId: string; 
      role: Role;
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
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

    const decoded = validateToken(token);
    if (!decoded) return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });

    if (!['ADMIN', 'SUPERADMIN'].includes(decoded.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
    }

    const popularLocations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { startDeliveries: true },
        },
      },
      orderBy: {
        startDeliveries: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const formattedData = popularLocations.map(location => ({
      name: location.name,
      value: location._count.startDeliveries,
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
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