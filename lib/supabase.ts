import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types
export interface BloodSugarReading {
  id: string
  user_id: string
  value: number
  type: "fasting" | "before-meal" | "after-meal" | "bedtime" | "random"
  timestamp: string
  notes?: string
  meal?: string
  medication?: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  created_at: string
  updated_at: string
}
