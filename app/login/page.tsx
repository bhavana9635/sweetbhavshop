"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Candy } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        // Handle non-JSON responses
        setError("Invalid response from server. Please try again.")
        return
      }

      if (!response.ok) {
        setError(data.error || "Login failed")
        return
      }

      // Ensure navigation happens after successful login
      router.push("/shop")
      router.refresh() // Refresh to update auth state
    } catch (err) {
      console.error("Login error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-candy-pink via-candy-lavender to-candy-blue">
      <Card className="w-full max-w-md border-2 border-candy-accent/20 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-candy-pink rounded-2xl">
              <Candy className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-candy-primary">Welcome Back</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign in to your Sweet Shop account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="sweet@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-candy-primary hover:bg-candy-primary/90 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-candy-primary font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
