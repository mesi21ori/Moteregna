import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const getByTypeSchema = z.object({
  type: z.enum(['privacy', 'terms']),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = getByTypeSchema.parse(req.query);
    
    const privacyTerm = await prisma.privacyTerm.findMany({
      where: { type: validatedData.type },
      orderBy: { updatedAt: 'desc' },
    });

    if (!privacyTerm) {
      return res.status(404).json({ message: `${validatedData.type} policy not found` });
    }

    return res.status(200).json(privacyTerm);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.errors 
      });
    }
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}