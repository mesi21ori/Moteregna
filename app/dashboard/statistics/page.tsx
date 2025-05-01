"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { ChartContainer, ChartTooltipContent } from "../../../components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeliveryStat {
  month: string
  completed: number
  pending: number
  cancelled: number
}

interface RevenueStat {
  month: string
  revenue: number
}

interface MotoristStat {
  month: string
  active: number
  new: number
  inactive: number
}

interface LocationStat {
  name: string
  value: number
}

export default function StatisticsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<"30days" | "3months" | "6months" | "1year">("6months")
  const [deliveryData, setDeliveryData] = useState<DeliveryStat[]>([])
  const [revenueData, setRevenueData] = useState<RevenueStat[]>([])
  const [motoristActivityData, setMotoristActivityData] = useState<MotoristStat[]>([])
  const [locationDistributionData, setLocationDistributionData] = useState<LocationStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllStatistics()
  }, [timeRange])

  const fetchAllStatistics = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchDeliveryStats(),
        fetchRevenueStats(),
        fetchMotoristStats(),
        fetchLocationStats()
      ])
    } catch (error) {
      toast.error("Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }

  const fetchDeliveryStats = async () => {
    try {
      const response = await fetch(`/api/statistics/deliveries?range=${timeRange}`, {
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to fetch delivery stats')
      const { data } = await response.json()
      setDeliveryData(data)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login')
      }
      throw error
    }
  }

  const fetchRevenueStats = async () => {
    try {
      const response = await fetch(`/api/statistics/revenue?range=${timeRange}`, {
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to fetch revenue stats')
      const { data } = await response.json()
      setRevenueData(data)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login')
      }
      throw error
    }
  }

  const fetchMotoristStats = async () => {
    try {
      const response = await fetch(`/api/statistics/motorists?range=${timeRange}`, {
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to fetch motorist stats')
      const { data } = await response.json()
      setMotoristActivityData(data)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login')
      }
      throw error
    }
  }

  const fetchLocationStats = async () => {
    try {
      const response = await fetch('/api/statistics/locations', {
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to fetch location stats')
      const { data } = await response.json()
      setLocationDistributionData(data)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/signin')
      }
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Statistics</h2>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as typeof timeRange)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="deliveries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="motorists">Motorists</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Statistics</CardTitle>
              <CardDescription>Monthly breakdown of completed, pending, and cancelled deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    completed: {
                      label: "Completed",
                      color: "hsl(var(--chart-1))",
                    },
                    pending: {
                      label: "Pending",
                      color: "hsl(var(--chart-3))",
                    },
                    cancelled: {
                      label: "Cancelled",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deliveryData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motorists" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Motorist Activity</CardTitle>
              <CardDescription>Monthly breakdown of active, new, and inactive motorists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    active: {
                      label: "Active Motorists",
                      color: "hsl(var(--chart-1))",
                    },
                    new: {
                      label: "New Motorists",
                      color: "hsl(var(--chart-3))",
                    },
                    inactive: {
                      label: "Inactive Motorists",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={motoristActivityData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="active" fill="var(--color-active)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="new" fill="var(--color-new)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="inactive" fill="var(--color-inactive)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Distribution</CardTitle>
              <CardDescription>Distribution of deliveries by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    value: {
                      label: "Deliveries",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="var(--color-value)"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

