'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">PregnancyPlus</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Profile</Button>
            <Button variant="ghost" size="sm">Settings</Button>
            <Button variant="outline" size="sm">Log out</Button>
            <ModeToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Welcome to your dashboard</CardTitle>
              <CardDescription>
                Track your pregnancy journey and get personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Week 12</h2>
                    <p className="text-muted-foreground">Second Trimester</p>
                  </div>
                  <Button>View Details</Button>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Week 1</span>
                  <span>Week 40</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="col-span-3">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">💧</span>
                        <p>Remember to drink 8-10 glasses of water today</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">🫐</span>
                        <p>Berries are packed with antioxidants and vitamin C</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">🧘‍♀️</span>
                        <p>Try prenatal yoga to relieve back pain</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Baby's Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">This week, your baby is about the size of a lime 🍋</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <p>Fingernails and toenails are forming</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <p>All essential organs are in place</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <p>Your baby can now make facial expressions</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Health Tracking</CardTitle>
                  <CardDescription>Track your symptoms and health metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12">Health tracking content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Calendar</CardTitle>
                  <CardDescription>Track your upcoming appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12">Calendar content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="community" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>July 2025 Mom Group</CardTitle>
                  <CardDescription>Connect with other moms due in July</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12">Community content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
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
              <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 