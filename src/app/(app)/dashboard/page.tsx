import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  CalendarDays, 
  Activity, 
  Baby, 
  Heart, 
  MessageSquare, 
  List, 
  Apple,
  ArrowRight
} from 'lucide-react'

// This would normally be fetched from the server/database
const mockUser = {
  name: 'Jessica',
  dueDate: new Date('2024-09-15'),
  currentWeek: 18,
  trimester: 'second' as const,
  babySize: {
    fruit: 'bell pepper',
    lengthCm: 14.2,
    weightG: 190
  },
  recentSymptoms: [
    { id: '1', name: 'Back pain', severity: 2, date: '2023-05-10' },
    { id: '2', name: 'Fatigue', severity: 3, date: '2023-05-09' }
  ],
  upcomingMilestones: [
    { id: '1', title: 'Anatomy scan', week: 20, description: 'Detailed ultrasound to check baby\'s development' },
    { id: '2', title: 'Glucose screening', week: 24, description: 'Test for gestational diabetes' }
  ]
}

export default function DashboardPage() {
  const totalWeeks = 40
  const percentComplete = Math.round((mockUser.currentWeek / totalWeeks) * 100)
  
  return (
    <div className="container py-6 space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {mockUser.name}</h1>
      <h2 className="text-xl text-muted-foreground">Here's your pregnancy journey</h2>
      
      {/* Progress Tracker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Week {mockUser.currentWeek} of 40</CardTitle>
          <CardDescription>
            {mockUser.trimester.charAt(0).toUpperCase() + mockUser.trimester.slice(1)} Trimester
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={percentComplete} className="h-2" />
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>{percentComplete}% complete</span>
            </div>
            <div className="flex items-center gap-1">
              <Baby className="h-4 w-4 text-muted-foreground" />
              <span>Due on {mockUser.dueDate.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Baby Development */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Baby Development</CardTitle>
            <CardDescription>This week's growth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                <Apple className="h-16 w-16 text-primary" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-1 text-center">
              <span className="text-xl font-semibold">Size of a {mockUser.babySize.fruit}</span>
              <span className="text-sm text-muted-foreground">
                ~{mockUser.babySize.lengthCm} cm, {mockUser.babySize.weightG} g
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/week/${mockUser.currentWeek}`} className="w-full">
              <Button variant="outline" className="w-full">
                View week details
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Recent Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Symptoms</CardTitle>
            <CardDescription>Your logged health data</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockUser.recentSymptoms.map((symptom) => (
                <li key={symptom.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>{symptom.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(symptom.severity)].map((_, i) => (
                        <Heart key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                      {[...Array(5 - symptom.severity)].map((_, i) => (
                        <Heart key={i} className="h-3.5 w-3.5 text-muted-foreground" />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/symptoms" className="w-full">
              <Button variant="outline" className="w-full">
                Track symptoms
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Upcoming Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
            <CardDescription>What to expect next</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockUser.upcomingMilestones.map((milestone) => (
                <li key={milestone.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{milestone.title}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Week {milestone.week}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ask AI Assistant</CardTitle>
            <CardDescription>
              Get answers to your pregnancy questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our AI can help with common pregnancy questions, symptom explanations, and baby development info.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/chat" className="w-full">
              <Button className="w-full flex items-center justify-between">
                Start chatting 
                <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>This Week's Content</CardTitle>
            <CardDescription>
              Learn what's happening in week {mockUser.currentWeek}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Read about your baby's development, body changes, and what to prepare for this week.
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/week/${mockUser.currentWeek}`} className="w-full">
              <Button className="w-full flex items-center justify-between" variant="secondary">
                Explore week {mockUser.currentWeek}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 