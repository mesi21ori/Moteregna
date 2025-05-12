import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import jwt from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

// Updated schema to match what the UI is sending
const updatePriceSchema = z.object({
  id: z.string().optional(), // Make ID optional in the body
  priceId: z.string().optional(), // Alternative field name
  basePrice: z.number().min(0, "Base price must be positive"),
  perKmPrice: z.number().min(0, "Per KM price must be positive"),
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
  // Accept PUT, PATCH, and POST methods to be flexible
  if (req.method !== "PUT" && req.method !== "PATCH" && req.method !== "POST") {
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
      return res.status(403).json({ success: false, message: "Forbidden: Only admins can update prices" })
    }

    // Parse the request body
    const validatedData = updatePriceSchema.parse(req.body)

    // Try to get the price ID from multiple possible sources
    const priceId =
      (req.query.id as string) || // From query parameter
      validatedData.id || // From request body
      validatedData.priceId || // Alternative field name
      (req.query.priceId as string) // Alternative query parameter

    // If no price ID is found, get the most recent price
    let existingPrice

    if (priceId) {
      // If we have an ID, find that specific price
      existingPrice = await prisma.price.findUnique({
        where: { id: priceId },
      })

      if (!existingPrice) {
        return res.status(404).json({ success: false, message: "Price not found" })
      }
    } else {
      // If no ID provided, get the most recent price
      const latestPrices = await prisma.price.findMany({
        orderBy: { createdAt: "desc" },
        take: 1,
      })

      if (latestPrices.length === 0) {
        return res.status(404).json({ success: false, message: "No prices found" })
      }

      existingPrice = latestPrices[0]
    }

    // Update the price
    const updatedPrice = await prisma.price.update({
      where: { id: existingPrice.id },
      data: {
        initialPrice: validatedData.basePrice,
        perkilometer: validatedData.perKmPrice,
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

    return res.status(200).json({
      success: true,
      message: "Price updated successfully",
      data: {
        id: updatedPrice.id,
        basePrice: updatedPrice.initialPrice,
        perKmPrice: updatedPrice.perkilometer,
        updatedAt: updatedPrice.updatedAt,
        updatedBy: `${updatedPrice.user.firstName} ${updatedPrice.user.lastName}`,
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
