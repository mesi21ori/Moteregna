import { Car, Clock, Fuel } from "lucide-react"

export default function StatsBar() {
  return (
    <section className="bg-gradient-to-r from-motergna-red/80 to-motergna-green/80 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center justify-center gap-3 text-white">
            <Car className="h-8 w-8 text-motergna-green" />
            <div>
              <p className="text-xl font-bold">20,000+</p>
              <p className="text-sm text-gray-300">Active Motorists</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-white">
            <Clock className="h-8 w-8 text-motergna-red" />
            <div>
              <p className="text-xl font-bold">200+</p>
              <p className="text-sm text-gray-300">Daily Customers</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-white">
            <Fuel className="h-8 w-8 text-motergna-green" />
            <div>
              <p className="text-xl font-bold">15%</p>
              <p className="text-sm text-gray-300">Avg. Fuel Savings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
