import Link from "next/link"
import { Car, Clock, Fuel, Facebook, Twitter, Instagram, Linkedin, Download, LogIn } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-motergna-red/90 to-motergna-green/90 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1 */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-motergna-red to-motergna-green">
              MOTERGNA
            </h3>
            <p className="mb-4 text-center md:text-left text-white">
              Smart solutions for modern motorists. Save time, save fuel, drive smarter.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-white/80">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white hover:text-white/80">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white hover:text-white/80">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white hover:text-white/80">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <Link href="#features" className="text-white hover:text-white/80">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#dashboard" className="text-white hover:text-white/80">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-white hover:text-white/80">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-white/80">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-lg font-semibold">Resources</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <Link href="#" className="text-white hover:text-white/80">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-white/80">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-white/80">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-white/80">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-lg font-semibold">Get Started</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <Link href="#" className="flex items-center justify-center md:justify-start text-white hover:text-white/80">
                  <Download className="mr-2 h-4 w-4" /> Download App
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center justify-center md:justify-start text-white hover:text-white/80">
                  <LogIn className="mr-2 h-4 w-4" /> Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="mb-6 flex flex-col items-center sm:flex-row sm:justify-center gap-6">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-white" />
              <span className="text-sm text-white">20,000+ Active Motorists</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-white" />
              <span className="text-sm text-white">200+ Daily Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-white" />
              <span className="text-sm text-white">15% Avg. Fuel Savings</span>
            </div>
          </div>
          <p className="text-center text-sm text-white">
            &copy; {new Date().getFullYear()} MOTERGNA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}