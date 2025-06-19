"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, Heart, TrendingUp } from "lucide-react"
import { supabase } from "../lib/supabase"

export default function SplashPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setTimeout(() => {
        setIsLoading(false)
        setTimeout(() => {
          if (session) {
            router.push("/dashboard")
          } else {
            router.push("/auth/login")
          }
        }, 500)
      }, 2500)
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center space-y-8 fade-in">
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
        <div className="slide-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GlucoTracker</h1>
          <p className="text-lg text-gray-600">Smart Blood Sugar Management</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Track Levels</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">View Trends</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Stay Healthy</p>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        )}
      </div>
    </div>
  )
}
