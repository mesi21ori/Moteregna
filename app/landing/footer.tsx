import Link from "next/link"
import { Car, Clock, Fuel, Facebook, Twitter, Instagram, Linkedin, Download, LogIn } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-motergna-green/20 to-motergna-red/20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1 */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-motergna-red to-motergna-green">
              MOTERGNA
            </h3>
            <p className="mb-4 text-center md:text-left text-gray-700 ">
              Smart solutions for modern motorists. Save time, save fuel, drive smarter.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-motergna-red ">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-motergna-red ">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-motergna-red ">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-motergna-red ">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-lg font-semibold text-motergna-red ">Quick Links</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <Link href="#features" className="text-gray-700 ">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#dashboard" className="text-gray-700 ">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-700 ">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 ">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-lg font-semibold text-motergna-red">Resources</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <Link href="#" className="text-gray-700 ">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 ">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 ">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-lg font-semibold text-motergna-red">Get Started</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <Link href="#" className="flex items-center justify-center md:justify-start text-gray-700">
                  <Download className="mr-2 h-4 w-4 text-motergna-green" /> Download App
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center justify-center md:justify-start text-gray-700">
                  <LogIn className="mr-2 h-4 w-4 text-motergna-green" /> Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-motergna-green/20 pt-8">
          <div className="mb-6 flex flex-col items-center sm:flex-row sm:justify-center gap-6">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-motergna-red" />
              <span className="text-sm text-gray-700">20,000+ Active Motorists</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-motergna-red" />
              <span className="text-sm text-gray-700">200+ Daily Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-motergna-red" />
              <span className="text-sm text-gray-700">15% Avg. Fuel Savings</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-700">
            &copy; {new Date().getFullYear()} MOTERGNA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}