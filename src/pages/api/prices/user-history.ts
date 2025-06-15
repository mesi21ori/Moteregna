import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

const validateToken = (token: string): { userId: string } | null => {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is not set in environment variables.")
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { userId: string }
    return decoded
  } catch (error) {
    console.error("Token validation failed:", error)
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
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

    const prices = await prisma.price.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    const formattedPrices = prices.map((price) => ({
      id: price.id,
      basePrice: price.Price,
      perKmPrice: price.perkilometer,
      perMinutePrice: price.perminute,
      isActive: price.isActive,
      isActiveDate: price.isActiveDate,
      createdAt: price.createdAt.toISOString().split("T")[0],
      updatedBy: `${price.user.firstName} ${price.user.lastName}`,
    }))

    return res.status(200).json({
      success: true,
      data: formattedPrices,
    })
  } catch (error) {
    console.error("Error:", error)

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
