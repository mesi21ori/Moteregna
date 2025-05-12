"use client"

import { Car, Clock, Map } from "lucide-react"
import { useEffect, useState } from "react"

export default function StatsBar() {
  // Stats state
  const [stats, setStats] = useState({
    totalMotorists: 0,
    activeMotorists: 0,
    avgDailyCustomers: 0,
    cityLocations: 0,
    cityPercentage: 0,
    loading: true,
    error: null as string | null,
  })

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/getdata/stats")

        if (!response.ok) {
          throw new Error(`Error fetching stats: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success) {
          setStats((prev) => ({
            ...prev,
            totalMotorists: result.data.totalMotorists,
            activeMotorists: result.data.activeMotorists,
            avgDailyCustomers: result.data.avgDailyCustomers,
            cityLocations: result.data.cityLocations,
            cityPercentage: result.data.cityPercentage,
            loading: false,
          }))
        } else {
          throw new Error(result.message || "Failed to fetch statistics")
        }
      } catch (err: any) {
        console.error("Error fetching stats:", err)
        setStats((prev) => ({
          ...prev,
          error: err.message || "An error occurred while fetching statistics",
          loading: false,
        }))
      }
    }

    fetchStats()
  }, [])

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <section className="bg-motergna-red/20 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center justify-center gap-3 text-white">
            <Clock className="h-8 w-8 text-motergna-red" />
            <div>
              {stats.loading ? (
                <>
                  <div className="h-7 w-20 bg-gray-300 animate-pulse rounded"></div>
                  <p className="text-sm text-white">Daily Customers</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-motergna-green">{formatNumber(stats.avgDailyCustomers)}+</p>
                  <p className="text-sm text-white">Daily Customers</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 ">
            <Car className="h-8 w-8 text-motergna-green" />
            <div>
              {stats.loading ? (
                <>
                  <div className="h-7 w-20 bg-gray-300 animate-pulse rounded"></div>
                  <p className="text-sm text-white">Active Motorists</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-motergna-red">{formatNumber(stats.activeMotorists)}+</p>
                  <p className="text-sm text-white">Active Motorists</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <Map className="h-8 w-8 text-motergna-red" />
            <div>
              {stats.loading ? (
                <>
                  <div className="h-7 w-20 bg-gray-300 animate-pulse rounded"></div>
                  <p className="text-sm">City Coverage</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-motergna-green">{stats.cityPercentage}%</p>
                  <p className="text-sm">{stats.cityLocations} locations across the city</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
