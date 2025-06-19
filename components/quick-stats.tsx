"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react"

interface QuickStatsProps {
  readings: Array<{
    id: string
    value: number
    type: string
    timestamp: string
  }>
}

export function QuickStats({ readings }: QuickStatsProps) {
  // Calculate 7-day averages for different reading types
  const last7Days = readings.filter((r) => new Date(r.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

  const getAverageByType = (type: string) => {
    const typeReadings = last7Days.filter((r) => r.type === type)
    if (typeReadings.length === 0) return null
    return Math.round(typeReadings.reduce((sum, r) => sum + r.value, 0) / typeReadings.length)
  }

  const fastingAvg = getAverageByType("fasting")
  const beforeMealAvg = getAverageByType("before-meal")
  const afterMealAvg = getAverageByType("after-meal")
  const bedtimeAvg = getAverageByType("bedtime")
  const randomAvg = getAverageByType("random")

  const overallAvg =
    last7Days.length > 0 ? Math.round(last7Days.reduce((sum, r) => sum + r.value, 0) / last7Days.length) : null

  const inRangeCount = last7Days.filter((r) => r.value >= 80 && r.value <= 140).length
  const inRangePercentage = last7Days.length > 0 ? Math.round((inRangeCount / last7Days.length) * 100) : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">7-Day Average</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallAvg ? `${overallAvg} mg/dL` : "No data"}</div>
          <p className="text-xs text-muted-foreground">{last7Days.length} readings in last 7 days</p>
        </CardContent>
      </Card>

      {/* In Range Percentage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Target Range</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {inRangePercentage !== null ? `${inRangePercentage}%` : "No data"}
          </div>
          <p className="text-xs text-muted-foreground">80-140 mg/dL range</p>
        </CardContent>
      </Card>

      {/* Fasting Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fasting Average</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fastingAvg ? `${fastingAvg} mg/dL` : "No data"}</div>
          <p className="text-xs text-muted-foreground">Morning readings</p>
        </CardContent>
      </Card>

      {/* After Meal Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">After Meal Avg</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{afterMealAvg ? `${afterMealAvg} mg/dL` : "No data"}</div>
          <p className="text-xs text-muted-foreground">Post-meal readings</p>
        </CardContent>
      </Card>

      {/* Before Meal Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Before Meal Avg</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{beforeMealAvg ? `${beforeMealAvg} mg/dL` : "No data"}</div>
          <p className="text-xs text-muted-foreground">Pre-meal readings</p>
        </CardContent>
      </Card>

      {/* Bedtime Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bedtime Average</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bedtimeAvg ? `${bedtimeAvg} mg/dL` : "No data"}</div>
          <p className="text-xs text-muted-foreground">Evening readings</p>
        </CardContent>
      </Card>

      {/* Random Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Random Average</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{randomAvg ? `${randomAvg} mg/dL` : "No data"}</div>
          <p className="text-xs text-muted-foreground">Random check readings</p>
        </CardContent>
      </Card>

      {/* Total Readings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{readings.length}</div>
          <p className="text-xs text-muted-foreground">All time readings</p>
        </CardContent>
      </Card>
    </div>
  )
}
