import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.session_token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      userId: string
      role: string
    }

    if (decoded.role !== "SUPERADMIN" && decoded.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only admins can view pricing history",
      })
    }

    // Safely parse pagination parameters with fallbacks
    const pageStr = req.query.page as string | undefined
    const limitStr = req.query.limit as string | undefined
    const search = (req.query.search as string) || ""

    // Default to page 1 and limit 10 if values are missing or invalid
    const pageNumber = pageStr && !isNaN(Number.parseInt(pageStr)) ? Number.parseInt(pageStr) : 1
    const limitNumber = limitStr && !isNaN(Number.parseInt(limitStr)) ? Number.parseInt(limitStr) : 10

    // Calculate skip value
    const skip = (pageNumber - 1) * limitNumber

    // Build the where clause for search
    const where = search
      ? {
          user: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
            ],
          },
        }
      : {}

    const [prices, totalCount] = await Promise.all([
      prisma.price.findMany({
        where,
        skip,
        take: limitNumber, // Ensure take is always provided
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.price.count({ where }),
    ])

    return res.status(200).json({
      success: true,
      data: prices.map((price) => ({
        id: price.id, // Include ID for update operations
        basePrice: price.initialPrice,
        perKmPrice: price.perkilometer,
        createdAt: price.createdAt,
        updatedAt: price.updatedAt,
        updatedBy: `${price.user.firstName} ${price.user.lastName}`,
      })),
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    })
  } catch (error) {
    console.error("Error fetching price history:", error)

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      })
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
    })
  } finally {
    await prisma.$disconnect()
  }
}
