
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

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
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { 
      userId: string; 
      role: string 
    };


    if (decoded.role !== 'SUPERADMIN' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: Only admins can view pricing information' 
      });
    }

    const currentPrice = await prisma.price.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!currentPrice) {
      return res.status(404).json({ 
        success: false,
        message: 'No pricing configuration found' 
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        basePrice: currentPrice.initialPrice,
        perKmPrice: currentPrice.perkilometer,
        lastUpdated: currentPrice.updatedAt,
        updatedBy: `${currentPrice.user.firstName} ${currentPrice.user.lastName}`
      }
    });

  } catch (error) {
    console.error('Error fetching current price:', error);

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