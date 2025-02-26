'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/ui/theme-toggle';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">PregnancyPlus</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8">
        {/* Hero Section */}
        <section className="py-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your pregnancy journey, <span className="text-primary">beautifully guided</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Week-by-week guidance, expert-backed information, and a supportive community of mothers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Journey
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                See Features
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need for a healthy pregnancy</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Personalized Tracking',
                description: 'Custom insights and guidance for your unique pregnancy experience.'
              },
              {
                title: 'Health & Symptoms',
                description: 'Easily monitor your well-being and share insights with your doctor.'
              },
              {
                title: 'Supportive Community',
                description: 'Connect with women at your exact stage of pregnancy.'
              },
              {
                title: 'Nutrition & Wellness',
                description: 'Meal plans and self-care routines designed for pregnancy.'
              }
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Mothers Say</h2>
            <p className="text-muted-foreground mt-2">Experiences from our community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "This app has been my daily companion throughout my pregnancy. The weekly updates are so detailed.",
                name: "Sarah",
                role: "First-time mom"
              },
              {
                quote: "I love how the nutrition guides are actually realistic! The community has become my support system.",
                name: "Emma",
                role: "Due in July"
              },
              {
                quote: "After using three different pregnancy apps with my first baby, this is the only one I'm using this time.",
                name: "Michelle",
                role: "Second pregnancy"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardDescription className="italic">"{testimonial.quote}"</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 text-center">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to begin your journey?</CardTitle>
              <CardDescription>Join thousands of expectant mothers who trust PregnancyPlus</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href="/signup">
                <Button size="lg">Get Started Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8 bg-muted/40">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2024 PregnancyPlus. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
