import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  role: "user" | "admin"
  createdAt: Date
}

export interface Sweet {
  _id?: ObjectId
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseHistory {
  _id?: ObjectId
  userId: ObjectId
  sweetId: ObjectId
  quantity: number
  totalPrice: number
  purchaseDate: Date
}
