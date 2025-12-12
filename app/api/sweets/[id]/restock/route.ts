import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Sweet } from "@/lib/db/models"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { id } = await params
    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }

    const db = await getDatabase()
    const sweetsCollection = db.collection<Sweet>("sweets")

    const result = await sweetsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { quantity },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Sweet restocked successfully",
      sweet: result,
    })
  } catch (error) {
    console.error("Restock error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
