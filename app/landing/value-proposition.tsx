import { Bell, Fuel, LayoutDashboard } from "lucide-react"

export default function ValueProposition() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Smart Solutions for Modern Motorists</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-motergna-red/10 p-4">
              <Bell className="h-10 w-10 text-motergna-red" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Real-Time Alerts</h3>
            <p className="mb-4 text-gray-600">
              Get instant notifications about traffic, maintenance needs, and fuel prices in your area.
            </p>
            <p className="text-sm font-semibold text-motergna-red">Used by 5,000+ fleets</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-motergna-green/10 p-4">
              <Fuel className="h-10 w-10 text-motergna-green" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Fuel Savings</h3>
            <p className="mb-4 text-gray-600">
              Optimize routes and find the best fuel prices to maximize your savings on every trip.
            </p>
            <p className="text-sm font-semibold text-motergna-green">200L+ fuel saved daily</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-motergna-red/10 p-4">
              <LayoutDashboard className="h-10 w-10 text-motergna-red" />
            </div>
            <h3 className="mb-2 text-xl font-bold">User Dashboard</h3>
            <p className="mb-4 text-gray-600">
              Comprehensive fleet management tools with analytics and reporting capabilities.
            </p>
            <p className="text-sm font-semibold text-motergna-red">20+ integrations</p>
          </div>
        </div>
      </div>
    </section>
  )
}
