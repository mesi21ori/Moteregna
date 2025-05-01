"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Home, LogOut, Map, Package, Settings, ShoppingCart, Users, UserCog, Menu } from "lucide-react"
import { Button } from "../../components/ui/button"
import '../globals.css' 
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Session verification failed')
        }

        const data = await response.json()
        if (data.user) {
          setUserData(data.user)
          setUserRole(data.user.role.toLowerCase())
        }
      } catch (error) {

        router.push('/signin')
      } finally {
        setMounted(true)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    ...(userRole === "superadmin" ? [{ name: "Admin Management", href: "/dashboard/admins", icon: UserCog }] : []),
    { name: "Motorists", href: "/dashboard/motorists", icon: Users },
    { name: "Deliveries", href: "/dashboard/deliveries", icon: Package },
    { name: "Locations", href: "/dashboard/locations", icon: Map },
    { name: "Statistics", href: "/dashboard/statistics", icon: BarChart3 },
    { name: "Pricing", 
      href: userRole === "superadmin" ? "/dashboard/pricing" : "/dashboard/addpricing", 
      icon: ShoppingCart }
  ]

  if (!mounted || !userRole) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64 border-r bg-gradient-primary"></div>
        <div className="flex-1">
          <div className="h-16 border-b glass-card"></div>
          <main className="p-6">Loading...</main>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full mt-4">
      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-gradient-primary p-1 ">
            <Settings className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">Admin Panel</span>
            <span className="text-xs text-white/70 capitalize">
              {userRole.replace("superadmin", "super admin")}
            </span>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-auto py-2 ">
        <div className="px-3 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden md:flex md:w-64 md:flex-col bg-gradient-primary fixed h-screen">
        <SidebarContent />
      </aside>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="p-0 w-[280px] bg-gradient-primary border-r-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b glass-card px-4 md:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold flex-1">
            {navigationItems.find((item) => (pathname ?? "").startsWith(item.href))?.name || "Dashboard"}
          </h1>
          
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}