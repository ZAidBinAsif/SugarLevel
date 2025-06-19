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
