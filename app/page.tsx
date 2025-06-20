"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, Heart, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

/**
 * Splash / loading screen.
 *  • Tries to get the current session.
 *  • Gracefully handles a network failure so the app never crashes.
 */
export default function SplashPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  /** Check auth once on mount */
  useEffect(() => {
    const check = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        // If we got an error from Supabase itself, show it but keep going.
        if (error) {
          console.error("Supabase session error →", error.message)
          setError("Can’t reach Supabase right now, running in offline mode.")
        }

        // Decide where to go next.
        if (data.session) {
          router.replace("/dashboard")
        } else {
          router.replace("/auth/login")
        }
      } catch (err) {
        // Network / CORS / DNS failure → stay calm & keep UX alive.
        console.error("Network error while talking to Supabase →", err)
        setError("Supabase is offline. You can still reach the login page.")
        router.replace("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <Activity className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* App Name */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GlucoTracker</h1>
          <p className="text-lg text-gray-600">Smart Blood Sugar Management</p>
        </div>

        {/* Fancy feature icons */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          {[
            { icon: Activity, label: "Track Levels" },
            { icon: TrendingUp, label: "View Trends" },
            { icon: Heart, label: "Stay Healthy" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </div>

        {/* Loading dots */}
        {loading && (
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((d) => (
              <div
                key={d}
                style={{ animationDelay: `${d * 0.1}s` }}
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              />
            ))}
          </div>
        )}

        {/* Connection message (shows only on failure) */}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  )
}
