import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import jwt from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

const priceSchema = z.object({
  basePrice: z.number().min(0, "Base price must be positive"),
  perKmPrice: z.number().min(0, "Per KM price must be positive"),
  perMinutePrice: z.number().min(0, "Per minute price must be positive").optional(),
  isActive: z.boolean().optional(),
})

const validateToken = (token: string): { userId: string; role: string } | null => {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is not set in environment variables.")
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { userId: string; role: string }
    return decoded
  } catch (error) {
    console.error("Token validation failed:", error)
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.session_token

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" })
    }

    const decoded = validateToken(token)
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" })
    }

    if (!["ADMIN", "SUPERADMIN"].includes(decoded.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Only admins can create prices" })
    }

    const validatedData = priceSchema.parse(req.body)

    // If this price is set as active, deactivate all other prices
    if (validatedData.isActive) {
      await prisma.price.updateMany({
        where: {
          userId: decoded.userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      })
    }

    const newPrice = await prisma.price.create({
      data: {
        Price: validatedData.basePrice,
        perkilometer: validatedData.perKmPrice,
        perminute: validatedData.perMinutePrice ?? 0.5, // Default value if not provided
        isActive: validatedData.isActive ?? false,
        isActiveDate: validatedData.isActive ? new Date() : null,
        userId: decoded.userId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return res.status(201).json({
      success: true,
      message: "Price created successfully",
      data: {
        id: newPrice.id,
        basePrice: newPrice.Price,
        perKmPrice: newPrice.perkilometer,
        perMinutePrice: newPrice.perminute,
        isActive: newPrice.isActive,
        isActiveDate: newPrice.isActiveDate,
        createdAt: newPrice.createdAt,
        updatedBy: `${newPrice.user.firstName} ${newPrice.user.lastName}`,
      },
    })
  } catch (error) {
    console.error("Error:", error)

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      })
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      })
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
    })
  } finally {
    await prisma.$disconnect()
  }
}
