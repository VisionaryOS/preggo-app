'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '@/context/JourneyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import MoodCheck from './MoodCheck';
import CrisisSupport from './CrisisSupport';
import { 
  Heart, 
  Calendar, 
  Moon,
  Droplets,
  Utensils,
  Activity,
  Plus,
  BarChart,
  BookHeart,
  HeartPulse,
  Sparkles,
  ThumbsUp,
  Check
} from 'lucide-react';
import { MoodEntry, HealthLog } from '@/types/journey.types';

// Self-care tips categorized by trimester
const selfCareTips = {
  firstTrimester: [
    {
      title: 'Manage morning sickness',
      description: 'Try eating small, frequent meals and ginger tea to help with nausea.',
      icon: <Droplets className="h-5 w-5 text-blue-500" />
    },
    {
      title: 'Prioritize rest',
      description: 'Your body is working hard; take naps when needed and go to bed earlier.',
      icon: <Moon className="h-5 w-5 text-indigo-500" />
    },
    {
      title: 'Stay hydrated',
      description: 'Carry a water bottle everywhere and drink throughout the day.',
      icon: <Droplets className="h-5 w-5 text-blue-500" />
    },
  ],
  secondTrimester: [
    {
      title: 'Gentle exercise',
      description: 'Walking, swimming, and prenatal yoga can boost your mood and energy.',
      icon: <Activity className="h-5 w-5 text-green-500" />
    },
    {
      title: 'Nutritious eating',
      description: 'Focus on protein, calcium, iron, and folate-rich foods.',
      icon: <Utensils className="h-5 w-5 text-orange-500" />
    },
    {
      title: 'Connect with other parents',
      description: 'Join a prenatal class or online community for support.',
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
  ],
  thirdTrimester: [
    {
      title: 'Practice relaxation',
      description: 'Try meditation, deep breathing, or prenatal massage to reduce stress.',
      icon: <Sparkles className="h-5 w-5 text-purple-500" />
    },
    {
      title: 'Sleep positioning',
      description: 'Use pillows to support your belly, back, and legs for better rest.',
      icon: <Moon className="h-5 w-5 text-indigo-500" />
    },
    {
      title: 'Prepare mentally',
      description: 'Read birth stories, practice mindfulness, and visualize positive outcomes.',
      icon: <BookHeart className="h-5 w-5 text-pink-500" />
    },
  ],
  postpartum: [
    {
      title: 'Accept help',
      description: 'Let friends and family assist with meals, chores, and baby care.',
      icon: <ThumbsUp className="h-5 w-5 text-blue-500" />
    },
    {
      title: 'Rest when baby rests',
      description: 'Sleep deprivation is real; prioritize sleep over household tasks.',
      icon: <Moon className="h-5 w-5 text-indigo-500" />
    },
    {
      title: 'Nourish your body',
      description: 'Focus on nutrient-dense foods and staying hydrated.',
      icon: <Utensils className="h-5 w-5 text-orange-500" />
    },
    {
      title: 'Monitor your emotions',
      description: 'Baby blues are common, but persistent sadness may need professional support.',
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
  ]
};

/**
 * WellbeingSuite component - A comprehensive hub for mental and physical wellbeing
 * Includes mood tracking, health logging, self-care recommendations, and wellness resources
 */
export default function WellbeingSuite() {
  const { stage, currentWeek, journeyState, logMood } = useJourney();
  const [activeTab, setActiveTab] = useState('mood');
  
  // Get relevant self-care tips based on current trimester/stage
  const getCurrentSelfCareTips = () => {
    if (stage === 'pregnancy') {
      if (currentWeek <= 13) return selfCareTips.firstTrimester;
      if (currentWeek <= 26) return selfCareTips.secondTrimester;
      return selfCareTips.thirdTrimester;
    }
    return selfCareTips.postpartum;
  };
  
  // Determine trimester text
  const getTrimesterText = () => {
    if (stage === 'pregnancy') {
      if (currentWeek <= 13) return 'First Trimester';
      if (currentWeek <= 26) return 'Second Trimester';
      return 'Third Trimester';
    }
    return 'Postpartum';
  };
  
  // Recent mood entries (last 7 days)
  const recentMoods = journeyState.moodHistory
    .slice(-7)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Mock data for health logs - in a real app, this would come from journeyState
  const recentHealthLogs: HealthLog[] = [
    {
      id: '1',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      symptoms: ['Mild headache', 'Fatigue'],
      mood: {
        date: new Date(Date.now() - 86400000).toISOString(),
        mood: 'okay',
      },
      sleep: {
        hours: 7,
        quality: 'fair',
        notes: 'Woke up twice during the night'
      },
      nutrition: {
        meals: 3,
        water: 6,
        notes: 'Added more protein to lunch'
      },
      exercise: {
        type: 'Walking',
        duration: 20,
        intensity: 'light'
      }
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      symptoms: ['Nausea in the morning'],
      mood: {
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        mood: 'challenging',
      },
      sleep: {
        hours: 6,
        quality: 'poor',
        notes: 'Trouble falling asleep'
      },
      nutrition: {
        meals: 3,
        water: 5,
        notes: 'Difficult to eat in the morning'
      }
    }
  ];
  
  return (
    <div className="space-y-4 pb-10">
      {/* Main wellbeing hub tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="mood" className="flex flex-col items-center py-2 gap-1">
            <Heart className="h-4 w-4" />
            <span className="text-xs">Mood</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex flex-col items-center py-2 gap-1">
            <HeartPulse className="h-4 w-4" />
            <span className="text-xs">Health</span>
          </TabsTrigger>
          <TabsTrigger value="selfcare" className="flex flex-col items-center py-2 gap-1">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">Self-Care</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex flex-col items-center py-2 gap-1">
            <BarChart className="h-4 w-4" />
            <span className="text-xs">Insights</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Mood tracking tab */}
        <TabsContent value="mood" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Mood Check-in</CardTitle>
                <CardDescription>
                  How are you feeling today?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodCheck />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Mood History</CardTitle>
                <CardDescription>
                  Your emotional journey over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentMoods.length > 0 ? (
                  <div className="space-y-3">
                    {recentMoods.map((entry: MoodEntry) => (
                      <div key={entry.date} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {entry.mood === 'great' && '😄'}
                            {entry.mood === 'good' && '🙂'}
                            {entry.mood === 'okay' && '😐'}
                            {entry.mood === 'challenging' && '😟'}
                            {entry.mood === 'difficult' && '😢'}
                          </div>
                          <div>
                            <p className="font-medium">
                              {entry.mood === 'great' && 'Great day'}
                              {entry.mood === 'good' && 'Good day'}
                              {entry.mood === 'okay' && 'Okay day'}
                              {entry.mood === 'challenging' && 'Challenging day'}
                              {entry.mood === 'difficult' && 'Difficult day'}
                            </p>
                            {entry.notes && (
                              <p className="text-sm text-muted-foreground">{entry.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No mood entries yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track your mood daily to see patterns
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" size="sm">
                  View Full History
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <ProgressiveDisclosure>
            <Card>
              <CardHeader>
                <CardTitle>Emotional Wellbeing Resources</CardTitle>
                <CardDescription>
                  Support for your mental health journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ResourceCard 
                    title="Pregnancy Meditation" 
                    description="10-minute guided meditation for expectant mothers"
                    icon={<Sparkles className="h-5 w-5" />}
                  />
                  <ResourceCard 
                    title="Managing Anxiety" 
                    description="Tips and techniques for pregnancy-related anxiety"
                    icon={<Heart className="h-5 w-5" />}
                  />
                  <ResourceCard 
                    title="Pregnancy Support Group" 
                    description="Connect with other expectant parents weekly"
                    icon={<Heart className="h-5 w-5" />}
                  />
                  <ResourceCard 
                    title="Postpartum Mental Health" 
                    description="Resources for the fourth trimester adjustment"
                    icon={<BookHeart className="h-5 w-5" />}
                  />
                </div>
              </CardContent>
            </Card>
          </ProgressiveDisclosure>
        </TabsContent>
        
        {/* Health tracking tab */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Health Tracker</CardTitle>
                  <CardDescription>
                    Log your physical symptoms and wellness metrics
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {recentHealthLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">
                          {new Date(log.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium flex items-center gap-1">
                            <HeartPulse className="h-3.5 w-3.5 text-red-500" />
                            Symptoms
                          </h4>
                          <ul className="text-sm text-muted-foreground">
                            {log.symptoms.map((symptom, i) => (
                              <li key={i}>{symptom}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium flex items-center gap-1">
                            <Moon className="h-3.5 w-3.5 text-indigo-500" />
                            Sleep
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            <p>{log.sleep.hours} hours, {log.sleep.quality} quality</p>
                            {log.sleep.notes && <p>{log.sleep.notes}</p>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium flex items-center gap-1">
                            <Utensils className="h-3.5 w-3.5 text-orange-500" />
                            Nutrition
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            <p>{log.nutrition.meals} meals, {log.nutrition.water} glasses of water</p>
                            {log.nutrition.notes && <p>{log.nutrition.notes}</p>}
                          </div>
                        </div>
                        
                        {log.exercise && (
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium flex items-center gap-1">
                              <Activity className="h-3.5 w-3.5 text-green-500" />
                              Exercise
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              <p>{log.exercise.type}, {log.exercise.duration} mins ({log.exercise.intensity})</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm">
                      Load More
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Common Symptoms</CardTitle>
                <CardDescription>
                  Typical experiences for {getTrimesterText()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stage === 'pregnancy' ? (
                    currentWeek <= 13 ? (
                      <>
                        <SymptomItem title="Morning sickness" description="Peaks between weeks 8-11" />
                        <SymptomItem title="Fatigue" description="Very common in first trimester" />
                        <SymptomItem title="Frequent urination" description="Due to hormonal changes" />
                      </>
                    ) : currentWeek <= 26 ? (
                      <>
                        <SymptomItem title="Round ligament pain" description="Sharp pain in lower abdomen" />
                        <SymptomItem title="Nasal congestion" description="Increased blood flow to mucous membranes" />
                        <SymptomItem title="Leg cramps" description="Common in second trimester" />
                      </>
                    ) : (
                      <>
                        <SymptomItem title="Braxton Hicks" description="Practice contractions" />
                        <SymptomItem title="Backache" description="Due to your growing belly" />
                        <SymptomItem title="Swelling" description="In feet, ankles, and hands" />
                      </>
                    )
                  ) : (
                    <>
                      <SymptomItem title="Afterpains" description="Contractions as uterus shrinks" />
                      <SymptomItem title="Postpartum bleeding" description="Gradually decreases over 2-6 weeks" />
                      <SymptomItem title="Breast engorgement" description="When milk comes in" />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>When to Contact Your Provider</CardTitle>
                <CardDescription>
                  Symptoms that may need medical attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stage === 'pregnancy' ? (
                    <>
                      <AlertItem title="Vaginal bleeding" />
                      <AlertItem title="Severe abdominal pain" />
                      <AlertItem title="Severe headache with vision changes" />
                      <AlertItem title="Decreased baby movement" />
                    </>
                  ) : (
                    <>
                      <AlertItem title="Heavy bleeding soaking through a pad per hour" />
                      <AlertItem title="Fever over 100.4°F (38°C)" />
                      <AlertItem title="Pain or burning during urination" />
                      <AlertItem title="Feelings of harming yourself or your baby" />
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full">
                  View Emergency Guide
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Self-care tab */}
        <TabsContent value="selfcare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>
                Self-care tips for {getTrimesterText()}, week {currentWeek}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCurrentSelfCareTips().map((tip, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Self-Care Challenge</CardTitle>
                <CardDescription>
                  This week's wellness activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <ChallengeItem 
                    title="10-minute daily meditation" 
                    description="Reduces stress and improves sleep"
                    days={[true, true, false, true, false, false, false]}
                  />
                  <ChallengeItem 
                    title="Prenatal yoga session" 
                    description="Gentle stretching for relaxation"
                    days={[false, true, false, false, true, false, false]}
                  />
                  <ChallengeItem 
                    title="Connect with a loved one" 
                    description="Share your feelings and experiences"
                    days={[true, false, true, false, false, false, false]}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  View More Activities
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Relaxation Techniques</CardTitle>
                <CardDescription>
                  Quick methods to reduce stress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <RelaxationItem 
                    title="Deep Breathing" 
                    description="Inhale for 4, hold for 4, exhale for 6" 
                    duration="2 minutes"
                  />
                  <RelaxationItem 
                    title="Progressive Relaxation" 
                    description="Tense and release each muscle group" 
                    duration="5 minutes"
                  />
                  <RelaxationItem 
                    title="Guided Visualization" 
                    description="Imagine a peaceful, calming place" 
                    duration="10 minutes"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Insights tab */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Wellbeing Insights</CardTitle>
              <CardDescription>
                Patterns and trends from your health data
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  Track more data to see personalized insights
                </p>
                <Button>Get Started</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mood Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[100px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground text-center">
                    Not enough data to show trends
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sleep Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[100px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground text-center">
                    Not enough data to show trends
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Symptom Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[100px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground text-center">
                    Not enough data to show trends
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Always show crisis support component */}
      <CrisisSupport />
    </div>
  );
}

// Helper component for resource cards
function ResourceCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
}) {
  return (
    <div className="p-4 border rounded-lg flex gap-3 items-start">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Helper component for symptom items
function SymptomItem({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <CircleDot className="h-3 w-3 text-primary" />
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

// Helper component for alert items
function AlertItem({ title }: { title: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertTriangle className="h-3 w-3 text-red-500" />
      </div>
      <p className="font-medium text-sm">{title}</p>
    </div>
  );
}

// Helper component for self-care challenge items
function ChallengeItem({ 
  title, 
  description, 
  days 
}: { 
  title: string; 
  description: string; 
  days: boolean[]; 
}) {
  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {days.map((completed, i) => (
            <div 
              key={i}
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                completed 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {completed ? <Check className="h-3 w-3" /> : i + 1}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm">Start</Button>
      </div>
    </div>
  );
}

// Helper component for relaxation technique items
function RelaxationItem({ 
  title, 
  description, 
  duration 
}: { 
  title: string; 
  description: string; 
  duration: string; 
}) {
  return (
    <div className="flex justify-between items-start border rounded-lg p-3">
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
          {duration}
        </span>
        <Button variant="ghost" size="sm" className="mt-1">
          Try Now
        </Button>
      </div>
    </div>
  );
}

// Helper components needed for alerts and icons
function CircleDot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
} 