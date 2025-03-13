import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'; 

const prisma = new PrismaClient();

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {

    const validatedData = signinSchema.parse(req.body);

   
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (user.isLoggedIn) {
      await prisma.user.updateMany({
        where: {
          isLoggedIn: true,
          NOT: {
            id: user.id,
          },
        },
        data: { isLoggedIn: false },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isLoggedIn: true },
    });

  
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    
    res.setHeader('Set-Cookie', serialize('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, 
      path: '/',
    }));

    
    res.status(200).json({
      message: 'Sign-in successful',
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error during sign-in:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}