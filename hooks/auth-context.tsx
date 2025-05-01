"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  firstName?: string
  lastName?: string
  email: string
  role: string
  [key: string]: any
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
        // Add cache: 'no-store' to prevent caching of the verification request
        cache: "no-store",
      })

      if (!response.ok) {
        setUser(null)
        return
      }

      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth verification error:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      setUser(data.user)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      })

      // Force clear the user state regardless of API response
      setUser(null)

      // Add a small delay to ensure state updates before navigation
      await new Promise((resolve) => setTimeout(resolve, 100))

      router.push("/")

      // Force a hard refresh to clear any cached state
      if (typeof window !== "undefined") {
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear user state even if API call fails
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Check authentication when the component mounts, pathname changes, or user state changes
  useEffect(() => {
    checkAuth()
  }, [pathname])

  // Add a separate effect to refresh auth state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
