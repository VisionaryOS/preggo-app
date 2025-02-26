export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          due_date: string | null
          last_updated: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          due_date?: string | null
          last_updated?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          due_date?: string | null
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pregnancy_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string
          symptoms: string[] | null
          mood: string | null
          weight: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          symptoms?: string[] | null
          mood?: string | null
          weight?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          symptoms?: string[] | null
          mood?: string | null
          weight?: number | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pregnancy_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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