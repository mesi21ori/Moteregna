import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import upload from '../../../../utils/uploadMiddleware';

const prisma = new PrismaClient();

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  gender: z.string().optional(),
  birthdate: z.string().optional(),
  address: z.string().optional(),
  licenseNumber: z.string().min(1, "License number is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehiclePlateNumber: z.string().min(1, "Vehicle plate number is required"),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload error', error: err });
    }

    try {
      const validatedData = signupSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { phone: validatedData.phone },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }

      const existingMotorist = await prisma.motorist.findUnique({
        where: { licenseNumber: validatedData.licenseNumber },
      });

      if (existingMotorist) {
        return res.status(400).json({ message: 'License number already registered' });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      const Librephotopath = req.files['Librephoto']
        ? `/uploads/${req.files['Librephoto'][0].filename}`
        : null;
      const driversLicencephotoFrontPath = req.
      files['driversLicencephotoFront']
        ? `/uploads/${req.files['driversLicencephotoFront'][0].filename}`
        : null;
      const profilePath = req.files['profile']
        ? `/uploads/${req.files['profile'][0].filename}`
        : null;
      const businessPermitPath = req.files['businessPermit']
        ? `/uploads/${req.files['businessPermit'][0].filename}`
        : null;

      const newUser = await prisma.user.create({
        data: {
          firstName: validatedData.firstName,
          middleName: validatedData.middleName,
          lastName: validatedData.lastName,
          phone: validatedData.phone,
          password: hashedPassword,
          gender: validatedData.gender,
          birthdate: validatedData.birthdate ? new Date(validatedData.birthdate) : null,
          address: validatedData.address,
          profile: profilePath,
          role: 'MOTORIST',
        },
      });

      const newMotorist = await prisma.motorist.create({
        data: {
          userId: newUser.id,
          licenseNumber: validatedData.licenseNumber,
          vehicleModel: validatedData.vehicleModel,
          vehiclePlateNumber: validatedData.vehiclePlateNumber,
          Librephoto: Librephotopath!,
          driversLicencephotoFront: driversLicencephotoFrontPath!,
          businessPermit:businessPermitPath!,
        },
      });

      res.status(201).json({
        message: 'Motorist registered successfully',
        user: { id: newUser.id, phone: newUser.phone, role: newUser.role },
        motorist: { id: newMotorist.id, licenseNumber: newMotorist.licenseNumber },
      });
    } catch (error) {
      console.error('Error during motorist registration:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  });
}