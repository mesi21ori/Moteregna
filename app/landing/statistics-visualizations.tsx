"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"

export default function StatisticsVisualizations() {
  // Sample data for charts
  const monthlyData = [
    { month: "Jan", users: 2100, savings: 1200 },
    { month: "Feb", users: 3200, savings: 1800 },
    { month: "Mar", users: 4800, savings: 2400 },
    { month: "Apr", users: 6500, savings: 3100 },
    { month: "May", users: 8900, savings: 4200 },
    { month: "Jun", users: 11200, savings: 5300 },
    { month: "Jul", users: 13800, savings: 6500 },
    { month: "Aug", users: 16200, savings: 7600 },
    { month: "Sep", users: 18100, savings: 8500 },
    { month: "Oct", users: 19800, savings: 9300 },
  ]

  const fuelSavingsData = [
    { name: "Regular Routes", value: 45 },
    { name: "Optimized Routes", value: 30 },
    { name: "Price Alerts", value: 15 },
    { name: "Maintenance Tips", value: 10 },
  ]

  const COLORS = ["#00A651", "#8C001A", "#3b82f6", "#f59e0b"]

  const usageData = [
    { name: "Mon", value: 420 },
    { name: "Tue", value: 380 },
    { name: "Wed", value: 450 },
    { name: "Thu", value: 410 },
    { name: "Fri", value: 520 },
    { name: "Sat", value: 680 },
    { name: "Sun", value: 570 },
  ]

  return (
    <section id="statistics" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">Data-Driven Insights</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform collects and analyzes data to provide you with actionable insights that save time and money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly active users over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-1))",
                  },
                  savings: {
                    label: "Savings ($)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <AreaChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A651" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00A651" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="users" stroke="#00A651" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fuel Savings Breakdown</CardTitle>
              <CardDescription>How users save on fuel costs</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="aspect-[4/3] flex items-center justify-center">
                <PieChart width={300} height={300}>
                  <Pie
                    data={fuelSavingsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {fuelSavingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 w-full"> {/* Full width */}
  <CardHeader>
    <CardTitle>Weekly App Usage</CardTitle>
    <CardDescription>Number of active sessions per day</CardDescription>
  </CardHeader>
  <CardContent className="pt-4">
    <ChartContainer
      config={{
        value: {
          label: "Sessions",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="aspect-[16/9] h-[300px] w-full" 
    >
      <BarChart
        data={usageData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        width={undefined} 
        height={180} 
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="#00A651" radius={[4, 4, 0, 0]}>
          {usageData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 5 || index === 6 ? "#00A651" : "#8C001A"} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-motergna-red/10 to-motergna-green/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-motergna-red">15%</p>
                <p className="text-sm mt-2">Average Fuel Savings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-motergna-green/10 to-motergna-red/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-motergna-green">42 min</p>
                <p className="text-sm mt-2">Time Saved Per Week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-motergna-red/10 to-motergna-green/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-motergna-red">98%</p>
                <p className="text-sm mt-2">Customer Satisfaction</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
