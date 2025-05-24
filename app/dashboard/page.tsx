"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { ChartContainer, ChartTooltipContent } from "components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table"
import { MapPin, Package, TrendingDown, TrendingUp, Users, UserCog, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { Alert, AlertDescription } from "components/ui/alert"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"30days" | "3months" | "6months" | "1year">("6months")
  const [motoristData, setMotoristData] = useState<any[]>([])
  const [deliveryData, setDeliveryData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalMotorists: 0,
    totalDeliveries: 0,
    totalLocations: 0,
    totalAdmins: 0,
    motoristGrowth: 0,
    deliveryGrowth: 0,
    locationGrowth: 0,
    adminGrowth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMotoristData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/getdata/statistics?range=${timeRange}`)

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success) {
          setMotoristData(result.data)

          // Calculate total motorists and growth
          const totalActive = result.data.reduce((sum: number, item: any) => sum + item.active, 0)
          const totalNew = result.data.reduce((sum: number, item: any) => sum + item.new, 0)

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalMotorists: totalActive + result.data.reduce((sum: number, item: any) => sum + item.inactive, 0),
            motoristGrowth: totalNew > 0 ? (totalActive / totalNew) * 100 - 100 : 0,
          }))

          // For demo purposes, we'll generate some related data based on the motorist data
          generateRelatedData(result.data)
        } else {
          throw new Error(result.message || "Failed to fetch data")
        }
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "An error occurred while fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchMotoristData()
  }, [timeRange])

  // Generate related data for demo purposes
  // In a real application, you would fetch this from separate API endpoints
  const generateRelatedData = (motoristData: any[]) => {
    // Generate delivery data based on motorist data
    const deliveries = motoristData.map((item) => ({
      month: item.month,
      completed: Math.floor(item.active * 7.5),
      pending: Math.floor(item.active * 0.2),
      cancelled: Math.floor(item.inactive * 0.15),
    }))
    setDeliveryData(deliveries)

    // Calculate total deliveries and growth
    const totalDeliveries = deliveries.reduce((sum, item) => sum + item.completed + item.pending, 0)
    const prevMonthDeliveries = deliveries[deliveries.length - 2]?.completed || 0
    const currentMonthDeliveries = deliveries[deliveries.length - 1]?.completed || 0
    const deliveryGrowth =
      prevMonthDeliveries > 0 ? ((currentMonthDeliveries - prevMonthDeliveries) / prevMonthDeliveries) * 100 : 0

    // Generate revenue data based on delivery data
    const revenue = deliveries.map((item) => ({
      month: item.month,
      revenue: item.completed * 100 + item.pending * 50,
    }))
    setRevenueData(revenue)

    // Generate recent activities
    const activities = [
      { id: 1, activity: `${motoristData[motoristData.length - 1]?.new || 0} new motorists registered`, time: "Today" },
      {
        id: 2,
        activity: `${deliveries[deliveries.length - 1]?.completed || 0} deliveries completed`,
        time: "This month",
      },
      { id: 3, activity: "Price updated for Downtown area", time: "1 day ago" },
      { id: 4, activity: "New admin added by Super Admin", time: "3 days ago" },
      {
        id: 5,
        activity: `${deliveries[deliveries.length - 1]?.cancelled || 0} deliveries cancelled`,
        time: "This month",
      },
    ]
    setRecentActivities(activities)

    // Update other stats
    setStats((prev) => ({
      ...prev,
      totalDeliveries,
      deliveryGrowth,
      totalLocations: 32, // Static for demo
      totalAdmins: 8, // Static for demo
      locationGrowth: 3.1, // Static for demo
      adminGrowth: 0, // Static for demo
    }))
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-end mb-4">
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-animation">
        <Card className="glass-card overflow-hidden border-0 shadow-lg animate-slideInUp">
          <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Motorists</CardTitle>
            <div className="rounded-full bg-white/10 p-2">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{stats.totalMotorists.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.motoristGrowth > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-primary" />
                  <span className="text-primary font-medium">+{stats.motoristGrowth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                  <span className="text-destructive font-medium">{stats.motoristGrowth.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden border-0 shadow-lg animate-slideInUp">
          <div className="absolute inset-0 bg-gradient-destructive opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <div className="rounded-full bg-white/10 p-2">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{stats.totalDeliveries.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.deliveryGrowth > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-primary" />
                  <span className="text-primary font-medium">+{stats.deliveryGrowth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                  <span className="text-destructive font-medium">{stats.deliveryGrowth.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden border-0 shadow-lg animate-slideInUp">
          <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <div className="rounded-full bg-white/10 p-2">
              <MapPin className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{stats.totalLocations}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-primary" />
              <span className="text-primary font-medium">+{stats.locationGrowth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden border-0 shadow-lg animate-slideInUp">
          <div className="absolute inset-0 bg-gradient-destructive opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <div className="rounded-full bg-white/10 p-2">
              <UserCog className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.adminGrowth === 0 ? (
                <span className="text-muted-foreground font-medium">No change</span>
              ) : stats.adminGrowth > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-primary" />
                  <span className="text-primary font-medium">+{stats.adminGrowth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                  <span className="text-destructive font-medium">{stats.adminGrowth}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="motorists" className="space-y-4">
        <TabsList className="glass-card border-0">
          <TabsTrigger value="motorists">Motorist Trends</TabsTrigger>
          <TabsTrigger value="deliveries">Delivery Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="motorists" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Motorist Statistics</CardTitle>
              <CardDescription>Monthly breakdown of active, new, and inactive motorists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
                <ChartContainer
                  config={{
                    active: {
                      label: "Active",
                      color: "hsl(var(--chart-1))",
                    },
                    new: {
                      label: "New",
                      color: "hsl(var(--chart-3))",
                    },
                    inactive: {
                      label: "Inactive",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <BarChart
                    data={motoristData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="active" fill="var(--color-active)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="new" fill="var(--color-new)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inactive" fill="var(--color-inactive)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Delivery Statistics</CardTitle>
              <CardDescription>Monthly breakdown of completed, pending, and cancelled deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
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
                  <BarChart
                    data={deliveryData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <LineChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
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
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest activities across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.activity}</TableCell>
                    <TableCell className="text-right">{activity.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
