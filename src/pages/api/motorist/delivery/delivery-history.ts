import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken'; 

const prisma = new PrismaClient();

const querySchema = z.object({
  motoristId: z.string().min(1, "Motorist ID is required"),
  page: z.string().min(1, "Page number is required").transform(Number), 
  data: z.string().min(1, "Data per page is required").transform(Number), 
});

const validateToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };
    return decoded;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {

    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = validateToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { motoristId, page, data } = querySchema.parse(req.query);

    console.log(`Request received for motoristId: ${motoristId}, page: ${page}, data: ${data}`);

    const motorist = await prisma.motorist.findUnique({
      where: { id: motoristId },
    });

    if (!motorist) {
      return res.status(404).json({ message: 'Motorist not found' });
    }

    if (motorist.userId !== decoded.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this motorist' });
    }

    const skip = (page - 1) * data; 
    const take = data; 

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

    const formattedDeliveries = deliveries.map((delivery) => ({
      totalDistance: delivery.distance,
      source: delivery.startLocation.name,
      destination: delivery.endLocation!.name,
      totalCost: delivery.fee,
      status: delivery.status,
      sourceLat: delivery.startLocation.latitude,
      sourceLong: delivery.startLocation.longitude,
      destinationLat: delivery.endLocation!.latitude,
      destinationLong: delivery.endLocation!.longitude,
      startTime: delivery.startTime ? delivery.startTime.toISOString() : null, 
      endTime: delivery.endTime ? delivery.endTime.toISOString() : null, 
      customerPhone: delivery.customer!.phonenumber, 
    }));

    res.status(200).json(formattedDeliveries);
  } catch (error) {
    console.error('Error fetching delivery history:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}