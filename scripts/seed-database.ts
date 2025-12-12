import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sweetshop"

async function seedDatabase() {
  console.log("Connecting to MongoDB...")
  const client = await MongoClient.connect(MONGODB_URI)
  const db = client.db()

  console.log("Creating indexes...")

  // Users collection indexes
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("users").createIndex({ createdAt: 1 })

  // Sweets collection indexes
  await db.collection("sweets").createIndex({ name: 1 })
  await db.collection("sweets").createIndex({ category: 1 })
  await db.collection("sweets").createIndex({ price: 1 })
  await db.collection("sweets").createIndex({ createdAt: -1 })

  // Purchases collection indexes
  await db.collection("purchases").createIndex({ userId: 1 })
  await db.collection("purchases").createIndex({ sweetId: 1 })
  await db.collection("purchases").createIndex({ purchaseDate: -1 })

  console.log("Inserting sample sweets...")

  // Clear existing data
  await db.collection("sweets").deleteMany({})

  // Insert sample sweets
  await db.collection("sweets").insertMany([
    {
      name: "Chocolate Truffles",
      category: "Chocolate",
      price: 5.99,
      quantity: 50,
      description: "Rich and creamy chocolate truffles",
      imageUrl: "/chocolate-truffles.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Gummy Bears",
      category: "Gummy",
      price: 3.49,
      quantity: 100,
      description: "Colorful and chewy gummy bears",
      imageUrl: "/colorful-gummy-bears.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Lollipops",
      category: "Hard Candy",
      price: 1.99,
      quantity: 75,
      description: "Sweet and fruity lollipops",
      imageUrl: "/colorful-lollipops.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Caramel Chews",
      category: "Caramel",
      price: 4.49,
      quantity: 60,
      description: "Soft and buttery caramel candies",
      imageUrl: "/caramel-candy.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Sour Worms",
      category: "Sour",
      price: 3.99,
      quantity: 80,
      description: "Tangy and sour gummy worms",
      imageUrl: "/sour-gummy-worms.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Mint Chocolates",
      category: "Chocolate",
      price: 6.49,
      quantity: 40,
      description: "Refreshing mint-filled chocolates",
      imageUrl: "/mint-chocolate.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Strawberry Jellies",
      category: "Gummy",
      price: 4.99,
      quantity: 65,
      description: "Sweet strawberry-flavored jellies",
      imageUrl: "/strawberry-jelly-candy.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Rainbow Lollipops",
      category: "Hard Candy",
      price: 2.49,
      quantity: 90,
      description: "Multi-colored swirl lollipops",
      imageUrl: "/rainbow-swirl-lollipop.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  console.log("Creating admin user...")

  // Create admin user with hashed password
  const hashedPassword = await bcrypt.hash("admin123", 10)

  try {
    await db.collection("users").insertOne({
      email: "admin@sweetshop.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    })
    console.log("Admin user created: admin@sweetshop.com / admin123")
  } catch (error) {
    console.log("Admin user already exists, skipping...")
  }

  console.log("Database seeded successfully!")
  await client.close()
}

seedDatabase().catch(console.error)
