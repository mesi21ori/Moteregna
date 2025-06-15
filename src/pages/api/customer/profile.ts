import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';

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
    };

    if (decoded.role !== 'CUSTOMER') {
      return res.status(403).json({ message: 'Forbidden: Only customers can access this endpoint' });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer profile:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}