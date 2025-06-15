import { PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies or authorization header
    const cookieStore = await cookies()
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
    const { currentPassword, newPassword } = await request.json()

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 },
      )
    }

    // Validate password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters long" },
        { status: 400 },
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password ?? "")

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Error changing password:", error)
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
