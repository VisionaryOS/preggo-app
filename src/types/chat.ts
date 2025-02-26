import { Database } from './supabase'

export type ChatMessage = Database['public']['Tables']['chat_history']['Row']
export type ChatMessageInsert = Database['public']['Tables']['chat_history']['Insert']
export type UserInsight = Database['public']['Tables']['user_insights']['Row']

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  content: string
  role: MessageRole
  createdAt: Date
  metadata?: Record<string, any>
}

export interface ChatContextType {
  messages: Message[]
  loading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  insights: UserInsight[]
  markInsightAsRead: (id: string) => Promise<void>
  rateInsight: (id: string, helpful: boolean) => Promise<void>
} 