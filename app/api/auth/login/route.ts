import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, createToken } from "@/lib/auth"
import type { User } from "@/lib/db/models"

export async function POST(request: NextRequest) {
  try {
    console.log("Login attempt started")
    const { email, password } = await request.json()

    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Normalize email to lowercase for consistent lookup
    const normalizedEmail = email.toLowerCase().trim()

    console.log("Connecting to database...")
    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    console.log("Looking up user:", normalizedEmail)
    const user = await usersCollection.findOne({ email: normalizedEmail })
    if (!user) {
      console.log("User not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("Verifying password...")
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      console.log("Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("Creating JWT token...")
    const token = await createToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    })

    console.log("Setting auth cookie...")
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("Login successful!")
    return response
  } catch (error) {
    console.error("Login error:", error)
    
    // Log full error details for debugging
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    
    // Return more detailed error in development, generic in production
    const errorMessage = process.env.NODE_ENV === "development" 
      ? (error instanceof Error ? error.message : "Unknown error")
      : "Internal server error. Please check server logs."
    
    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
