import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken'; 

const prisma = new PrismaClient();


const updateInitialPriceSchema = z.object({
  initialPrice: z.number().min(0, "Initial price must be a positive number"),
});

const validateToken = (token: string): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string; role: string };
    return decoded;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
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

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only admins can update the initial price' });
    }

    const validatedData = updateInitialPriceSchema.parse(req.body);

    let appConfig = await prisma.price.findFirst();

    if (!appConfig) {

      appConfig = await prisma.price.create({
        data: { initialPrice: validatedData.initialPrice },
      });
    } else {
      appConfig = await prisma.price.update({
        where: { id: appConfig.id },
        data: { initialPrice: validatedData.initialPrice },
      });
    }

    return res.status(200).json({
      message: 'Global initial price updated successfully',
      initialPrice: appConfig.initialPrice,
    });
  } catch (error) {
    console.error('Error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}