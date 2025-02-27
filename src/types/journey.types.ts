export type JourneyStage = 'pregnancy' | 'postpartum';

export interface WeekData {
  babySize: string;
  babyImage: string;
  babyDevelopment: string[];
  motherChanges: string[];
  tips: string[];
}

export interface PostpartumWeekData {
  babyDevelopment: string[];
  motherRecovery: string[];
  milestones: string[];
  tips: string[];
}

export type WeeklyPregnancyData = Record<number, WeekData>;
export type WeeklyPostpartumData = Record<number, PostpartumWeekData>;

export interface Milestone {
  id: string;
  title: string;
  description: string;
  week: number;
  stage: JourneyStage;
  completed: boolean;
  category: 'medical' | 'preparation' | 'development' | 'personal';
  date?: string;
}

export interface MemoryEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  week: number;
  stage: JourneyStage;
  images?: string[];
  tags?: string[];
}

export interface MoodEntry {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'challenging' | 'difficult';
  notes?: string;
  triggers?: string[];
  copingMechanisms?: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueWeek?: number;
  category: 'essential' | 'recommended' | 'optional';
  stage: JourneyStage;
  tags?: string[];
}

export interface RegistryItem {
  id: string;
  name: string;
  category: string;
  importance: 'must-have' | 'nice-to-have' | 'luxury';
  priceRange: 'budget' | 'mid-range' | 'premium';
  description: string;
  recommendations?: string[];
  link?: string;
  purchased: boolean;
  imageUrl?: string;
}

export interface BirthPreference {
  id: string;
  category: 'environment' | 'procedures' | 'support' | 'postpartum';
  title: string;
  preferences: string[];
  notes?: string;
}

export interface TodaysFocus {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  stage: JourneyStage;
  week: number;
}

export interface HealthLog {
  id: string;
  date: string;
  symptoms: string[];
  mood: MoodEntry;
  sleep: {
    hours: number;
    quality: 'good' | 'fair' | 'poor';
    notes?: string;
  };
  nutrition: {
    meals: number;
    water: number; // glasses
    notes?: string;
  };
  exercise?: {
    type: string;
    duration: number; // minutes
    intensity: 'light' | 'moderate' | 'intense';
  };
  notes?: string;
}

export interface Crisis {
  id: string;
  title: string;
  symptoms: string[];
  whenToCall: string[];
  emergencySteps: string[];
  helplineNumbers: string[];
}

export interface UserJourneyState {
  stage: JourneyStage;
  currentWeek: number;
  dueDate: string;
  healthProfile: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    preferences: string[];
  };
  todaysFocus: TodaysFocus[];
  milestones: Milestone[];
  memories: MemoryEntry[];
  checklists: Record<string, ChecklistItem[]>;
  moodHistory: MoodEntry[];
  healthLogs: HealthLog[];
  birthPreferences?: BirthPreference[];
  registryItems?: RegistryItem[];
} 