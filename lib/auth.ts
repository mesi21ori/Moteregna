import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
  userRole?: string;
  user?: any;
}

export const authenticate = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const token = req.cookies.session_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY) as { 
        userId: string;
        sessionId: string;
        role: string;
        firstName?: string;
        lastName?: string;
        email?: string;
      };

      // Verify session in database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.sessionId !== decoded.sessionId || !user.isLoggedIn) {
        // Clear invalid token
        res.setHeader('Set-Cookie', [
          serialize('session_token', '', { maxAge: -1, path: '/' }),
          serialize('logged_in', '', { maxAge: -1, path: '/' })
        ]);
        return res.status(401).json({ message: 'Session expired or invalid' });
      }

      // Attach user info to request
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      req.user = {
        ...decoded,
        profile: user.profile
      };
      
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};