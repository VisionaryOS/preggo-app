'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Brain, Activity, Heart, Utensils, Calendar, Clock, Baby, ShieldAlert, TrendingUp, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Simple Skeleton component
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
);

// Define interfaces for type safety
interface Insight {
  id: number;
  title: string;
  summary: string;
  createdAt: string;
  metric: string;
  trend: string;
}

interface HealthScore {
  score: number;
  category: 'low' | 'medium' | 'high';
  change: number;
  insights: string[];
}

interface InsightState {
  health: Insight[];
  nutrition: Insight[];
  schedule: Insight[];
  momScore: HealthScore;
  babyScore: HealthScore;
}

export default function InsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(12);
  const [insights, setInsights] = useState<InsightState>({
    health: [],
    nutrition: [],
    schedule: [],
    momScore: {
      score: 82,
      category: 'high',
      change: 3,
      insights: [
        'Sleep quality has improved by 15%',
        'Stress levels are well managed',
        'Blood pressure remains stable'
      ]
    },
    babyScore: {
      score: 90,
      category: 'high',
      change: 1,
      insights: [
        'Growth is on target for gestational age',
        'Activity levels are normal',
        'Heart rate is within expected range'
      ]
    }
  });

  useEffect(() => {
    checkAuth();
    calculateCurrentWeek();
    // Load any previously generated insights
    loadInsights();
  }, []);

  // Function to check authentication and user metadata
  const checkAuth = async () => {
    try {
      const supabase = createClient();
      
      // Get the session first to check if the user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError.message);
        setIsLoading(false);
        return;
      }
      
      // If no session, handle gracefully
      if (!sessionData?.session) {
        console.log('No active session found, user may need to log in');
        setIsLoading(false);
        return;
      }
      
      // If session exists, get the user
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Auth error:', error.message);
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        setUser(data.user);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error checking auth:', err);
      setIsLoading(false);
    }
  };

  // Calculate current week of pregnancy based on due date
  const calculateCurrentWeek = () => {
    // This would typically come from the user's profile/database
    // For now, we'll use a fixed due date for demonstration
    const dueDate = new Date('2024-10-15');
    const today = new Date();
    
    // Pregnancy is approximately 40 weeks
    // Calculate backward from due date
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const weeksUntilDue = Math.floor(daysUntilDue / 7);
    const currentWeek = 40 - weeksUntilDue;
    
    // Ensure the week is between 1 and 40
    const clampedWeek = Math.max(1, Math.min(40, currentWeek));
    setCurrentWeek(clampedWeek);
  };

  // Load any previously generated insights
  const loadInsights = () => {
    // In a real app, these would come from the database
    // For now, we'll use mock insights
    setInsights({
      health: [
        { 
          id: 1, 
          title: 'Sleep Pattern Analysis', 
          summary: 'Your sleep patterns show a slight decrease in deep sleep. Consider adjusting your bedtime routine to improve sleep quality.',
          createdAt: new Date().toISOString(),
          metric: '6.2 hrs',
          trend: 'decreasing'
        },
        {
          id: 2,
          title: 'Heart Rate Variability',
          summary: 'Your heart rate variability is within normal range for your stage of pregnancy, indicating good cardiovascular health.',
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          metric: '67 bpm',
          trend: 'stable'
        }
      ],
      nutrition: [
        {
          id: 1,
          title: 'Iron Intake Analysis',
          summary: 'Your iron intake has been below recommended levels this week. Consider adding more leafy greens and lean proteins to your diet.',
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          metric: '14mg/day',
          trend: 'below target'
        },
        {
          id: 2,
          title: 'Hydration Levels',
          summary: 'Your hydration levels have been consistent. Keep maintaining your water intake especially during the upcoming warmer days.',
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          metric: '2.1L/day',
          trend: 'optimal'
        }
      ],
      schedule: [
        {
          id: 1,
          title: 'Appointment Optimization',
          summary: 'You have 3 medical appointments within the same week. Consider spreading them out to reduce fatigue.',
          createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          metric: '3 visits',
          trend: 'clustered'
        },
        {
          id: 2,
          title: 'To-Do Task Balance',
          summary: 'Your to-do list shows a good balance between pregnancy tasks and personal wellness activities. Great job!',
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          metric: '8:5 ratio',
          trend: 'balanced'
        }
      ],
      momScore: {
        score: 82,
        category: 'high',
        change: 3,
        insights: [
          'Sleep quality has improved by 15%',
          'Stress levels are well managed',
          'Blood pressure remains stable'
        ]
      },
      babyScore: {
        score: 90,
        category: 'high',
        change: 1,
        insights: [
          'Growth is on target for gestational age',
          'Activity levels are normal',
          'Heart rate is within expected range'
        ]
      }
    });
  };

  // Function to generate new AI insights
  const generateInsights = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // In a real app, this would call an actual AI endpoint
      // For now, we'll just update with new mock insights
      setInsights(prev => ({
        health: [
          {
            id: Date.now(),
            title: 'Week 26 Health Assessment',
            summary: 'Based on your recent data, your overall health metrics are showing positive trends. Your stress levels have decreased by 15% compared to last week.',
            createdAt: new Date().toISOString(),
            metric: '92/100',
            trend: 'improving'
          },
          ...prev.health
        ],
        nutrition: [
          {
            id: Date.now() + 1,
            title: 'Nutrient Balance',
            summary: 'Your calcium intake is below the recommended level for week 26. Consider adding more dairy or fortified plant-based alternatives to your diet.',
            createdAt: new Date().toISOString(),
            metric: '750mg/day',
            trend: 'needs attention'
          },
          ...prev.nutrition
        ],
        schedule: [
          {
            id: Date.now() + 2,
            title: 'Rest Period Analysis',
            summary: 'You have scheduled adequate rest periods between appointments. This balanced approach helps manage energy levels effectively.',
            createdAt: new Date().toISOString(),
            metric: 'Well spaced',
            trend: 'optimal'
          },
          ...prev.schedule
        ],
        // Update health scores
        momScore: {
          score: 85,
          category: 'high',
          change: 3,
          insights: [
            'Sleep quality has improved by 15%',
            'Recent exercise routine is showing positive impact',
            'Blood pressure remains stable',
            'Vitamin D levels are optimal'
          ]
        },
        babyScore: {
          score: 92,
          category: 'high',
          change: 2,
          insights: [
            'Growth is on target for gestational age',
            'Activity levels have increased since last week',
            'Heart rate is within expected range',
            'Development markers are all positive'
          ]
        }
      }));
      
      setIsGenerating(false);
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTrendIcon = (trend: string) => {
    switch(trend.toLowerCase()) {
      case 'improving':
      case 'optimal':
      case 'stable':
      case 'balanced':
      case 'well spaced':
        return <div className="text-green-500">↑</div>;
      case 'decreasing':
      case 'below target':
      case 'needs attention':
      case 'clustered':
        return <div className="text-amber-500">↓</div>;
      default:
        return <div className="text-blue-500">→</div>;
    }
  };

  // Get color class based on health score category
  const getScoreColorClass = (category: 'low' | 'medium' | 'high') => {
    switch (category) {
      case 'low':
        return 'bg-rose-500';
      case 'medium':
        return 'bg-amber-500';
      case 'high':
        return 'bg-emerald-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Insights</h1>
          <p className="text-muted-foreground mt-1">
            Personalized analysis of your pregnancy journey data for week {currentWeek}
          </p>
        </div>
        
        <Button 
          onClick={generateInsights} 
          disabled={isGenerating}
          className="bg-gradient-to-r from-primary to-primary/80 hover:brightness-105 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate New Insights
            </>
          )}
        </Button>
      </div>

      {/* Health Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Mom Health Score Card */}
        <Card className="overflow-hidden border-muted/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between bg-muted/20">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" /> Mom Health Score
              </CardTitle>
              <CardDescription>Overall health assessment based on tracked metrics</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              {insights.momScore.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : insights.momScore.change < 0 ? (
                <TrendingUp className="h-4 w-4 text-rose-500 rotate-180" />
              ) : (
                <Activity className="h-4 w-4 text-blue-500" />
              )}
              <span className={insights.momScore.change > 0 ? "text-emerald-500" : insights.momScore.change < 0 ? "text-rose-500" : "text-blue-500"}>
                {insights.momScore.change > 0 ? "+" : ""}{insights.momScore.change}%
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{insights.momScore.score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <Progress 
              value={insights.momScore.score} 
              className={cn("h-2.5 mb-4", getScoreColorClass(insights.momScore.category))}
            />
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
              <ul className="space-y-1">
                {insights.momScore.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Baby Health Score Card */}
        <Card className="overflow-hidden border-muted/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between bg-muted/20">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Baby className="h-5 w-5 text-primary" /> Baby Health Score
              </CardTitle>
              <CardDescription>Baby development assessment based on recent data</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              {insights.babyScore.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : insights.babyScore.change < 0 ? (
                <TrendingUp className="h-4 w-4 text-rose-500 rotate-180" />
              ) : (
                <Activity className="h-4 w-4 text-blue-500" />
              )}
              <span className={insights.babyScore.change > 0 ? "text-emerald-500" : insights.babyScore.change < 0 ? "text-rose-500" : "text-blue-500"}>
                {insights.babyScore.change > 0 ? "+" : ""}{insights.babyScore.change}%
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{insights.babyScore.score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <Progress 
              value={insights.babyScore.score} 
              className={cn("h-2.5 mb-4", getScoreColorClass(insights.babyScore.category))}
            />
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
              <ul className="space-y-1">
                {insights.babyScore.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Priority Alerts */}
      {(insights.health.some(i => i.trend.toLowerCase() === 'needs attention' || i.trend.toLowerCase() === 'decreasing') ||
        insights.nutrition.some(i => i.trend.toLowerCase() === 'below target' || i.trend.toLowerCase() === 'needs attention')) && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" /> 
              Priority Attention Areas
            </CardTitle>
            <CardDescription>Items that may need your attention based on recent tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {insights.health
                .filter(i => i.trend.toLowerCase() === 'needs attention' || i.trend.toLowerCase() === 'decreasing')
                .slice(0, 1)
                .map(insight => (
                  <div key={insight.id} className="flex gap-3">
                    <div className="p-2 h-fit rounded-full bg-amber-500/10">
                      <Heart className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.summary}</p>
                    </div>
                  </div>
                ))}
              
              {insights.nutrition
                .filter(i => i.trend.toLowerCase() === 'below target' || i.trend.toLowerCase() === 'needs attention')
                .slice(0, 1)
                .map(insight => (
                  <div key={insight.id} className="flex gap-3">
                    <div className="p-2 h-fit rounded-full bg-amber-500/10">
                      <Utensils className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.summary}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="health" className="w-full">
        <TabsList className="mb-4 bg-muted/50">
          <TabsTrigger value="health" className="gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="gap-2">
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">Nutrition</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="health" className="space-y-4 mt-2">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {isGenerating && (
              <Card className="border border-dashed animate-pulse">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-1/3" />
                </CardFooter>
              </Card>
            )}
            
            {insights.health.map((insight: Insight) => (
              <Card key={insight.id} className="overflow-hidden transition-all hover:shadow-md border-muted/50">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <CardDescription>{formatDate(insight.createdAt)}</CardDescription>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p>{insight.summary}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 text-sm border-t">
                  <span className="font-semibold flex items-center gap-1">
                    Metric: {insight.metric}
                  </span>
                  <span className="flex items-center gap-1">
                    {getTrendIcon(insight.trend)} {insight.trend}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-4 mt-2">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {isGenerating && (
              <Card className="border border-dashed animate-pulse">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-1/3" />
                </CardFooter>
              </Card>
            )}
            
            {insights.nutrition.map((insight: Insight) => (
              <Card key={insight.id} className="overflow-hidden transition-all hover:shadow-md border-muted/50">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <CardDescription>{formatDate(insight.createdAt)}</CardDescription>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p>{insight.summary}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 text-sm border-t">
                  <span className="font-semibold flex items-center gap-1">
                    Metric: {insight.metric}
                  </span>
                  <span className="flex items-center gap-1">
                    {getTrendIcon(insight.trend)} {insight.trend}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4 mt-2">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {isGenerating && (
              <Card className="border border-dashed animate-pulse">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-1/3" />
                </CardFooter>
              </Card>
            )}
            
            {insights.schedule.map((insight: Insight) => (
              <Card key={insight.id} className="overflow-hidden transition-all hover:shadow-md border-muted/50">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <CardDescription>{formatDate(insight.createdAt)}</CardDescription>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p>{insight.summary}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 text-sm border-t">
                  <span className="font-semibold flex items-center gap-1">
                    Metric: {insight.metric}
                  </span>
                  <span className="flex items-center gap-1">
                    {getTrendIcon(insight.trend)} {insight.trend}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 p-4 bg-muted/30 rounded-lg border border-muted/50">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">How AI Insights Work</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Our AI analyzes your health metrics, nutrition data, activity patterns, and scheduled appointments 
          to provide personalized insights. These insights help you make informed decisions about your pregnancy 
          journey. Click "Generate New Insights" anytime to get fresh analysis based on your latest data.
        </p>
      </div>
    </div>
  );
} 