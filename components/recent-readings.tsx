"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Droplets } from "lucide-react"
import { getRiskLevel, getRiskColor } from "../lib/blood-sugar-utils"
import { format } from "date-fns"

interface RecentReadingsProps {
  readings: Array<{
    id: string
    value: number
    type: string
    timestamp: string
    notes?: string
  }>
}

export function RecentReadings({ readings }: RecentReadingsProps) {
  const recentReadings = readings.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Droplets className="w-5 h-5" />
          <span>Recent Readings</span>
        </CardTitle>
        <CardDescription>Your latest blood glucose measurements</CardDescription>
      </CardHeader>
      <CardContent>
        {recentReadings.length === 0 ? (
          <div className="text-center py-8">
            <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No readings yet!</p>
            <p className="text-sm text-gray-400">Click "Log Reading" to start tracking your blood sugar levels.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReadings.map((reading) => {
              const riskLevel = getRiskLevel(reading.value, reading.type)
              const riskColor = getRiskColor(riskLevel)

              return (
                <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl font-bold">{reading.value}</span>
                      <span className="text-sm text-gray-600">mg/dL</span>
                      <Badge variant="outline" className={riskColor}>
                        {riskLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{reading.type.replace("-", " ")}</span>
                      <span>•</span>
                      <span>{format(new Date(reading.timestamp), "MMM d, h:mm a")}</span>
                    </div>
                    {reading.notes && <div className="text-sm text-gray-500 mt-1 italic">"{reading.notes}"</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
