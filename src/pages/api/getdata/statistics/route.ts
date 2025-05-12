import { PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const prisma = new PrismaClient()

const timeRangeSchema = z.object({
  range: z.enum(["30days", "3months", "6months", "1year"]),
})

export async function GET(request: NextRequest) {
  try {
    // Get the range from the URL
    const url = new URL(request.url)
    const range = url.searchParams.get("range") as "30days" | "3months" | "6months" | "1year" | null

    if (!range) {
      return NextResponse.json({ success: false, message: "Bad request: Missing range parameter" }, { status: 400 })
    }

    // Validate the range
    try {
      timeRangeSchema.parse({ range })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, message: "Validation failed", errors: error.errors },
          { status: 400 },
        )
      }
    }

    const now = new Date()
    let startDate: Date

    switch (range) {
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "3months":
        startDate = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000)
        break
      case "6months":
        startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
        break
      case "1year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
    }

    const [motorists, newMotorists] = await Promise.all([
      prisma.motorist.findMany({
        where: { createdAt: { gte: startDate } },
        select: { id: true, createdAt: true, isOnline: true },
      }),
      prisma.motorist.groupBy({
        by: ["createdAt"],
        where: { createdAt: { gte: startDate } },
        _count: { _all: true },
      }),
    ])

    const monthlyData = newMotorists.reduce(
      (acc, item) => {
        const month = new Date(item.createdAt).toLocaleString("default", { month: "short" })
        acc[month] = { month, active: 0, new: item._count._all, inactive: 0 }
        return acc
      },
      {} as Record<string, { month: string; active: number; new: number; inactive: number }>,
    )

    motorists.forEach((motorist) => {
      const month = new Date(motorist.createdAt).toLocaleString("default", { month: "short" })
      if (monthlyData[month] && motorist.isOnline) {
        monthlyData[month].active++
      }
    })

    Object.values(monthlyData).forEach((data) => {
      const typedData = data as { month: string; active: number; new: number; inactive: number }
      typedData.inactive = typedData.new - typedData.active
    })

    return NextResponse.json({
      success: true,
      data: Object.values(monthlyData),
    })
  } catch (error) {
    console.error("Error in statistics API:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
