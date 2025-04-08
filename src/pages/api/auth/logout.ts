import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';
import { NextApiResponse } from 'next';
import { authenticate } from '../../../../lib/auth';
import { AuthenticatedRequest } from '../../../type/types';

const prisma = new PrismaClient();

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authentication middleware should set req.userId
    const userId = req.userId; // Comes from session/token, NOT query params
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { 
        isLoggedIn: false, 
        sessionId: null 
      },
    });

    // Clear the HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      serialize('session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1, // Expire immediately
        path: '/',
        sameSite: 'strict'
      })
    );

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}