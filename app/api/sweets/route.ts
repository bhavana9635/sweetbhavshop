import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Sweet } from "@/lib/db/models"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    const db = await getDatabase()
    const sweetsCollection = db.collection<Sweet>("sweets")

    // Build query
    const query: any = {}

    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    if (category) {
      query.category = category
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    const sweets = await sweetsCollection.find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ sweets })
  } catch (error) {
    console.error("Get sweets error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { name, category, price, quantity, description, imageUrl } = await request.json()

    if (!name || !category || price === undefined || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const sweetsCollection = db.collection<Sweet>("sweets")

    const newSweet: Sweet = {
      name,
      category,
      price: Number.parseFloat(price),
      quantity: Number.parseInt(quantity),
      description,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await sweetsCollection.insertOne(newSweet)

    return NextResponse.json(
      {
        message: "Sweet added successfully",
        sweet: { _id: result.insertedId, ...newSweet },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Add sweet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
