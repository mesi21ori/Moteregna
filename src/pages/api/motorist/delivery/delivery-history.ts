import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const querySchema = z.object({
  motoristId: z.string().min(1, "Motorist ID is required"),
  page: z.string().min(1, "Page number is required").transform(Number),
  data: z.string().min(1, "Data per page is required").transform(Number),
});

interface DecodedToken {
  userId: string;
}

interface FormattedDelivery {
  totalDistance: number | null;
  source: string;
  destination: string | null;
  totalCost: number | null;
  status: string;
  sourceLat: number;
  sourceLong: number;
  destinationLat: number | null;
  destinationLong: number | null;
  startTime: string | null;
  endTime: string | null;
  customerPhone: string | null;
}

const validateToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!) as DecodedToken;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authentication
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = validateToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Validation
    const { motoristId, page, data } = querySchema.parse(req.query);
    const skip = (page - 1) * data;
    const take = data;

    console.log(`Fetching deliveries for motorist: ${motoristId}, page: ${page}, per page: ${data}`);

    // Authorization check
    const motorist = await prisma.motorist.findUnique({
      where: { id: motoristId },
    });

    if (!motorist) {
      return res.status(404).json({ message: 'Motorist not found' });
    }

    if (motorist.userId !== decoded.userId) {
      return res.status(403).json({ 
        message: 'Forbidden: You do not have permission to access this motorist' 
      });
    }

    // Fetch deliveries with pagination
    const deliveries = await prisma.delivery.findMany({
      where: { motoristId },
      skip,
      take,
      include: {
        startLocation: true,
        endLocation: true,
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format the response data
    const formattedDeliveries: FormattedDelivery[] = deliveries.map((delivery) => ({
      totalDistance: delivery.distance,
      source: delivery.startLocation.name,
      destination: delivery.endLocation?.name ?? null,
      totalCost: delivery.fee,
      status: delivery.status,
      sourceLat: delivery.startLocation.latitude,
      sourceLong: delivery.startLocation.longitude,
      destinationLat: delivery.endLocation?.latitude ?? null,
      destinationLong: delivery.endLocation?.longitude ?? null,
      startTime: delivery.startTime?.toISOString() ?? null,
      endTime: delivery.endTime?.toISOString() ?? null,
      customerPhone: delivery.customer?.phonenumber ?? null,
    }));

    // Get total count for pagination metadata
    const totalDeliveries = await prisma.delivery.count({
      where: { motoristId },
    });

    return res.status(200).json({
      data: formattedDeliveries,
      pagination: {
        currentPage: page,
        itemsPerPage: data,
        totalItems: totalDeliveries,
        totalPages: Math.ceil(totalDeliveries / data),
      }
    });

  } catch (error) {
    console.error('Error fetching delivery history:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        })) 
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : 'Unknown error'
        : undefined
    });
  }
}