import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  gender: z.string().optional(),
  birthdate: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  licenseNumber: z.string().min(1, "License number is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehiclePlateNumber: z.string().min(1, "Vehicle plate number is required"),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    
    const validatedData = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

   
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        gender: validatedData.gender,
        birthdate: validatedData.birthdate ? new Date(validatedData.birthdate) : null,
        phone: validatedData.phone,
        address: validatedData.address,
        role: 'MOTORIST', 
      },
    });

    const newMotorist = await prisma.motorist.create({
      data: {
        userId: newUser.id,
        licenseNumber: validatedData.licenseNumber,
        vehicleModel: validatedData.vehicleModel,
        vehiclePlateNumber: validatedData.vehiclePlateNumber,
      },
    });


    res.status(201).json({
      message: 'Motorist registered successfully',
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
      motorist: { id: newMotorist.id, licenseNumber: newMotorist.licenseNumber },
    });
  } catch (error) {
    console.error('Error during motorist registration:', error);

    if (error instanceof z.ZodError) {
    
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}