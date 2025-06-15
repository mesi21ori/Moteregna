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
      phone: string;
      role: string;
    };

    if (decoded.role !== 'CUSTOMER') {
      return res.status(403).json({ message: 'Forbidden: Customer access required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [deliveries, totalCount] = await Promise.all([
      prisma.delivery.findMany({
        where: {
          customerPhone: decoded.phone,
          status: {
            in: ['DELIVERED', 'CANCELLED']
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
        },
        skip,
        take: limit
      }),
      prisma.delivery.count({
        where: {
          customerPhone: decoded.phone,
          status: {
            in: ['DELIVERED', 'CANCELLED']
          }
        }
      })
    ]);

    return res.status(200).json({
      deliveries,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching delivery history:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}