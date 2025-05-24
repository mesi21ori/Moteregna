// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "../../components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
// import { Input } from "../../components/ui/input"
// import { Label } from "../../components/ui/label"
// import { Package2 } from "lucide-react"

// export default function LoginPage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     phone: "",
//     password: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch('/api/auth/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed')
//       }

//       router.push("/dashboard")
      

//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-destructive/10">
//       <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
//       <div className="w-full max-w-md animate-fadeIn">
//         <div className="text-center mb-8">
//           <div className="inline-flex rounded-full bg-gradient-primary p-3 mb-3">
//             <Package2 className="h-8 w-8 text-primary-foreground" />
//           </div>
//           <p className="text-muted-foreground mt-2">Sign in to access your panel</p>
//         </div>

//         <Card className="glass-card border-0 shadow-xl animate-slideInUp">
//           <CardHeader>
//             <CardTitle className="text-xl">Login</CardTitle>
//             <CardDescription>Enter your credentials to continue</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit}>
//               <div className="grid gap-4">
//                 {error && (
//                   <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
//                     {error}
//                   </div>
//                 )}
//                 <div className="grid gap-2">
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     placeholder="+251534567890"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="bg-white/50 backdrop-blur-sm"
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="password">Password</Label>
//                     <a href="#" className="text-xs text-primary hover:underline">
//                       Forgot password?
//                     </a>
//                   </div>
//                   <Input
//                     id="password"
//                     name="password"
//                     type="password"
//                     placeholder="••••••••"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="bg-white/50 backdrop-blur-sm"
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
//                   {isLoading ? "Signing in..." : "Sign In"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//           <CardFooter className="flex flex-col">
//             <div className="text-sm text-muted-foreground text-center mt-2">
//               <span>Moteregna</span>
//               <div className="mt-1">
//                 <strong>Phone number</strong> 0110987654 | <strong>email:</strong> Moteregna@emal.com
//               </div>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Package2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      router.push("/dashboard")
      

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-destructive/10">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex rounded-full bg-gradient-primary p-3 mb-3">
            <Package2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground mt-2">Sign in to access your panel</p>
        </div>

        <Card className="glass-card border-0 shadow-xl animate-slideInUp">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {error && (
                  <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+251534567890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-white/50 backdrop-blur-sm pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-muted-foreground text-center mt-2">
              <span>Moteregna</span>
              <div className="mt-1">
                <strong>Phone number</strong> 0110987654 | <strong>email:</strong> Moteregna@emal.com
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}