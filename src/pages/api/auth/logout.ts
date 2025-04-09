import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';
import { authenticate, AuthenticatedRequest } from 'lib/auth';
import { NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default authenticate(async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Update user's login status and clear session ID
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

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});