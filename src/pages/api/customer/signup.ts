import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

const customerSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  address: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    const validatedData = customerSignupSchema.parse(body);

    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: validatedData.phone },
    });

    if (existingCustomer) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newCustomer = await prisma.customer.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        password: hashedPassword,
        address: validatedData.address,
      },
    });

    return res.status(201).json({
      message: 'Customer registered successfully',
      customer: { 
        id: newCustomer.id, 
        phone: newCustomer.phone,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
      },
    });

  } catch (error) {
    console.error('Error during customer registration:', error);

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