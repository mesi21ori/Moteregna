import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get total motorists count
    const totalMotorists = await prisma.motorist.count()

    // Get active motorists count
    const activeMotorists = await prisma.motorist.count({
      where: {
        isOnline: true,
      },
    })

    // Calculate average daily customers for the past week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    oneWeekAgo.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const pastWeekDeliveries = await prisma.delivery.count({
      where: {
        status: "DELIVERED",
        updatedAt: {
          gte: oneWeekAgo,
          lt: today,
        },
      },
    })

    const avgDailyCustomers = Math.round(pastWeekDeliveries / 7)

    // Get city locations and calculate coverage percentage
    const cityLocations = await prisma.location.count()

    // For the city percentage, we'll use a calculation based on locations
    // This is an estimate - you may want to adjust this based on your actual data model
    const totalPossibleLocations = 100 // This is an example value - adjust as needed
    const cityPercentage = Math.round((cityLocations / totalPossibleLocations) * 100)

    return NextResponse.json({
      success: true,
      data: {
        totalMotorists,
        activeMotorists,
        avgDailyCustomers,
        cityLocations,
        cityPercentage,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch statistics",
        error: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
