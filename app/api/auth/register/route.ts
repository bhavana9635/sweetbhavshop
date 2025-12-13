import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, createToken } from "@/lib/auth"
import type { User } from "@/lib/db/models"

export async function POST(request: NextRequest) {
  try {
    console.log("Registration attempt started")
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Normalize email to lowercase for consistent storage
    const normalizedEmail = email.toLowerCase().trim()

    console.log("Connecting to database...")
    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Check if user already exists
    console.log("Checking if user exists:", normalizedEmail)
    const existingUser = await usersCollection.findOne({ email: normalizedEmail })
    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password and create user
    console.log("Hashing password...")
    const hashedPassword = await hashPassword(password)

    const userCount = await usersCollection.countDocuments()
    const role = userCount === 0 ? "admin" : "user"
    console.log("User will be:", role)

    const newUser: User = {
      email: normalizedEmail,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    }

    console.log("Creating user...")
    const result = await usersCollection.insertOne(newUser)

    // Create token
    console.log("Creating JWT token...")
    const token = await createToken({
      userId: result.insertedId.toString(),
      email: normalizedEmail,
      role,
    })

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: result.insertedId,
          email: normalizedEmail,
          role,
        },
      },
      { status: 201 },
    )

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("Registration successful!")
    return response
  } catch (error) {
    console.error("Registration error:", error)
    
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
