'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Calendar, CheckCircle2 } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import { TodaysFocus } from '@/types/journey.types';
import MoodCheck from '@/components/wellbeing/MoodCheck';
import TodaysFocusComponent from '@/components/journey/TodaysFocus';

/**
 * JourneyHub component - The main dashboard for the user's pregnancy journey
 * Shows personalized daily content based on current week
 */
export default function JourneyHub() {
  const { currentWeek, stage, dueDate, journeyState, completeTodaysFocus } = useJourney();
  const [greeting, setGreeting] = useState('Good morning');
  const [progress, setProgress] = useState(0);
  
  // Update greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  // Calculate progress
  useEffect(() => {
    if (stage === 'pregnancy') {
      // Pregnancy is 40 weeks
      setProgress((currentWeek / 40) * 100);
    } else {
      // Postpartum is 52 weeks (first year)
      setProgress((currentWeek / 52) * 100);
    }
  }, [currentWeek, stage]);
  
  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get weeks remaining text
  const getWeeksRemainingText = () => {
    if (stage === 'pregnancy') {
      const remaining = 40 - currentWeek;
      if (remaining <= 0) return 'Baby is due any day now!';
      return `${remaining} ${remaining === 1 ? 'week' : 'weeks'} until your due date`;
    } else {
      return `Week ${currentWeek} of your postpartum journey`;
    }
  };
  
  return (
    <div className="space-y-6 pb-10">
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-2"
      >
        <h1 className="text-3xl font-bold">{greeting}, Sarah</h1>
        <div className="flex flex-col space-y-1">
          <p className="text-muted-foreground">
            {stage === 'pregnancy' 
              ? `Week ${currentWeek} of your pregnancy journey` 
              : `Week ${currentWeek} of your postpartum journey`
            }
          </p>
          <div className="flex items-center space-x-2">
            <Progress value={progress} className="h-2" />
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {stage === 'pregnancy'
              ? `Due date: ${formatDueDate(dueDate)} (${getWeeksRemainingText()})`
              : getWeeksRemainingText()
            }
          </p>
        </div>
      </motion.div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's focus */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Focus</CardTitle>
            <CardDescription>
              Your most important tasks for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodaysFocusComponent />
          </CardContent>
        </Card>
        
        {/* Mood check */}
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
            <CardDescription>
              Track your mood and emotional wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodCheck />
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming items */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Up</CardTitle>
          <CardDescription>
            Important events and milestones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {stage === 'pregnancy' ? (
              <>
                <UpcomingItem 
                  icon={<Calendar className="h-4 w-4" />}
                  title="Prenatal Appointment"
                  description="Tomorrow at 10:00 AM with Dr. Reynolds"
                  daysAway={1}
                />
                
                <UpcomingItem 
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Hospital Tour"
                  description="Sign up for a guided tour of the birth center"
                  daysAway={14}
                  action="Schedule"
                />
              </>
            ) : (
              <>
                <UpcomingItem 
                  icon={<Calendar className="h-4 w-4" />}
                  title="2-Month Pediatric Visit"
                  description="Scheduled for Friday at 3:30 PM with Dr. Chen"
                  daysAway={3}
                />
                
                <UpcomingItem 
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Postpartum Check-up"
                  description="Time to schedule your 6-week postpartum check-up"
                  daysAway={7}
                  action="Schedule"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Personalized tips */}
      <ProgressiveDisclosure>
        <Card>
          <CardHeader>
            <CardTitle>This Week's Tips</CardTitle>
            <CardDescription>
              Personalized guidance for week {currentWeek}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stage === 'pregnancy' ? (
                <>
                  <li className="flex items-start space-x-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Stay active with gentle exercise</p>
                      <p className="text-sm text-muted-foreground">Walking, swimming, and prenatal yoga are excellent choices during pregnancy.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Focus on iron-rich foods</p>
                      <p className="text-sm text-muted-foreground">Your iron needs increase during pregnancy. Try leafy greens, beans, and lean meats.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <span className="text-xs">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Practice pelvic floor exercises</p>
                      <p className="text-sm text-muted-foreground">Kegel exercises strengthen your pelvic floor, which supports your growing baby.</p>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start space-x-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Focus on hydration</p>
                      <p className="text-sm text-muted-foreground">If breastfeeding, you need extra fluids. Keep a water bottle nearby at all times.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Sleep when baby sleeps</p>
                      <p className="text-sm text-muted-foreground">Forget the chores and prioritize rest during your baby's nap times.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <span className="text-xs">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Gentle postpartum movement</p>
                      <p className="text-sm text-muted-foreground">Start with short walks and gentle stretching as approved by your healthcare provider.</p>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </ProgressiveDisclosure>
    </div>
  );
}

// Helper component for upcoming events/milestones
function UpcomingItem({ 
  icon, 
  title, 
  description, 
  daysAway, 
  action 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  daysAway: number;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-start space-x-3">
        <div className="bg-primary/10 p-2 rounded-full">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {daysAway === 0 ? 'Today' : 
             daysAway === 1 ? 'Tomorrow' : 
             `In ${daysAway} days`}
          </p>
        </div>
        {action && (
          <Button variant="ghost" size="sm" className="flex-shrink-0">
            {action} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
} 