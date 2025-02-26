import { Database } from './supabase'

export type Symptom = Database['public']['Tables']['symptoms']['Row']
export type SymptomInsert = Database['public']['Tables']['symptoms']['Insert']

export interface BabySize {
  fruit: string
  lengthCm: number
  weightG: number
}

export interface WeekData {
  week: number
  babySize: BabySize
  babyDevelopment: string[]
  motherChanges: string[]
  commonSymptoms: string[]
  nutritionTips: string[]
  preparationTasks: string[]
}

export interface Trimester {
  name: string
  description: string
  weeks: number[]
}

export interface PregnancyData {
  currentWeek: number
  dueDate: Date
  trimesters: Trimester[]
  weekData: Record<number, WeekData>
}

export interface Symptom {
  id: string
  type: string
  severity: number
  notes: string
  date: string
  time?: string
}

export interface MedicalAppointment {
  id: string
  title: string
  doctorName: string
  location: string
  date: string
  time: string
  notes?: string
}

export interface UserPregnancyProfile {
  userId: string
  dueDate: string
  currentWeek: number
  symptoms: Symptom[]
  appointments: MedicalAppointment[]
  lastUpdated: string
}

export type Trimester = 'first' | 'second' | 'third'

export interface PregnancyTimeline {
  currentWeek: number
  dueDate: Date
  trimester: Trimester
  daysPassed: number
  daysRemaining: number
  milestones: Milestone[]
}

export interface Milestone {
  title: string
  description: string
  week: number
  completed: boolean
  date?: Date
}

export interface PregnancyContextType {
  timeline: PregnancyTimeline | null
  weekData: WeekData | null
  symptoms: Symptom[]
  loading: boolean
  error: Error | null
  updateDueDate: (dueDate: Date) => void
  addSymptom: (symptom: SymptomInsert) => Promise<void>
  updateSymptom: (id: string, symptom: Partial<Symptom>) => Promise<void>
  deleteSymptom: (id: string) => Promise<void>
} 