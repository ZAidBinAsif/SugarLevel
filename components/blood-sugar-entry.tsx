"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { getRiskLevel } from "../lib/blood-sugar-utils"

interface BloodSugarEntryProps {
  onSave: (reading: {
    value: number
    type: "fasting" | "before-meal" | "after-meal" | "bedtime" | "random"
    timestamp: string
    notes?: string
    meal?: string
    medication?: string
  }) => void
}

export function BloodSugarEntry({ onSave }: BloodSugarEntryProps) {
  const [value, setValue] = useState("")
  const [type, setType] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [meal, setMeal] = useState("")
  const [medication, setMedication] = useState("")
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numValue = Number.parseFloat(value)
    if (!numValue || !type) return

    const reading = {
      value: numValue,
      type: type as any,
      timestamp: new Date().toISOString(),
      notes: notes || undefined,
      meal: meal || undefined,
      medication: medication || undefined,
    }

    const riskLevel = getRiskLevel(numValue, type)
    if (riskLevel === "critical") {
      setShowEmergencyAlert(true)
    }

    onSave(reading)

    // Reset form
    setValue("")
    setType("")
    setNotes("")
    setMeal("")
    setMedication("")
  }

  const riskLevel = value ? getRiskLevel(Number.parseFloat(value), type) : null

  if (showEmergencyAlert) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <CardTitle className="text-red-800">Emergency Alert</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-700">
            Your blood sugar reading of {value} mg/dL is{" "}
            {Number.parseFloat(value) < 70 ? "dangerously low" : "dangerously high"}.
          </p>
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Immediate Actions:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Number.parseFloat(value) < 70 ? (
                <>
                  <li>• Consume 15g of fast-acting carbs (glucose tablets, juice)</li>
                  <li>• Wait 15 minutes and retest</li>
                  <li>• If still low, repeat treatment</li>
                  <li>• Contact your doctor if symptoms persist</li>
                </>
              ) : (
                <>
                  <li>• Check for ketones if possible</li>
                  <li>• Drink water to stay hydrated</li>
                  <li>• Contact your healthcare provider immediately</li>
                  <li>• Consider emergency care if feeling unwell</li>
                </>
              )}
            </ul>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowEmergencyAlert(false)} className="bg-red-600 hover:bg-red-700">
              I Understand
            </Button>
            <Button variant="outline" className="border-red-300 text-red-700">
              Call Emergency Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Blood Sugar (mg/dL)</Label>
          <Input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter reading"
            className="text-lg"
            required
          />
          {riskLevel && (
            <div
              className={`text-sm font-medium ${
                riskLevel === "low"
                  ? "text-blue-600"
                  : riskLevel === "normal"
                    ? "text-green-600"
                    : riskLevel === "high"
                      ? "text-yellow-600"
                      : "text-red-600"
              }`}
            >
              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Range
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Reading Type</Label>
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fasting">Fasting</SelectItem>
              <SelectItem value="before-meal">Before Meal</SelectItem>
              <SelectItem value="after-meal">After Meal</SelectItem>
              <SelectItem value="bedtime">Bedtime</SelectItem>
              <SelectItem value="random">Random</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meal">Meal (Optional)</Label>
        <Input id="meal" value={meal} onChange={(e) => setMeal(e.target.value)} placeholder="What did you eat?" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medication">Medication (Optional)</Label>
        <Input
          id="medication"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          placeholder="Medications taken"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any symptoms, activities, or observations..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        <CheckCircle className="w-4 h-4 mr-2" />
        Save Reading
      </Button>
    </form>
  )
}
