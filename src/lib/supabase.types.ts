export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: number
          room_id: number
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          room_id: number
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          room_id?: number
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      room_members: {
        Row: {
          room_id: number
          user_id: string
        }
        Insert: {
          room_id?: number
          user_id: string
        }
        Update: {
          room_id?: number
          user_id?: string
        }
      }
      rooms: {
        Row: {
          created_at: string | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

