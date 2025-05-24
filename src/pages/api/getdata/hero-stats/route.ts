import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get total motorists count
    const totalMotorists = await prisma.motorist.count()

    // Get customers served today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const customersServedToday = await prisma.delivery.count({
      where: {
        status: "DELIVERED",
        updatedAt: {
          gte: today,
        },
      },
    })

    // Calculate average daily customers for the past week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    oneWeekAgo.setHours(0, 0, 0, 0)

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

    return NextResponse.json({
      success: true,
      data: {
        totalMotorists,
        customersServedToday,
        avgDailyCustomers,
      },
    })
  } catch (error) {
    console.error("Error fetching hero stats:", error)
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
