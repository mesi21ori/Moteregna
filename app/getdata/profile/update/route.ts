import { PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies or authorization header
    const cookieStore = cookies()
    const tokenFromCookie = cookieStore.get("session_token")?.value
    const authHeader = request.headers.get("authorization")
    const tokenFromHeader = authHeader?.split(" ")[1]

    const token = tokenFromHeader || tokenFromCookie

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token provided" }, { status: 401 })
    }

    // Verify token and extract user ID
    let userId: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string }
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid token" }, { status: 401 })
    }

    // Get request body
    const { firstName, middleName, lastName, phone } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { success: false, message: "First name, last name, and phone are required" },
        { status: 400 },
      )
    }

    // Check if phone number is already in use by another user
    if (phone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          phone,
          id: {
            not: userId,
          },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Phone number is already in use by another user" },
          { status: 400 },
        )
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        middleName,
        lastName,
        phone,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        middleName: updatedUser.middleName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
      },
    })
  } catch (error) {
    console.error("Error updating profile:", error)
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
