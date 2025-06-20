import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ahepczmzrmklfhjcrtih.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZXBjem16cm1rbGZoamNydGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjQ0MjQsImV4cCI6MjA2NTk0MDQyNH0.3wwkdjkAq12wgBtL-I9KYgPX899ApGf9yEPWAe5m1NU"

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
