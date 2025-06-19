export interface BloodSugarReading {
  id: string
  value: number
  type: "fasting" | "before-meal" | "after-meal" | "bedtime" | "random"
  timestamp: Date
  notes?: string
  meal?: string
  medication?: string
}

export interface Reminder {
  id: string
  type: "sugar-check" | "meal" | "medication"
  time: string
  enabled: boolean
  title: string
}

export interface Insight {
  id: string
  type: "trend" | "suggestion" | "warning"
  message: string
  timestamp: Date
}
