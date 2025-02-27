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
            <span className="font-bold text-xl">NuMama</span>
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
        <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:to-background rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-40 translate-x-1/4 translate-y-1/4"></div>
          
          {/* Content */}
          <div className="relative z-10 space-y-8 text-center px-4 md:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-tight">
              Your pregnancy journey, <span className="text-primary relative">
                beautifully guided
                <span className="absolute inset-x-0 bottom-0 h-3 bg-primary/10 -z-10 transform -rotate-1"></span>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track your progress, record symptoms, and receive personalized insights throughout your pregnancy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="rounded-full w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto">
                  Log In
                </Button>
              </Link>
            </div>
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
              <p className="text-sm text-muted-foreground">© 2024 NuMama. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
