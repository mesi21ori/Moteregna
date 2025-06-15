import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { serialize } from "cookie"
import { z } from "zod"

const prisma = new PrismaClient()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string

const signInWithFcmSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
  fcmToken: z.string().optional(), 
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { phone, password, fcmToken } = signInWithFcmSchema.parse(req.body)

    const customer = await prisma.customer.findFirst({
      where: { phone },
    })

    if (!customer) {
      return res.status(401).json({ message: "Invalid phone or password" })
    }

    const passwordValid = await bcrypt.compare(password, customer.password)
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid phone or password" })
    }

    let updatedCustomer = customer
    if (fcmToken) {
      updatedCustomer = await prisma.customer.update({
        where: { id: customer.id },
        data: { fcmToken },
      })
    }

    const token = jwt.sign(
      {
        userId: customer.id,
        role: "CUSTOMER",
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      JWT_SECRET_KEY,
      { expiresIn: "7d" },
    )

    res.setHeader("Set-Cookie", [
      serialize("session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
        path: "/",
      }),
      serialize("logged_in", "true", {
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
        path: "/",
      }),
    ])

    return res.status(200).json({
      message: "Sign in successful",
      customer: {
        id: updatedCustomer.id,
        phone: updatedCustomer.phone,
        firstName: updatedCustomer.firstName,
        lastName: updatedCustomer.lastName,
        address: updatedCustomer.address,
        fcmToken: updatedCustomer.fcmToken,
      },
      token,
    })
  } catch (error) {
    console.error("Sign in error:", error)

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      })
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
