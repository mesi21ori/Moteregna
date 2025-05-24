import { Button } from "components/ui/button"
import Image from "next/image"

export default function AppShowcase() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Experience the MOTERGNA App</h2>
            <p className="mb-8 text-lg text-gray-600">
              Our intuitive mobile app puts the power of MOTERGNA in your pocket. Track your vehicle, receive alerts,
              and save on fuel - all from your smartphone.
            </p>
            <ul className="mb-8 space-y-4">
              <li className="flex items-start">
                <span className="mr-3 text-xl font-bold text-motergna-green">✓</span>
                <span>Real-time vehicle tracking and diagnostics</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-xl font-bold text-motergna-green">✓</span>
                <span>Fuel price comparisons and savings calculator</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-xl font-bold text-motergna-green">✓</span>
                <span>Maintenance reminders and service history</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <Image
              src="/images/image.png?height=600&width=300"
              alt="MOTERGNA App Screenshot"
              width={300}
              height={600}
              className="mx-auto rounded-3xl shadow-2xl"
            />
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <Button className="bg-motergna-green hover:bg-motergna-green/90">Start Free Trial</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
