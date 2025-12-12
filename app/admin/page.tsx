"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Candy, Plus, Pencil, Trash2, Package, ArrowLeft } from "lucide-react"

interface Sweet {
  _id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    imageUrl: "",
  })

  useEffect(() => {
    checkAdmin()
    fetchSweets()
  }, [])

  const checkAdmin = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        if (data.user.role !== "admin") {
          router.push("/shop")
        }
      } else {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    }
  }

  const fetchSweets = async () => {
    try {
      const response = await fetch("/api/sweets")
      const data = await response.json()
      setSweets(data.sweets)
    } catch (error) {
      console.error("Failed to fetch sweets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingSweet ? `/api/sweets/${editingSweet._id}` : "/api/sweets"
      const method = editingSweet ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchSweets()
        setOpen(false)
        resetForm()
      } else {
        const data = await response.json()
        alert(data.error || "Operation failed")
      }
    } catch (error) {
      alert("Something went wrong")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return

    try {
      const response = await fetch(`/api/sweets/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchSweets()
      }
    } catch (error) {
      alert("Failed to delete sweet")
    }
  }

  const handleRestock = async (id: string) => {
    const quantity = prompt("Enter quantity to add:")
    if (!quantity) return

    try {
      const response = await fetch(`/api/sweets/${id}/restock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number.parseInt(quantity) }),
      })

      if (response.ok) {
        fetchSweets()
      }
    } catch (error) {
      alert("Failed to restock")
    }
  }

  const openAddDialog = () => {
    resetForm()
    setEditingSweet(null)
    setOpen(true)
  }

  const openEditDialog = (sweet: Sweet) => {
    setEditingSweet(sweet)
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      description: sweet.description || "",
      imageUrl: sweet.imageUrl || "",
    })
    setOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      description: "",
      imageUrl: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink/10 via-candy-lavender/10 to-candy-blue/10">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-candy-pink rounded-xl">
                <Candy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-candy-primary">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Manage your sweet inventory</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/shop")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Sweet Inventory</CardTitle>
                <CardDescription>Add, edit, or remove sweets from your shop</CardDescription>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog} className="gap-2 bg-candy-primary hover:bg-candy-primary/90">
                    <Plus className="w-4 h-4" />
                    Add Sweet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingSweet ? "Edit Sweet" : "Add New Sweet"}</DialogTitle>
                    <DialogDescription>
                      {editingSweet ? "Update the sweet details" : "Fill in the details for your new sweet"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-candy-primary hover:bg-candy-primary/90">
                        {editingSweet ? "Update" : "Add"} Sweet
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sweets.map((sweet) => (
                    <TableRow key={sweet._id}>
                      <TableCell className="font-medium">{sweet.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{sweet.category}</Badge>
                      </TableCell>
                      <TableCell>${sweet.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={sweet.quantity > 10 ? "default" : sweet.quantity > 0 ? "secondary" : "destructive"}
                        >
                          {sweet.quantity} units
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestock(sweet._id)}
                            className="gap-1"
                          >
                            <Package className="w-3 h-3" />
                            Restock
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(sweet)} className="gap-1">
                            <Pencil className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(sweet._id)}
                            className="gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
