'use client';

import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useJourney } from '@/context/JourneyContext';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import { motion } from 'framer-motion';
import { 
  Baby, 
  User, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CircleDot, 
  Camera, 
  Check 
} from 'lucide-react';

// Import data
import { weeklyData } from '@/data/pregnancy-data';
import { postpartumData, getPostpartumWeekData } from '@/data/postpartum-data';
import { MemoryEntry } from '@/types/journey.types';

/**
 * UnifiedTimeline component - Shows a comprehensive timeline from pregnancy through the first year
 */
export default function UnifiedTimeline() {
  const { currentWeek, stage, journeyState, addMemory } = useJourney();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedStage, setSelectedStage] = useState<'pregnancy' | 'postpartum'>(stage);
  const [view, setView] = useState<'baby' | 'mother'>('baby');
  const [showMemories, setShowMemories] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate where we are in the entire journey (pregnancy + postpartum)
  const totalWeeks = 40 + 52; // 40 weeks pregnancy + 52 weeks postpartum (first year)
  const progressPercentage = (currentStageWeek() / (selectedStage === 'pregnancy' ? 40 : 52)) * 100;
  
  // Get current week for the selected stage
  function currentStageWeek(): number {
    if (stage === selectedStage) return currentWeek;
    // Default values if viewing the other stage
    return selectedStage === 'pregnancy' ? 20 : 4;
  }
  
  // Scroll timeline to center on selected week
  const scrollToWeek = (week: number) => {
    setSelectedWeek(week);
    
    if (scrollContainerRef.current) {
      const weekWidth = 76; // Approximate width of week indicator in pixels
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollPosition = (week * weekWidth) - (containerWidth / 2) + (weekWidth / 2);
      
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };
  
  // Memory creation form state
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryDescription, setMemoryDescription] = useState('');
  
  // Handle submitting a new memory
  const handleAddMemory = () => {
    if (memoryTitle.trim() && memoryDescription.trim()) {
      addMemory({
        title: memoryTitle,
        description: memoryDescription,
        tags: [],
        images: []
      });
      
      setMemoryTitle('');
      setMemoryDescription('');
      setIsAddingMemory(false);
    }
  };
  
  // Helper to get current week's memories
  const getCurrentWeekMemories = (): MemoryEntry[] => {
    return journeyState.memories.filter(
      memory => memory.week === selectedWeek && memory.stage === selectedStage
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your Complete Journey</h1>
          <p className="text-muted-foreground">
            Track development and changes throughout your journey
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Tabs defaultValue={view} onValueChange={(value) => setView(value as 'baby' | 'mother')}>
            <TabsList>
              <TabsTrigger value="baby" className="flex gap-1 items-center">
                <Baby className="h-3.5 w-3.5" />
                <span>Baby</span>
              </TabsTrigger>
              <TabsTrigger value="mother" className="flex gap-1 items-center">
                <User className="h-3.5 w-3.5" />
                <span>Mother</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            variant={showMemories ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMemories(!showMemories)}
            className="flex items-center gap-1"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Memories</span>
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue={stage} 
        onValueChange={(value) => setSelectedStage(value as 'pregnancy' | 'postpartum')}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="pregnancy" className="w-full">Pregnancy</TabsTrigger>
          <TabsTrigger value="postpartum" className="w-full">First Year</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pregnancy" className="mt-6 space-y-4">
          {/* Week selector */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="icon" onClick={() => scrollToWeek(Math.max(1, selectedWeek - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <span className="text-sm font-medium">Week {selectedWeek}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => scrollToWeek(Math.min(40, selectedWeek + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-4 gap-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-background"
              >
                {Array.from({ length: 40 }, (_, i) => i + 1).map((week) => (
                  <button
                    key={week}
                    onClick={() => setSelectedWeek(week)}
                    className={`flex flex-none flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
                      selectedWeek === week 
                        ? 'bg-primary text-primary-foreground' 
                        : week === currentWeek && stage === 'pregnancy'
                          ? 'bg-primary/20 text-foreground' 
                          : 'bg-card hover:bg-muted text-foreground'
                    }`}
                  >
                    <span className="text-xs font-medium">Week</span>
                    <span className="text-lg font-bold">{week}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Content for selected week */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main content - development or memories */}
            <Card className="overflow-hidden">
              {showMemories ? (
                // Memories view
                <MemoryPanel 
                  memories={getCurrentWeekMemories()}
                  isAddingMemory={isAddingMemory}
                  setIsAddingMemory={setIsAddingMemory}
                  memoryTitle={memoryTitle}
                  setMemoryTitle={setMemoryTitle}
                  memoryDescription={memoryDescription}
                  setMemoryDescription={setMemoryDescription}
                  handleAddMemory={handleAddMemory}
                  week={selectedWeek}
                  stage="pregnancy"
                />
              ) : (
                // Development view
                <DevelopmentPanel 
                  week={selectedWeek} 
                  view={view} 
                  stage="pregnancy" 
                />
              )}
            </Card>
            
            {/* Milestones and checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedWeek <= 13
                    ? 'First Trimester' 
                    : selectedWeek <= 26 
                      ? 'Second Trimester' 
                      : 'Third Trimester'
                  }
                </CardTitle>
                <CardDescription>
                  Milestones & preparation for week {selectedWeek}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Key Milestones</h3>
                  <ul className="space-y-2">
                    {selectedWeek <= 13 ? (
                      <>
                        <MilestoneItem week={8} current={selectedWeek} title="First ultrasound" />
                        <MilestoneItem week={10} current={selectedWeek} title="End of embryonic period" />
                        <MilestoneItem week={12} current={selectedWeek} title="Screening tests" />
                      </>
                    ) : selectedWeek <= 26 ? (
                      <>
                        <MilestoneItem week={16} current={selectedWeek} title="Anatomy scan" />
                        <MilestoneItem week={20} current={selectedWeek} title="Feel baby movements" />
                        <MilestoneItem week={24} current={selectedWeek} title="Viability milestone" />
                      </>
                    ) : (
                      <>
                        <MilestoneItem week={28} current={selectedWeek} title="Third trimester begins" />
                        <MilestoneItem week={36} current={selectedWeek} title="Full term approaches" />
                        <MilestoneItem week={40} current={selectedWeek} title="Due date" />
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Preparation Checklist</h3>
                  <ul className="space-y-2">
                    {selectedWeek <= 13 ? (
                      <>
                        <ChecklistItem title="Start prenatal vitamins" isCompleted={true} />
                        <ChecklistItem title="Choose healthcare provider" isCompleted={true} />
                        <ChecklistItem title="Schedule first trimester screenings" isCompleted={false} />
                      </>
                    ) : selectedWeek <= 26 ? (
                      <>
                        <ChecklistItem title="Start a baby registry" isCompleted={true} />
                        <ChecklistItem title="Research childbirth classes" isCompleted={false} />
                        <ChecklistItem title="Plan maternity leave" isCompleted={false} />
                      </>
                    ) : (
                      <>
                        <ChecklistItem title="Pack hospital bag" isCompleted={false} />
                        <ChecklistItem title="Install car seat" isCompleted={false} />
                        <ChecklistItem title="Prepare nursery" isCompleted={false} />
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="postpartum" className="mt-6 space-y-4">
          {/* Week selector */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="icon" onClick={() => scrollToWeek(Math.max(1, selectedWeek - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <span className="text-sm font-medium">Week {selectedWeek}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => scrollToWeek(Math.min(52, selectedWeek + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-4 gap-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-background"
              >
                {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
                  <button
                    key={week}
                    onClick={() => setSelectedWeek(week)}
                    className={`flex flex-none flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
                      selectedWeek === week 
                        ? 'bg-primary text-primary-foreground' 
                        : week === currentWeek && stage === 'postpartum'
                          ? 'bg-primary/20 text-foreground' 
                          : 'bg-card hover:bg-muted text-foreground'
                    }`}
                  >
                    <span className="text-xs font-medium">Week</span>
                    <span className="text-lg font-bold">{week}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Content for selected week */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main content - development or memories */}
            <Card className="overflow-hidden">
              {showMemories ? (
                // Memories view
                <MemoryPanel 
                  memories={getCurrentWeekMemories()}
                  isAddingMemory={isAddingMemory}
                  setIsAddingMemory={setIsAddingMemory}
                  memoryTitle={memoryTitle}
                  setMemoryTitle={setMemoryTitle}
                  memoryDescription={memoryDescription}
                  setMemoryDescription={setMemoryDescription}
                  handleAddMemory={handleAddMemory}
                  week={selectedWeek}
                  stage="postpartum"
                />
              ) : (
                // Development view
                <DevelopmentPanel 
                  week={selectedWeek} 
                  view={view} 
                  stage="postpartum" 
                />
              )}
            </Card>
            
            {/* Milestones and checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedWeek <= 12
                    ? 'Fourth Trimester' 
                    : selectedWeek <= 26 
                      ? 'Months 3-6' 
                      : 'Months 6-12'
                  }
                </CardTitle>
                <CardDescription>
                  Milestones & guidance for week {selectedWeek}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Key Milestones</h3>
                  <ul className="space-y-2">
                    {selectedWeek <= 12 ? (
                      <>
                        <MilestoneItem week={1} current={selectedWeek} title="First pediatrician visit" />
                        <MilestoneItem week={6} current={selectedWeek} title="Postpartum checkup" />
                        <MilestoneItem week={8} current={selectedWeek} title="First social smile" />
                      </>
                    ) : selectedWeek <= 26 ? (
                      <>
                        <MilestoneItem week={16} current={selectedWeek} title="First tooth may appear" />
                        <MilestoneItem week={20} current={selectedWeek} title="Sitting with support" />
                        <MilestoneItem week={24} current={selectedWeek} title="Starting solid foods" />
                      </>
                    ) : (
                      <>
                        <MilestoneItem week={32} current={selectedWeek} title="Crawling" />
                        <MilestoneItem week={40} current={selectedWeek} title="Pulling to stand" />
                        <MilestoneItem week={52} current={selectedWeek} title="First steps & words" />
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Guidance Checklist</h3>
                  <ul className="space-y-2">
                    {selectedWeek <= 12 ? (
                      <>
                        <ChecklistItem title="Schedule all pediatric visits" isCompleted={true} />
                        <ChecklistItem title="Find a lactation consultant if needed" isCompleted={false} />
                        <ChecklistItem title="Join a new parent group" isCompleted={false} />
                      </>
                    ) : selectedWeek <= 26 ? (
                      <>
                        <ChecklistItem title="Baby-proof your home" isCompleted={false} />
                        <ChecklistItem title="Introduce age-appropriate toys" isCompleted={true} />
                        <ChecklistItem title="Establish sleep routines" isCompleted={false} />
                      </>
                    ) : (
                      <>
                        <ChecklistItem title="Plan first birthday" isCompleted={false} />
                        <ChecklistItem title="Transition feeding plan" isCompleted={false} />
                        <ChecklistItem title="Select pediatric dentist" isCompleted={false} />
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component for displaying development information
function DevelopmentPanel({ 
  week, 
  view,
  stage
}: { 
  week: number; 
  view: 'baby' | 'mother'; 
  stage: 'pregnancy' | 'postpartum';
}) {
  // Get the appropriate data based on stage
  const data = stage === 'pregnancy' 
    ? weeklyData[week] || getClosestWeekData(week)
    : getPostpartumWeekData(week);
  
  // Get development content based on view and stage
  let content: string[] = [];
  
  if (stage === 'pregnancy') {
    // We know data is WeekData type when stage is pregnancy
    const pregnancyData = data as typeof weeklyData[number];
    content = view === 'baby' ? pregnancyData.babyDevelopment : pregnancyData.motherChanges;
  } else {
    // We know data is PostpartumWeekData type when stage is postpartum
    const postpartumData = data as ReturnType<typeof getPostpartumWeekData>;
    content = view === 'baby' ? postpartumData.babyDevelopment : postpartumData.motherRecovery;
  }

  // Helper to get closest pregnancy week data
  function getClosestWeekData(week: number) {
    const weeks = Object.keys(weeklyData).map(Number);
    const closestWeek = weeks.reduce((prev, curr) => 
      Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
    );
    
    return weeklyData[closestWeek];
  }
  
  return (
    <>
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">
            {view === 'baby' ? 'Baby\'s Development' : (stage === 'pregnancy' ? 'Your Body Changes' : 'Your Recovery')}
          </CardTitle>
          <CardDescription>
            {stage === 'pregnancy'
              ? `Week ${week} - ${view === 'baby' 
                 ? `Size: ${(data as typeof weeklyData[number]).babySize}` 
                 : 'Your changing body'}`
              : `Week ${week} of ${view === 'baby' 
                 ? `baby's first year` 
                 : 'your postpartum journey'}`
            }
          </CardDescription>
        </div>
        {stage === 'pregnancy' && view === 'baby' && (
          <div className="text-4xl">{(data as typeof weeklyData[number]).babyImage}</div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <motion.ul 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-2"
        >
          {content.map((item: string, index: number) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-2"
            >
              <CircleDot className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
              <span>{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </>
  );
}

// Helper component for displaying memories
function MemoryPanel({ 
  memories,
  isAddingMemory,
  setIsAddingMemory,
  memoryTitle,
  setMemoryTitle,
  memoryDescription,
  setMemoryDescription,
  handleAddMemory,
  week,
  stage
}: { 
  memories: MemoryEntry[];
  isAddingMemory: boolean;
  setIsAddingMemory: (value: boolean) => void;
  memoryTitle: string;
  setMemoryTitle: (value: string) => void;
  memoryDescription: string;
  setMemoryDescription: (value: string) => void;
  handleAddMemory: () => void;
  week: number;
  stage: 'pregnancy' | 'postpartum';
}) {
  return (
    <>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Your Memories</CardTitle>
          {!isAddingMemory && (
            <Button size="sm" onClick={() => setIsAddingMemory(true)}>
              Add Memory
            </Button>
          )}
        </div>
        <CardDescription>
          {stage === 'pregnancy' 
            ? `Week ${week} of your pregnancy journey`
            : `Week ${week} of your postpartum journey`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {isAddingMemory ? (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Memory Title
              </label>
              <input
                id="title"
                type="text"
                value={memoryTitle}
                onChange={(e) => setMemoryTitle(e.target.value)}
                placeholder="What do you want to remember?"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={memoryDescription}
                onChange={(e) => setMemoryDescription(e.target.value)}
                placeholder="Capture the details of this moment..."
                rows={4}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingMemory(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMemory}>
                Save Memory
              </Button>
            </div>
          </motion.div>
        ) : memories.length > 0 ? (
          <div className="space-y-4">
            {memories.map((memory) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 border rounded-lg"
              >
                <h3 className="font-medium text-base">{memory.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {memory.description}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(memory.date).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No memories saved for this week yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Capture special moments to remember your journey.
            </p>
          </div>
        )}
      </CardContent>
    </>
  );
}

// Helper component for milestones
function MilestoneItem({ 
  week, 
  current, 
  title 
}: { 
  week: number; 
  current: number;
  title: string; 
}) {
  const isPast = current >= week;
  
  return (
    <div className="flex items-start gap-2">
      <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        isPast ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        <CircleDot className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className={`text-sm ${isPast ? 'font-medium' : 'text-muted-foreground'}`}>
            Week {week}
          </p>
          {current === week && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Current
            </span>
          )}
        </div>
        <p className={`text-sm ${isPast ? '' : 'text-muted-foreground'}`}>{title}</p>
      </div>
    </div>
  );
}

// Helper component for checklist items
function ChecklistItem({ 
  title, 
  isCompleted 
}: { 
  title: string; 
  isCompleted: boolean; 
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
      }`}>
        {isCompleted ? <Check className="h-3 w-3" /> : null}
      </div>
      <p className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
        {title}
      </p>
    </div>
  );
} 