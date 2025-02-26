import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { DynamicSections } from '@/components/sections/DynamicSections';

// This is a Server Component by default since we removed 'use client'
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
            <div className="mr-2">
              <ModeToggle />
            </div>
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8">
        
        {/* Hero Section - Critical first view content */}
        <section className="py-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your pregnancy journey, <span className="text-primary">beautifully guided</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track your progress, record symptoms, and receive personalized insights throughout your pregnancy.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-full">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-full">
                Log In
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Dynamically loaded sections */}
        <DynamicSections />
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
