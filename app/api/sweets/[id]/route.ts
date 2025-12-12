import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Sweet } from "@/lib/db/models"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { id } = await params
    const updates = await request.json()

    const db = await getDatabase()
    const sweetsCollection = db.collection<Sweet>("sweets")

    const result = await sweetsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Sweet updated successfully",
      sweet: result,
    })
  } catch (error) {
    console.error("Update sweet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { id } = await params

    const db = await getDatabase()
    const sweetsCollection = db.collection<Sweet>("sweets")

    const result = await sweetsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Sweet deleted successfully" })
  } catch (error) {
    console.error("Delete sweet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
