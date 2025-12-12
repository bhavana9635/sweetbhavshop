-- Insert sample sweets
db.sweets.insertMany([
  {
    name: "Chocolate Truffles",
    category: "Chocolate",
    price: 5.99,
    quantity: 50,
    description: "Rich and creamy chocolate truffles",
    imageUrl: "/placeholder.svg?height=300&width=400",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gummy Bears",
    category: "Gummy",
    price: 3.49,
    quantity: 100,
    description: "Colorful and chewy gummy bears",
    imageUrl: "/placeholder.svg?height=300&width=400",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Lollipops",
    category: "Hard Candy",
    price: 1.99,
    quantity: 75,
    description: "Sweet and fruity lollipops",
    imageUrl: "/placeholder.svg?height=300&width=400",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Caramel Chews",
    category: "Caramel",
    price: 4.49,
    quantity: 60,
    description: "Soft and buttery caramel candies",
    imageUrl: "/placeholder.svg?height=300&width=400",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sour Worms",
    category: "Sour",
    price: 3.99,
    quantity: 80,
    description: "Tangy and sour gummy worms",
    imageUrl: "/placeholder.svg?height=300&width=400",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mint Chocolates",
    category: "Chocolate",
    price: 6.49,
    quantity: 40,
    description: "Refreshing mint-filled chocolates",
    imageUrl: "/placeholder.svg?height=300&width=400",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- Insert an admin user (password: admin123)
-- Note: In production, hash this password using bcrypt
db.users.insertOne({
  email: "admin@sweetshop.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "admin",
  createdAt: new Date()
});
