"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Candy, Search, ShoppingCart, LogOut, Settings } from "lucide-react"

interface Sweet {
  _id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
}

interface User {
  email: string
  role: string
}

export default function ShopPage() {
  const router = useRouter()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
    fetchSweets()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
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

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sweets?search=${search}`)
      const data = await response.json()
      setSweets(data.sweets)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (sweetId: string) => {
    setPurchasing(sweetId)
    try {
      const response = await fetch(`/api/sweets/${sweetId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      })

      if (response.ok) {
        fetchSweets()
        alert("Purchase successful!")
      } else {
        const data = await response.json()
        alert(data.error || "Purchase failed")
      }
    } catch (error) {
      alert("Something went wrong")
    } finally {
      setPurchasing(null)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink/10 via-candy-lavender/10 to-candy-blue/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-candy-pink rounded-xl">
                <Candy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-candy-primary">Sweet Shop</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user?.role === "admin" && (
                <Button variant="outline" size="sm" onClick={() => router.push("/admin")} className="gap-2">
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for sweets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12"
              />
            </div>
            <Button onClick={handleSearch} className="h-12 px-6 bg-candy-primary hover:bg-candy-primary/90">
              Search
            </Button>
          </div>
        </div>

        {/* Sweets Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <Candy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No sweets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <Card key={sweet._id} className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-candy-pink/20 to-candy-lavender/20 flex items-center justify-center">
                  {sweet.imageUrl ? (
                    <img
                      src={sweet.imageUrl || "/placeholder.svg"}
                      alt={sweet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Candy className="w-20 h-20 text-candy-primary/30" />
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl text-candy-primary">{sweet.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {sweet.category}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {sweet.description || "Delicious sweet treat"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-candy-primary">${sweet.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {sweet.quantity > 0 ? `${sweet.quantity} in stock` : "Out of stock"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full gap-2 bg-candy-accent hover:bg-candy-accent/90 text-white font-semibold"
                    disabled={sweet.quantity === 0 || purchasing === sweet._id}
                    onClick={() => handlePurchase(sweet._id)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {purchasing === sweet._id ? "Purchasing..." : sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
