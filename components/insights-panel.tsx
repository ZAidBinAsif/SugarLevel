"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react"
import type { BloodSugarReading } from "../types/blood-sugar"
import { generateInsights } from "../lib/blood-sugar-utils"

interface InsightsPanelProps {
  readings: BloodSugarReading[]
}

export function InsightsPanel({ readings }: InsightsPanelProps) {
  const insights = generateInsights(readings)

  const recentReadings = readings.slice(-7) // Last 7 readings
  const avgReading = recentReadings.reduce((sum, r) => sum + r.value, 0) / recentReadings.length
  const inRangeCount = recentReadings.filter((r) => r.value >= 80 && r.value <= 140).length
  const inRangePercentage = (inRangeCount / recentReadings.length) * 100

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{avgReading ? Math.round(avgReading) : "--"}</div>
              <div className="text-sm text-gray-600">7-Day Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {inRangePercentage ? Math.round(inRangePercentage) : "--"}%
              </div>
              <div className="text-sm text-gray-600">In Target Range</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Smart Insights</span>
          </CardTitle>
          <CardDescription>Personalized observations from your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">Keep logging readings to see personalized insights and trends.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Today's Reminders</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
            <span className="text-sm">Morning blood sugar check</span>
            <Badge variant="outline" className="text-yellow-700 border-yellow-300">
              Due
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <span className="text-sm">Take morning medication</span>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Completed
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <span className="text-sm">Post-lunch reading</span>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              2:00 PM
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
