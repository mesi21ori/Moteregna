"use client"

import { Bar, BarChart, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ChartContainer, ChartTooltipContent } from "../../components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { MapPin, Package, TrendingDown, TrendingUp, Users, UserCog } from "lucide-react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function DashboardPage() {
 

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  const deliveryData = [
    { month: "Jan", completed: 120, pending: 20, cancelled: 5 },
    { month: "Feb", completed: 150, pending: 15, cancelled: 8 },
    { month: "Mar", completed: 180, pending: 25, cancelled: 10 },
    { month: "Apr", completed: 220, pending: 30, cancelled: 7 },
    { month: "May", completed: 250, pending: 20, cancelled: 12 },
    { month: "Jun", completed: 280, pending: 18, cancelled: 9 },
  ]

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 22000 },
    { month: "May", revenue: 25000 },
    { month: "Jun", revenue: 28000 },
  ]

  const recentActivities = [
    { id: 1, activity: "New motorist registered", time: "2 minutes ago" },
    { id: 2, activity: "Delivery #1234 completed", time: "15 minutes ago" },
    { id: 3, activity: "Price updated for Downtown area", time: "1 hour ago" },
    { id: 4, activity: "New admin added by Super Admin", time: "3 hours ago" },
    { id: 5, activity: "Delivery #1235 cancelled", time: "5 hours ago" },
  ]

  return (
    
    <div className="space-y-6 animate-fadeIn">
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
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-primary" />
              <span className="text-primary font-medium">+12.5%</span>
              <span className="ml-1">from last month</span>
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
            <div className="text-2xl font-bold">8,549</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-primary" />
              <span className="text-primary font-medium">+18.2%</span>
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
            <div className="text-2xl font-bold">32</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-primary" />
              <span className="text-primary font-medium">+3.1%</span>
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
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
              <span className="text-destructive font-medium">No change</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deliveries" className="space-y-4">
        <TabsList className="glass-card border-0">
          <TabsTrigger value="deliveries">Delivery Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
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

