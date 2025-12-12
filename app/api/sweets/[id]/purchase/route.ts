import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Sweet, PurchaseHistory } from "@/lib/db/models"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }

    const db = await getDatabase()
    const sweetsCollection = db.collection<Sweet>("sweets")
    const purchaseCollection = db.collection<PurchaseHistory>("purchases")

    const sweet = await sweetsCollection.findOne({ _id: new ObjectId(id) })

    if (!sweet) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    if (sweet.quantity < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Update sweet quantity
    await sweetsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { quantity: -quantity },
        $set: { updatedAt: new Date() },
      },
    )

    // Record purchase
    const purchase: PurchaseHistory = {
      userId: new ObjectId(session.userId as string),
      sweetId: new ObjectId(id),
      quantity,
      totalPrice: sweet.price * quantity,
      purchaseDate: new Date(),
    }

    await purchaseCollection.insertOne(purchase)

    return NextResponse.json({
      message: "Purchase successful",
      purchase,
    })
  } catch (error) {
    console.error("Purchase error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
