"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock } from "lucide-react"
import { getRiskLevel, getRiskColor } from "../lib/blood-sugar-utils"
import { format, isSameDay } from "date-fns"

interface DateSelectorProps {
  readings: Array<{
    id: string
    value: number
    type: string
    timestamp: string
    notes?: string
    meal?: string
    medication?: string
  }>
}

export function DateSelector({ readings }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Filter readings for selected date
  const selectedDateReadings = readings
    .filter((reading) => isSameDay(new Date(reading.timestamp), selectedDate))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Get dates that have readings for calendar highlighting
  const datesWithReadings = readings.map((reading) => new Date(reading.timestamp))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Select Date</span>
          </CardTitle>
          <CardDescription>Choose a date to view all readings</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            modifiers={{
              hasReadings: datesWithReadings,
            }}
            modifiersStyles={{
              hasReadings: {
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                fontWeight: "bold",
              },
            }}
          />
          <p className="text-xs text-gray-500 mt-2">Dates with readings are highlighted in blue</p>
        </CardContent>
      </Card>

      {/* Readings List */}
      <Card>
        <CardHeader>
          <CardTitle>Readings for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
          <CardDescription>
            {selectedDateReadings.length} reading{selectedDateReadings.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateReadings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No readings for this date</p>
              <p className="text-sm text-gray-400">Select a different date or log a new reading</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedDateReadings.map((reading) => {
                const riskLevel = getRiskLevel(reading.value, reading.type)
                const riskColor = getRiskColor(riskLevel)

                return (
                  <div key={reading.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold">{reading.value}</span>
                        <span className="text-sm text-gray-600">mg/dL</span>
                        <Badge variant="outline" className={riskColor}>
                          {riskLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(reading.timestamp), "h:mm a")}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Type:</span>{" "}
                        <span className="capitalize">{reading.type.replace("-", " ")}</span>
                      </div>

                      {reading.meal && (
                        <div className="text-sm">
                          <span className="font-medium">Meal:</span> {reading.meal}
                        </div>
                      )}

                      {reading.medication && (
                        <div className="text-sm">
                          <span className="font-medium">Medication:</span> {reading.medication}
                        </div>
                      )}

                      {reading.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Notes:</span> <span className="italic">"{reading.notes}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
