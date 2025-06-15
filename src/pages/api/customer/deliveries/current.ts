import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
      phone: string; 
    };

    if (decoded.role !== 'CUSTOMER') {
      return res.status(403).json({ message: 'Forbidden: Customer access required' });
    }

    const activeDeliveries = await prisma.delivery.findMany({
      where: {
        customerPhone: decoded.phone, 
        status: {
          notIn: ['DELIVERED', 'CANCELLED']
        }
      },
      include: {
        motorist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true
              }
            }
          }
        },
        startLocation: true,
        endLocation: true,
        packages: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      activeDeliveries,
      count: activeDeliveries.length
    });

  } catch (error) {
    console.error('Error fetching current deliveries:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}