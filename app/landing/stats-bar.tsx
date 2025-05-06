import { Car, Clock, Fuel } from "lucide-react"

export default function StatsBar() {
  return (
    <section className="bg-motergna-red/20 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">      
        <div className="flex items-center justify-center gap-3 text-white">
            <Clock className="h-8 w-8 text-motergna-red" />
            <div>
              <p className="text-xl font-bold text-motergna-green">200+</p>
              <p className="text-sm text-white">Daily Customers</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 ">
            <Car className="h-8 w-8 text-motergna-green" />
            <div>
              <p className="text-xl font-bold text-motergna-red">20,000+</p>
              <p className="text-sm text-white">Active Motorists</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <Fuel className="h-8 w-8 text-motergna-red" />
            <div>
              <p className="text-xl font-bold text-motergna-green">15%</p>
              <p className="text-sm ">Avg. Fuel Savings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
