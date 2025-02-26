import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  MessageCircle, 
  LineChart, 
  BookOpen, 
  Heart,
  ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Your Personal Pregnancy Journey Assistant
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Track your pregnancy, monitor symptoms, and get personalized guidance with our AI-powered assistant.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-1.5">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {/* Placeholder for hero image */}
              <div className="relative w-full max-w-[500px] aspect-square rounded-full bg-gradient-to-br from-primary to-primary-foreground/20 flex items-center justify-center">
                <Heart className="w-1/3 h-1/3 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Everything You Need for Your Pregnancy Journey
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Our comprehensive tools help you track, learn, and prepare for your baby's arrival.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <Calendar className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Weekly Tracking</h3>
              <p className="text-sm text-muted-foreground text-center">
                Follow your baby's development with detailed week-by-week updates.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <LineChart className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Symptom Logger</h3>
              <p className="text-sm text-muted-foreground text-center">
                Track your symptoms and get insights into your pregnancy health.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <MessageCircle className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">AI Assistant</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get personalized answers to your pregnancy questions anytime.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <BookOpen className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Knowledge Hub</h3>
              <p className="text-sm text-muted-foreground text-center">
                Access comprehensive guides on pregnancy, birth, and baby care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Loved by Expectant Parents
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                See what our users have to say about their journey with PregnancyPal.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="flex flex-col space-y-2 border rounded-lg p-6 shadow-sm bg-background">
              <p className="text-sm text-muted-foreground">
                "The AI assistant has been incredibly helpful during my pregnancy journey. It's like having a midwife on call 24/7!"
              </p>
              <p className="font-medium">— Sarah M.</p>
            </div>
            <div className="flex flex-col space-y-2 border rounded-lg p-6 shadow-sm bg-background">
              <p className="text-sm text-muted-foreground">
                "I love the weekly updates and how I can track all my symptoms in one place. This app has been my pregnancy companion."
              </p>
              <p className="font-medium">— Jessica T.</p>
            </div>
            <div className="flex flex-col space-y-2 border rounded-lg p-6 shadow-sm bg-background">
              <p className="text-sm text-muted-foreground">
                "As a first-time dad, this app has helped me understand what my partner is experiencing and how I can better support her."
              </p>
              <p className="font-medium">— Michael K.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center text-primary-foreground">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Begin Your Pregnancy Journey Today
              </h2>
              <p className="max-w-[700px] md:text-xl">
                Join thousands of parents tracking their pregnancy with PregnancyPal.
              </p>
            </div>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-1.5">
                Get Started Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold">PregnancyPal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PregnancyPal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 