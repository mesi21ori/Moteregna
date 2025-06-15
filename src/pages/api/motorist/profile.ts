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

    if (decoded.role !== 'MOTORIST') {
      return res.status(403).json({ message: 'Forbidden: Only motorists can access this endpoint' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        phone: true,
        gender: true,
        birthdate: true,
        address: true,
        profile: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const motorist = await prisma.motorist.findFirst({
      where: { userId: decoded.userId },
      select: {
        id: true,
        licenseNumber: true,
        vehicleModel: true,
        vehiclePlateNumber: true,
        Librephoto: true,
        driversLicencephotoFront: true,
        businessPermit: true,
        isAvailable: true,
        isOnline: true,
        currentLocation: true,
        fcmToken: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!motorist) {
      return res.status(404).json({ message: 'Motorist profile not found' });
    }

    res.status(200).json({ ...user, motorist });
  } catch (error) {
    console.error('Error fetching motorist profile:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}