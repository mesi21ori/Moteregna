
import { Button } from "components/ui/button"
import { Download } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-cover bg-center py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-motergna-red/90 to-motergna-green/90"></div>
      <div className="container relative z-10 mx-auto px-4 text-center text-white">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          Join 20,000+ Motorists Trusting MOTERGNA Daily!
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 md:text-xl">
          Saving drivers time and money – 200+ customers served every day.
        </p>
        <div className="flex justify-center">
          <Button className="h-12 bg-motergna-green px-8 text-lg hover:bg-motergna-green/90">
            <Download className="mr-2 h-5 w-5" /> Download Now
          </Button>
        </div>
      </div>
    </section>
  )
}
