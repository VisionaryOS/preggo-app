'use client';

import { useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus } from 'lucide-react';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Download, 
  Heart, 
  Calendar, 
  Baby, 
  BookOpen, 
  MessageCircle, 
  CheckSquare, 
  Clock, 
  ShoppingBag,
  Check
} from 'lucide-react';

// Chat Component
import AIAssistant from '@/components/dashboard/AIAssistant';

// Weekly data
import { weeklyData, WeekData, getTrimester } from '@/data/pregnancy-data';

interface DashboardProps {
  currentWeek: number;
}

export default function Dashboard({ currentWeek }: DashboardProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  // Get the closest week data if exact week doesn't exist
  const getWeekData = (week: number): WeekData => {
    if (weeklyData[week]) {
      return weeklyData[week];
    }
    
    // Find the closest week in our dataset
    const weeks = Object.keys(weeklyData).map(Number);
    const closestWeek = weeks.reduce((prev, curr) => 
      Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
    );
    
    return weeklyData[closestWeek];
  };
  
  const weekData = getWeekData(selectedWeek);
  
  // Calculate progress percentage
  const progressPercentage = (selectedWeek / 40) * 100;
  
  // Group weeks by trimester for selection
  const trimesters: Record<string, number[]> = {
    'First Trimester': Array.from({ length: 13 }, (_, i) => i + 1),
    'Second Trimester': Array.from({ length: 13 }, (_, i) => i + 14),
    'Third Trimester': Array.from({ length: 14 }, (_, i) => i + 27),
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden p-3">
      <div className="flex flex-col space-y-3 pb-2">
        {/* Header section with welcome and current stage */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Hello, Sarah</h2>
            <p className="text-sm text-muted-foreground">
              Week {currentWeek} ({getTrimester(currentWeek)})
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" asChild className="h-8">
              <Link href="/dashboard/todo">
                <CheckSquare className="mr-1 h-3 w-3" />
                <span className="text-xs">To-Do List</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="h-8">
              <Link href="/dashboard/appointments">
                <Clock className="mr-1 h-3 w-3" />
                <span className="text-xs">Appointments</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Top Cards - Quick Stats */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Card className="shadow-none border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-xs font-medium">Current Week</CardTitle>
              <Calendar className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="text-xl font-bold">{currentWeek}</div>
              <Progress value={progressPercentage} className="mt-1 h-1.5" />
            </CardContent>
          </Card>
          
          <Card className="shadow-none border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-xs font-medium">Baby Size</CardTitle>
              <Baby className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="flex items-center gap-1">
                <div className="text-xl">{weekData.babyImage}</div>
                <div className="text-sm font-bold">{weekData.babySize}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-none border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-xs font-medium">Days to Go</CardTitle>
              <Calendar className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="text-xl font-bold">{(40 - currentWeek) * 7}</div>
              <p className="text-xs text-muted-foreground">Due: July 15, 2024</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-none border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-xs font-medium">Health Score</CardTitle>
              <Heart className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="text-xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Latest checkup</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard Content with overflow control */}
        <div className="flex-1 h-[calc(100vh-14rem)] overflow-hidden">
          <Tabs defaultValue="weekly" className="h-full flex flex-col">
            <TabsList className="w-full justify-start mb-1">
              <TabsTrigger value="weekly" className="text-xs">Weekly Journey</TabsTrigger>
              <TabsTrigger value="todo" className="text-xs">Todo & Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="flex-1 overflow-hidden flex flex-col">
              <Card className="shadow-none border flex-1 flex flex-col">
                <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Pregnancy Journey</CardTitle>
                    <CardDescription className="text-xs">Track development week by week</CardDescription>
                  </div>
                  <div>
                    <Select 
                      value={selectedWeek.toString()} 
                      onValueChange={(value) => setSelectedWeek(parseInt(value))}
                    >
                      <SelectTrigger className="h-7 text-xs w-[120px]">
                        <SelectValue placeholder="Select Week" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(trimesters).map(([trimester, weeks]) => (
                          <div key={trimester}>
                            <p className="px-2 pt-1 text-xs font-medium text-muted-foreground">{trimester}</p>
                            <Separator className="my-1" />
                            {weeks.map((week) => (
                              <SelectItem key={week} value={week.toString()}>
                                Week {week}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                
                <CardContent className="p-2 pt-1 flex-1 overflow-hidden">
                  <div className="h-full flex flex-col overflow-hidden">
                    {/* Interactive timeline */}
                    <ScrollArea className="w-full border rounded-sm h-12 mb-2">
                      <div className="flex py-2 px-1 space-x-1 min-w-max">
                        {Array.from({ length: 40 }, (_, i) => {
                          const week = i + 1;
                          const isPast = week < currentWeek;
                          const isCurrent = week === currentWeek;
                          const isSelected = week === selectedWeek;
                          
                          return (
                            <button
                              key={week}
                              onClick={() => setSelectedWeek(week)}
                              className={cn(
                                "flex flex-col items-center justify-center rounded-sm px-1 py-1 w-9 relative",
                                isSelected && "bg-primary text-primary-foreground",
                                !isSelected && isCurrent && "border border-primary",
                                !isSelected && isPast && "bg-primary/20",
                                !isSelected && !isPast && !isCurrent && "bg-muted"
                              )}
                            >
                              <div className="text-[10px]">W</div>
                              <div className="text-xs font-bold">{week}</div>
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                    
                    {/* Weekly content with overflow */}
                    <div className="flex-1 overflow-hidden">
                      <div className="h-full overflow-y-auto pb-1">
                        {/* Current selected week info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="flex justify-center items-start md:items-center">
                            <div className="text-4xl relative">
                              {weekData.babyImage}
                              <div className="text-center text-xs text-muted-foreground mt-1">
                                {weekData.babySize}
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 space-y-2">
                            <div>
                              <h3 className="text-md font-semibold">Week {selectedWeek}: Development</h3>
                              <ul className="space-y-1 text-sm">
                                {weekData.babyDevelopment.map((development, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <Check className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                    <span>{development}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h3 className="text-md font-semibold">What to Expect</h3>
                              <ul className="space-y-1 text-sm">
                                {weekData.motherChanges.map((change, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-primary">•</span>
                                    <span>{change}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="todo" className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
                <Card className="shadow-none border flex flex-col h-full">
                  <CardHeader className="p-2 pb-1">
                    <CardTitle className="text-sm">To-Do List</CardTitle>
                    <CardDescription className="text-xs">Track pregnancy tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 pb-2 pt-1 flex-1 overflow-hidden">
                    <div className="h-full flex flex-col overflow-hidden">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">6</span> tasks for this week
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <CheckSquare className="mr-1 h-3 w-3" />
                          View All
                        </Button>
                      </div>
                      
                      <ScrollArea className="flex-1">
                        <div className="space-y-2">
                          {/* Example tasks - This would be dynamic in the real app */}
                          {[
                            { title: "Schedule 20-week ultrasound", completed: true },
                            { title: "Take prenatal vitamins", completed: false },
                            { title: "Set up nursery furniture", completed: false },
                            { title: "Research pediatricians", completed: false },
                            { title: "Register for childbirth class", completed: true },
                            { title: "Prepare hospital bag", completed: false }
                          ].map((task, i) => (
                            <div 
                              key={i} 
                              className={cn(
                                "flex items-center justify-between gap-2 p-1.5 rounded-md text-sm",
                                task.completed ? "bg-muted/40" : "border"
                              )}
                            >
                              <div className="flex items-center">
                                <div className={cn(
                                  "h-4 w-4 rounded-sm mr-2 flex items-center justify-center",
                                  task.completed 
                                    ? "bg-primary text-primary-foreground" 
                                    : "border border-primary/30"
                                )}>
                                  {task.completed && <Check className="h-3 w-3" />}
                                </div>
                                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                                  {task.title}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="mt-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                          <Plus className="mr-1 h-3 w-3" />
                          Add New Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-none border flex flex-col h-full">
                  <CardHeader className="p-2 pb-1">
                    <CardTitle className="text-sm">Quick Notes</CardTitle>
                    <CardDescription className="text-xs">Capture pregnancy thoughts</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 pb-2 pt-1 flex-1 overflow-hidden">
                    <div className="h-full flex flex-col overflow-hidden">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">4</span> recent notes
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <BookOpen className="mr-1 h-3 w-3" />
                          View All
                        </Button>
                      </div>
                      
                      <ScrollArea className="flex-1">
                        <div className="space-y-2">
                          {/* Example notes - This would be dynamic in the real app */}
                          {[
                            { title: "Questions for OB appointment", preview: "Ask about weight gain, leg cramps, and..." },
                            { title: "Nursery color ideas", preview: "Considering soft mint with gray accents, or..." },
                            { title: "Baby name brainstorm", preview: "For girls: Emma, Sophia, Olivia. For boys: Liam..." },
                            { title: "Birth plan thoughts", preview: "Prefer natural birth if possible, but open to..." }
                          ].map((note, i) => (
                            <div key={i} className="border rounded-md p-2">
                              <div className="font-medium text-sm mb-1">{note.title}</div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{note.preview}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="mt-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                          <Plus className="mr-1 h-3 w-3" />
                          Add New Note
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 