"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface BloodSugarChartProps {
  readings: Array<{
    id: string
    value: number
    type: string
    timestamp: string
  }>
  view: "daily" | "weekly" | "monthly"
}

export function BloodSugarChart({ readings, view }: BloodSugarChartProps) {
  const chartData = readings
    .map((reading) => ({
      time: format(new Date(reading.timestamp), view === "daily" ? "HH:mm" : "MM/dd"),
      value: reading.value,
      type: reading.type,
      timestamp: new Date(reading.timestamp).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blood Sugar Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No data to display</p>
              <p className="text-sm text-gray-400 mt-1">Start logging readings to see your trends here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Sugar Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#666" fontSize={12} />
              <YAxis domain={[60, 200]} stroke="#666" fontSize={12} />

              {/* Reference lines for normal ranges */}
              <ReferenceLine
                y={70}
                stroke="#ef4444"
                strokeDasharray="2 2"
                label={{ value: "Low", position: "topRight" }}
              />
              <ReferenceLine
                y={140}
                stroke="#eab308"
                strokeDasharray="2 2"
                label={{ value: "High", position: "topRight" }}
              />
              <ReferenceLine
                y={180}
                stroke="#dc2626"
                strokeDasharray="2 2"
                label={{ value: "Very High", position: "topRight" }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: "#1d4ed8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
