import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Candy, ShoppingBag, Sparkles, Heart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink via-candy-lavender to-candy-blue">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="p-6 bg-white rounded-3xl shadow-2xl">
              <Candy className="w-20 h-20 text-candy-primary" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-white text-balance leading-tight">Sweet Shop</h1>
            <p className="text-xl md:text-2xl text-white/90 text-pretty max-w-2xl mx-auto leading-relaxed">
              Your favorite candy destination. Discover delicious treats and satisfy your sweet tooth!
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="bg-white/95 backdrop-blur p-6 rounded-2xl shadow-xl">
              <ShoppingBag className="w-10 h-10 text-candy-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg text-candy-primary mb-2">Easy Shopping</h3>
              <p className="text-sm text-muted-foreground">
                Browse and purchase your favorite sweets with just a click
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur p-6 rounded-2xl shadow-xl">
              <Sparkles className="w-10 h-10 text-candy-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg text-candy-primary mb-2">Fresh & Delicious</h3>
              <p className="text-sm text-muted-foreground">All our sweets are fresh and of the highest quality</p>
            </div>
            <div className="bg-white/95 backdrop-blur p-6 rounded-2xl shadow-xl">
              <Heart className="w-10 h-10 text-candy-pink mx-auto mb-4" />
              <h3 className="font-bold text-lg text-candy-primary mb-2">Made with Love</h3>
              <p className="text-sm text-muted-foreground">Every sweet is crafted with care and passion</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              asChild
              size="lg"
              className="text-lg h-14 px-8 bg-white text-candy-primary hover:bg-white/90 shadow-xl font-bold"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg h-14 px-8 bg-white/20 backdrop-blur border-2 border-white text-white hover:bg-white/30 font-bold"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
