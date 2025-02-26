'use client';

import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    title: 'Weekly Insights',
    description: "Weekly updates on your baby's development with personalized insights.",
    emoji: '📊',
    color: 'bg-blue-50',
  },
  {
    title: 'Symptom Tracker',
    description: 'Track symptoms and get AI-powered recommendations for relief.',
    emoji: '📝',
    color: 'bg-purple-50',
  },
  {
    title: 'Nutrition Guide',
    description: 'Personalized nutrition advice for each trimester of your pregnancy.',
    emoji: '🥗',
    color: 'bg-green-50',
  },
  {
    title: 'Appointment Manager',
    description: "Never miss a doctor's appointment with smart reminders.",
    emoji: '🗓️',
    color: 'bg-red-50',
  },
  {
    title: 'Community Support',
    description: 'Connect with other expecting mothers at similar stages.',
    emoji: '👪',
    color: 'bg-yellow-50',
  },
  {
    title: 'AI Birth Plan',
    description: 'Create a customized birth plan with our AI assistant.',
    emoji: '🤖',
    color: 'bg-indigo-50',
  },
];

const TESTIMONIALS = [
  {
    quote: "This app has been a lifesaver during my pregnancy journey. The weekly updates are so detailed!",
    name: "Sophie, 28 weeks",
    emoji: "😊",
  },
  {
    quote: "The symptom tracker helped me identify patterns and discuss them with my doctor. Highly recommend!",
    name: "Emma, new mom",
    emoji: "🌟",
  },
  {
    quote: "I love the nutrition guides - they've made healthy eating during pregnancy so much easier.",
    name: "Olivia, 16 weeks",
    emoji: "💯",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="border-b backdrop-blur-sm sticky top-0 z-50 glass">
        <div className="container-center">
          <div className="flex justify-between h-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 flex items-center"
            >
              <h1 className="text-2xl font-bold text-primary">
                Pregnancy<span className="text-gradient">Plus</span>
              </h1>
            </motion.div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-24 right-0 w-96 h-96 blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 blob"></div>
          
          <div className="container-center relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 flex justify-center"
              >
                <span className="text-7xl">🤰</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
              >
                Your <span className="text-gradient">complete</span> pregnancy companion
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl text-muted-foreground mb-8 max-w-2xl"
              >
                Track your journey, get personalized insights, and connect with a supportive community, all in one beautifully designed app.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/signup">
                  <Button size="lg" className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90">
                    Start your journey
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="rounded-full h-12 px-8">
                    Explore features
                  </Button>
                </Link>
              </motion.div>
              
              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-12 flex items-center justify-center text-sm text-muted-foreground"
              >
                <div className="flex -space-x-1 mr-3">
                  {['💙', '💜', '💕', '💖'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-background shadow-sm flex items-center justify-center text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <span>Trusted by 10,000+ expecting mothers</span>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container-center">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need for your pregnancy journey</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                PregnancyPlus provides all the tools to navigate your pregnancy with confidence and joy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                        {feature.emoji}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-secondary">
          <div className="container-center">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Loved by expecting mothers</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of women who have transformed their pregnancy journey with PregnancyPlus.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-background border-none shadow-sm">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="text-4xl mb-4">{testimonial.emoji}</div>
                      <p className="italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                      <p className="mt-auto font-medium">{testimonial.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container-center">
            <Card className="border-none shadow-lg overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  <span className="text-6xl mb-6">🌟</span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Start your pregnancy journey today</h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                    Join thousands of expecting mothers who trust PregnancyPlus for a healthier, happier pregnancy experience.
                  </p>
                  <Link href="/signup">
                    <Button size="lg" className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90">
                      Create free account
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <footer className="border-t">
        <div className="container-center py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Testimonials</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Connect</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" className="text-foreground hover:text-primary transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2025 PregnancyPlus. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
