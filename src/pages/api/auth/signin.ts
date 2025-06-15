import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const signinSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = signinSchema.parse(req.body);
    
    const user = await prisma.user.findFirst({
      where: { phone: validatedData.phone },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password ?? "");

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const sessionId = uuidv4();

    if (user.isLoggedIn) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isLoggedIn: false, sessionId: null }, 
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isLoggedIn: true, sessionId }, 
    });

    const motorist = await prisma.motorist.findFirst({
      where: { userId: user.id }
    });
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role, sessionId },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '30d' } 
    );

    res.setHeader(
      'Set-Cookie',
      serialize('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, 
        path: '/',
      })
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Sign-in successful',
      data: userWithoutPassword,
      accessToken: token,
      motorist: motorist
    });
  } catch (error) {
    console.error('Error during sign-in:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }


    res.status(500).json({ 
      message: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

