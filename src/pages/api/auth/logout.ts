import { PrismaClient } from '@prisma/client';
import { parse } from 'cookie';
import { serialize } from 'cookie';
import { verifyToken } from '../../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {

    const cookies = parse(req.headers.cookie || '');
    const token = cookies.session_token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userId = verifyToken(token);

    if (!userId) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isLoggedIn: false },
    });

    res.setHeader('Set-Cookie', serialize('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1, 
      path: '/',
    }));

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}