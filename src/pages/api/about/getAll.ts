import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      success: false,
      message: `Method ${req.method} not allowed` 
    });
  }

  try {
    const aboutContent = await prisma.about.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      data: aboutContent
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}