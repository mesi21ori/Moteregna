import { PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or authorization header
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

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        phone: true,
        gender: true,
        birthdate: true,
        address: true,
        profile: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Format the response data
    const responseData = {
      id: user.id,
      name: `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phone: user.phone,
      gender: user.gender,
      birthdate: user.birthdate ? user.birthdate.toISOString() : null,
      address: user.address || "",
      role: user.role,
      status: user.status ? "Active" : "Inactive",
      profilePhoto: user.profile || "/placeholder.svg",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
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
