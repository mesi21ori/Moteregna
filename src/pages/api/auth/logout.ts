import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';
import { NextApiResponse } from 'next';
import { authenticate } from '../../../../lib/auth';
import { AuthenticatedRequest } from '../../../type/types'; 

const prisma = new PrismaClient();

export default authenticate(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.userId; 

    await prisma.user.update({
      where: { id: userId },
      data: { isLoggedIn: false, sessionId: null },
    });

    res.setHeader(
      'Set-Cookie',
      serialize('session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1, 
        path: '/',
      })
    );

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});