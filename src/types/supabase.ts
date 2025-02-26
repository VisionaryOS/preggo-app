export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string | null
          due_date: string | null
          last_period_date: string | null
          first_pregnancy: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email?: string | null
          due_date?: string | null
          last_period_date?: string | null
          first_pregnancy?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          due_date?: string | null
          last_period_date?: string | null
          first_pregnancy?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      pregnancy_data: {
        Row: {
          id: string
          user_id: string
          current_week: number | null
          medical_conditions: string[] | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_week?: number | null
          medical_conditions?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_week?: number | null
          medical_conditions?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      symptoms: {
        Row: {
          id: string
          user_id: string
          date: string
          symptom_type: string
          severity: number | null
          duration: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          symptom_type: string
          severity?: number | null
          duration?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          symptom_type?: string
          severity?: number | null
          duration?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          message: string
          role: string
          metadata: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          role: string
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          role?: string
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
      user_insights: {
        Row: {
          id: string
          user_id: string
          insight_type: string
          content: string
          source: string | null
          created_at: string
          is_read: boolean
          is_helpful: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          insight_type: string
          content: string
          source?: string | null
          created_at?: string
          is_read?: boolean
          is_helpful?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          insight_type?: string
          content?: string
          source?: string | null
          created_at?: string
          is_read?: boolean
          is_helpful?: boolean | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 