import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

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

    // Parse pagination parameters
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const search = (req.query.search as string) || ""
    const skip = (page - 1) * limit

    // Get total count for pagination
    const totalCount = await prisma.price.count({
      where: {
        user: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        },
      },
    })

    // Get prices with pagination
    const prices = await prisma.price.findMany({
      where: {
        user: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Format the response data
    const formattedPrices = prices.map((price) => ({
      id: price.id,
      basePrice: price.Price, // Map from Price (DB field) to basePrice (frontend field)
      perKmPrice: price.perkilometer,
      perMinutePrice: price.perminute,
      isActive: price.isActive,
      isActiveDate: price.isActiveDate,
      createdAt: price.createdAt.toISOString(),
      updatedAt: price.updatedAt.toISOString(),
      updatedBy: `${price.user.firstName} ${price.user.lastName}`,
    }))

    return res.status(200).json({
      success: true,
      data: formattedPrices,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
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
