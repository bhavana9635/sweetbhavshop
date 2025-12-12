import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { User } from "@/lib/db/models"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    const user = await usersCollection.findOne(
      { _id: new ObjectId(session.userId as string) },
      { projection: { password: 0 } },
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
