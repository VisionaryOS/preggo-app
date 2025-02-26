import { Database } from './supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type PregnancyData = Database['public']['Tables']['pregnancy_data']['Row']

export interface User {
  id: string
  email: string
  profile?: Profile
  pregnancyData?: PregnancyData
}

export interface UserContextType {
  user: User | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
  updatePregnancyData: (data: Partial<PregnancyData>) => Promise<void>
} 