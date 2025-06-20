export function getRiskLevel(value: number, type: string): "low" | "normal" | "high" | "critical" {
  if (value < 70) return "critical"
  if (value > 300) return "critical"

  switch (type) {
    case "fasting":
      if (value < 80) return "low"
      if (value <= 100) return "normal"
      if (value <= 125) return "high"
      return "critical"
    case "after-meal":
      if (value < 80) return "low"
      if (value <= 140) return "normal"
      if (value <= 180) return "high"
      return "critical"
    default:
      if (value < 80) return "low"
      if (value <= 120) return "normal"
      if (value <= 160) return "high"
      return "critical"
  }
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "text-blue-600"
    case "normal":
      return "text-green-600"
    case "high":
      return "text-yellow-600"
    case "critical":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

/* --------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------- */
export type BloodSugarReading = {
  value: number
  type: string
  timestamp: string | Date
}

export type Insight = {
  title: string
  description: string
  level: "info" | "warning" | "critical"
}

/* --------------------------------------------------------------------------
 * Insight Generator
 * ----------------------------------------------------------------------- */
export function generateInsights(readings: BloodSugarReading[]): Insight[] {
  if (!Array.isArray(readings) || readings.length === 0) {
    return [
      {
        title: "No readings yet",
        description: "Add a blood-sugar reading to start generating insights.",
        level: "info",
      },
    ]
  }

  // Helper stats
  const sorted = [...readings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  const values = sorted.map((r) => Number(r.value))
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length
  const last = sorted[sorted.length - 1]

  const insights: Insight[] = [
    {
      title: "Average blood sugar",
      description: `Your average reading is ${avg.toFixed(1)} mg/dL (${getRiskLevel(avg, "random")}).`,
      level: getRiskLevel(avg, "random") === "normal" ? "info" : "warning",
    },
    {
      title: "Most recent reading",
      description: `Last reading was ${last.value} mg/dL (${getRiskLevel(last.value, last.type)}).`,
      level: getRiskLevel(last.value, last.type) === "critical" ? "critical" : "info",
    },
  ]

  // Spot long-term trend
  if (values.length >= 6) {
    const firstHalfAvg = values.slice(0, Math.floor(values.length / 2)).reduce((s, v) => s + v, 0) / (values.length / 2)
    const secondHalfAvg = values.slice(Math.floor(values.length / 2)).reduce((s, v) => s + v, 0) / (values.length / 2)

    const delta = secondHalfAvg - firstHalfAvg
    if (Math.abs(delta) > 10) {
      insights.push({
        title: "Trend detected",
        description:
          delta > 0
            ? "Your average blood-sugar is trending upward—consider reviewing your diet or medication."
            : "Great job! Your average blood-sugar is trending downward.",
        level: delta > 0 ? "warning" : "info",
      })
    }
  }

  return insights
}
