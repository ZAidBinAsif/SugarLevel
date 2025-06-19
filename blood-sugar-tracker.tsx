"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Download } from "lucide-react"
import { BloodSugarEntry } from "./components/blood-sugar-entry"
import { BloodSugarChart } from "./components/blood-sugar-chart"
import { AIAssistant } from "./components/ai-assistant"
import { InsightsPanel } from "./components/insights-panel"
import type { BloodSugarReading } from "./types/blood-sugar"
import { getRiskLevel, getRiskColor } from "./lib/blood-sugar-utils"
import { format } from "date-fns"

export default function BloodSugarTracker() {
  const [readings, setReadings] = useState<BloodSugarReading[]>([
    {
      id: "1",
      value: 95,
      type: "fasting",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      notes: "Feeling good this morning",
    },
    {
      id: "2",
      value: 145,
      type: "after-meal",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      meal: "Pasta with vegetables",
    },
  ])

  const [showEntry, setShowEntry] = useState(false)
  const [chartView, setChartView] = useState<"daily" | "weekly" | "monthly">("daily")

  const handleSaveReading = (reading: BloodSugarReading) => {
    setReadings((prev) => [reading, ...prev])
    setShowEntry(false)
  }

  const exportData = () => {
    const csvContent = [
      "Date,Time,Value,Type,Notes,Meal,Medication",
      ...readings.map((r) =>
        [
          format(r.timestamp, "yyyy-MM-dd"),
          format(r.timestamp, "HH:mm"),
          r.value,
          r.type,
          r.notes || "",
          r.meal || "",
          r.medication || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `blood-sugar-log-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blood Sugar Tracker</h1>
            <p className="text-gray-600">Monitor and manage your glucose levels</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowEntry(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Log Reading
            </Button>
          </div>
        </div>

        {/* Entry Modal */}
        {showEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">New Reading</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowEntry(false)}>
                    ×
                  </Button>
                </div>
                <BloodSugarEntry onSave={handleSaveReading} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Readings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Readings</CardTitle>
                <CardDescription>Your latest blood sugar measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {readings.slice(0, 5).map((reading) => {
                    const riskLevel = getRiskLevel(reading.value, reading.type)
                    const riskColor = getRiskColor(riskLevel)

                    return (
                      <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold">{reading.value}</span>
                            <span className="text-sm text-gray-600">mg/dL</span>
                            <Badge variant="outline" className={riskColor}>
                              {riskLevel}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {reading.type.replace("-", " ")} • {format(reading.timestamp, "MMM d, h:mm a")}
                          </div>
                          {reading.notes && <div className="text-sm text-gray-500 mt-1">{reading.notes}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <Tabs value={chartView} onValueChange={(v) => setChartView(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <BloodSugarChart
                  readings={readings.filter(
                    (r) => format(r.timestamp, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
                  )}
                  view="daily"
                />
              </TabsContent>
              <TabsContent value="weekly">
                <BloodSugarChart
                  readings={readings.filter((r) => r.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}
                  view="weekly"
                />
              </TabsContent>
              <TabsContent value="monthly">
                <BloodSugarChart
                  readings={readings.filter((r) => r.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))}
                  view="monthly"
                />
              </TabsContent>
            </Tabs>

            {/* AI Assistant */}
            <AIAssistant />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <InsightsPanel readings={readings} />
          </div>
        </div>
      </div>
    </div>
  )
}
