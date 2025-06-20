"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO } from "date-fns"

interface BloodSugarChartProps {
  readings: Array<{
    id: string
    value: number
    type: string
    timestamp: string
    notes?: string
    meal?: string
    medication?: string
  }>
  view: "daily" | "weekly" | "monthly"
}

export function BloodSugarChart({ readings, view }: BloodSugarChartProps) {
  console.log("Chart received readings:", readings) // Debug log

  if (!readings || readings.length === 0) {
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
              <p className="text-sm text-gray-400 mt-1">Your readings will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Process and sort the data
  const chartData = readings
    .map((reading) => {
      try {
        // Handle both ISO string and Date object timestamps
        const timestamp =
          typeof reading.timestamp === "string" ? parseISO(reading.timestamp) : new Date(reading.timestamp)

        return {
          time: format(timestamp, view === "daily" ? "HH:mm" : view === "weekly" ? "EEE" : "MM/dd"),
          value: Number(reading.value),
          type: reading.type,
          timestamp: timestamp.getTime(),
          fullDate: format(timestamp, "MMM dd, yyyy HH:mm"),
        }
      } catch (error) {
        console.error("Error processing reading:", reading, error)
        return null
      }
    })
    .filter(Boolean) // Remove any null entries from errors
    .sort((a, b) => a.timestamp - b.timestamp)

  console.log("Processed chart data:", chartData) // Debug log

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blood Sugar Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 font-medium">Unable to process chart data</p>
              <p className="text-sm text-gray-400 mt-1">Please check your readings format</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate Y-axis domain based on actual data
  const values = chartData.map((d) => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const padding = (maxValue - minValue) * 0.1 || 20
  const yMin = Math.max(40, minValue - padding)
  const yMax = Math.min(400, maxValue + padding)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Sugar Trends ({chartData.length} readings)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                stroke="#666"
                fontSize={12}
                angle={view === "daily" ? 0 : -45}
                textAnchor={view === "daily" ? "middle" : "end"}
                height={view === "daily" ? 30 : 60}
              />
              <YAxis
                domain={[yMin, yMax]}
                stroke="#666"
                fontSize={12}
                label={{ value: "mg/dL", angle: -90, position: "insideLeft" }}
              />

              {/* Reference lines for normal ranges */}
              <ReferenceLine
                y={70}
                stroke="#ef4444"
                strokeDasharray="2 2"
                label={{ value: "Low (70)", position: "topRight", fontSize: 10 }}
              />
              <ReferenceLine
                y={100}
                stroke="#22c55e"
                strokeDasharray="2 2"
                label={{ value: "Normal (100)", position: "topRight", fontSize: 10 }}
              />
              <ReferenceLine
                y={140}
                stroke="#eab308"
                strokeDasharray="2 2"
                label={{ value: "High (140)", position: "topRight", fontSize: 10 }}
              />
              <ReferenceLine
                y={180}
                stroke="#dc2626"
                strokeDasharray="2 2"
                label={{ value: "Very High (180)", position: "topRight", fontSize: 10 }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#1d4ed8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data summary */}
        <div className="mt-4 text-sm text-gray-600 flex justify-between">
          <span>Latest: {chartData[chartData.length - 1]?.value} mg/dL</span>
          <span>Average: {Math.round(values.reduce((a, b) => a + b, 0) / values.length)} mg/dL</span>
          <span>
            Range: {Math.min(...values)} - {Math.max(...values)} mg/dL
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
