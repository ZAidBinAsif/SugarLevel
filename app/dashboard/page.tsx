"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download, Bell, Settings, User, LogOut, Calendar } from "lucide-react"
import { BloodSugarEntry } from "../../components/blood-sugar-entry"
import { BloodSugarChart } from "../../components/blood-sugar-chart"
import { QuickStats } from "../../components/quick-stats"
import { RecentReadings } from "../../components/recent-readings"
import { DateSelector } from "../../components/date-selector"
import { supabase, type BloodSugarReading } from "../../lib/supabase"
import { format, isToday, isThisWeek, isThisMonth } from "date-fns"

export default function DashboardPage() {
  const [readings, setReadings] = useState<BloodSugarReading[]>([])
  const [showEntry, setShowEntry] = useState(false)
  const [showDateSelector, setShowDateSelector] = useState(false)
  const [chartView, setChartView] = useState<"daily" | "weekly" | "monthly">("daily")
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Load user and data on component mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setError("Failed to get session")
          return
        }

        if (!session) {
          router.push("/auth/login")
          return
        }

        setUser(session.user)
        await loadReadings(session.user.id)
      } catch (err) {
        console.error("Error getting user:", err)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const loadReadings = async (userId: string) => {
    try {
      console.log("Loading readings for user:", userId)

      const { data, error } = await supabase
        .from("blood_sugar_readings")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })

      if (error) {
        console.error("Error loading readings:", error)
        setError(`Failed to load readings: ${error.message}`)
      } else {
        console.log("Loaded readings:", data)
        setReadings(data || [])
        setError(null)
      }
    } catch (err) {
      console.error("Error loading readings:", err)
      setError("Failed to load readings")
    }
  }

  const handleSaveReading = async (reading: Omit<BloodSugarReading, "id" | "user_id" | "created_at">) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("blood_sugar_readings")
        .insert([
          {
            user_id: user.id,
            value: reading.value,
            type: reading.type,
            timestamp: reading.timestamp,
            notes: reading.notes,
            meal: reading.meal,
            medication: reading.medication,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error saving reading:", error)
        alert("Failed to save reading. Please try again.")
      } else {
        setReadings((prev) => [data, ...prev])
        setShowEntry(false)
      }
    } catch (err) {
      console.error("Error saving reading:", err)
      alert("Failed to save reading. Please try again.")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const exportData = () => {
    if (readings.length === 0) {
      alert("No data to export. Please log some readings first.")
      return
    }

    const csvContent = [
      "Date,Time,Value,Type,Notes,Meal,Medication",
      ...readings.map((r) =>
        [
          format(new Date(r.timestamp), "yyyy-MM-dd"),
          format(new Date(r.timestamp), "HH:mm"),
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
    a.download = `glucotracker-export-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter readings based on chart view
  const getFilteredReadings = (view: "daily" | "weekly" | "monthly") => {
    const now = new Date()
    return readings.filter((reading) => {
      const readingDate = new Date(reading.timestamp)
      switch (view) {
        case "daily":
          return isToday(readingDate)
        case "weekly":
          return isThisWeek(readingDate)
        case "monthly":
          return isThisMonth(readingDate)
        default:
          return true
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">GlucoTracker</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user?.user_metadata?.full_name || user?.email}
                  {readings.length > 0 && ` • ${readings.length} readings`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Monitor your blood glucose levels and trends</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => setShowDateSelector(true)} variant="outline" className="bg-white">
              <Calendar className="w-4 h-4 mr-2" />
              View by Date
            </Button>
            <Button onClick={exportData} variant="outline" className="bg-white">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => setShowEntry(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Log Reading
            </Button>
          </div>
        </div>

        {/* Entry Modal */}
        {showEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Log New Reading</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowEntry(false)}>
                    ×
                  </Button>
                </div>
                <BloodSugarEntry onSave={handleSaveReading} />
              </div>
            </div>
          </div>
        )}

        {/* Date Selector Modal */}
        {showDateSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">View Readings by Date</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowDateSelector(false)}>
                    ×
                  </Button>
                </div>
                <DateSelector readings={readings} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Stats */}
            <QuickStats readings={readings} />

            {/* Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Blood Sugar Trends</CardTitle>
                <CardDescription>Visualize your glucose patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={chartView} onValueChange={(v) => setChartView(v as any)}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="daily">Today ({getFilteredReadings("daily").length})</TabsTrigger>
                    <TabsTrigger value="weekly">This Week ({getFilteredReadings("weekly").length})</TabsTrigger>
                    <TabsTrigger value="monthly">This Month ({getFilteredReadings("monthly").length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="daily">
                    <BloodSugarChart readings={getFilteredReadings("daily")} view="daily" />
                  </TabsContent>
                  <TabsContent value="weekly">
                    <BloodSugarChart readings={getFilteredReadings("weekly")} view="weekly" />
                  </TabsContent>
                  <TabsContent value="monthly">
                    <BloodSugarChart readings={getFilteredReadings("monthly")} view="monthly" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentReadings readings={readings} />
          </div>
        </div>
      </main>
    </div>
  )
}
