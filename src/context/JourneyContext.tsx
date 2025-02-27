'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserJourneyState, 
  JourneyStage, 
  TodaysFocus, 
  MoodEntry, 
  Milestone,
  MemoryEntry
} from '@/types/journey.types';
import { useSearchStore } from '@/store/search-store';

// Sample data for today's focus
const sampleTodaysFocus: TodaysFocus[] = [
  {
    id: '1',
    title: 'Schedule your next prenatal appointment',
    description: 'Make sure to keep up with regular checkups for you and your baby.',
    completed: false,
    priority: 'high',
    stage: 'pregnancy',
    week: 26,
  },
  {
    id: '2',
    title: 'Start researching childbirth classes',
    description: 'Now is a good time to explore options for childbirth education.',
    completed: false,
    priority: 'medium',
    stage: 'pregnancy',
    week: 26,
  },
  {
    id: '3',
    title: 'Drink at least 8 glasses of water today',
    description: 'Staying hydrated is essential for you and your growing baby.',
    completed: false,
    priority: 'high',
    stage: 'pregnancy',
    week: 26,
  }
];

// Default journey state
const defaultJourneyState: UserJourneyState = {
  stage: 'pregnancy',
  currentWeek: 26,
  dueDate: '2024-09-15',
  healthProfile: {
    conditions: [],
    allergies: [],
    medications: [],
    preferences: [],
  },
  todaysFocus: sampleTodaysFocus,
  milestones: [],
  memories: [],
  checklists: {},
  moodHistory: [],
  healthLogs: [],
};

// Create context with default values
const JourneyContext = createContext<{
  journeyState: UserJourneyState;
  updateJourneyState: (updates: Partial<UserJourneyState>) => void;
  currentWeek: number;
  dueDate: string;
  stage: JourneyStage;
  setCurrentWeek: (week: number) => void;
  setStage: (stage: JourneyStage) => void;
  completeTodaysFocus: (id: string) => void;
  addMemory: (memory: Omit<MemoryEntry, 'id' | 'date' | 'week' | 'stage'>) => void;
  logMood: (mood: Omit<MoodEntry, 'date'>) => void;
  updateMilestone: (id: string, completed: boolean) => void;
}>({
  journeyState: defaultJourneyState,
  updateJourneyState: () => {},
  currentWeek: defaultJourneyState.currentWeek,
  dueDate: defaultJourneyState.dueDate,
  stage: defaultJourneyState.stage,
  setCurrentWeek: () => {},
  setStage: () => {},
  completeTodaysFocus: () => {},
  addMemory: () => {},
  logMood: () => {},
  updateMilestone: () => {},
});

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journeyState, setJourneyState] = useState<UserJourneyState>(defaultJourneyState);
  const { setSearchMode } = useSearchStore();

  // Update journey state with partial updates
  const updateJourneyState = (updates: Partial<UserJourneyState>) => {
    setJourneyState(prev => ({ ...prev, ...updates }));
  };

  // Set current week
  const setCurrentWeek = (week: number) => {
    setJourneyState(prev => ({ ...prev, currentWeek: week }));
  };

  // Set stage (pregnancy or postpartum)
  const setStage = (stage: JourneyStage) => {
    setJourneyState(prev => ({ ...prev, stage }));
  };

  // Complete a today's focus item
  const completeTodaysFocus = (id: string) => {
    setJourneyState(prev => ({
      ...prev,
      todaysFocus: prev.todaysFocus.map(item => 
        item.id === id ? { ...item, completed: true } : item
      )
    }));
  };

  // Add a new memory
  const addMemory = (memory: Omit<MemoryEntry, 'id' | 'date' | 'week' | 'stage'>) => {
    const newMemory: MemoryEntry = {
      ...memory,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      week: journeyState.currentWeek,
      stage: journeyState.stage,
    };

    setJourneyState(prev => ({
      ...prev,
      memories: [...prev.memories, newMemory]
    }));
  };

  // Log mood
  const logMood = (mood: Omit<MoodEntry, 'date'>) => {
    const moodEntry = {
      ...mood,
      date: new Date().toISOString(),
    };

    setJourneyState(prev => ({
      ...prev,
      moodHistory: [...prev.moodHistory, moodEntry]
    }));
  };

  // Update milestone completion status
  const updateMilestone = (id: string, completed: boolean) => {
    setJourneyState(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone => 
        milestone.id === id ? { ...milestone, completed } : milestone
      )
    }));
  };

  // Set search mode to include journey-specific content when in this context
  useEffect(() => {
    setSearchMode('both');
    
    // Cleanup when unmounting
    return () => {
      setSearchMode('global');
    };
  }, [setSearchMode]);

  // Initial data load - would connect to database in production
  useEffect(() => {
    // Simulating data load from API or local storage
    // In production, this would fetch user data from your backend
    const loadData = async () => {
      // For demo purposes, we'll just use the default state
      // You would replace this with an actual API call
    };

    loadData();
  }, []);

  return (
    <JourneyContext.Provider
      value={{
        journeyState,
        updateJourneyState,
        currentWeek: journeyState.currentWeek,
        dueDate: journeyState.dueDate,
        stage: journeyState.stage,
        setCurrentWeek,
        setStage,
        completeTodaysFocus,
        addMemory,
        logMood,
        updateMilestone,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

// Custom hook to use the journey context
export const useJourney = () => useContext(JourneyContext); 