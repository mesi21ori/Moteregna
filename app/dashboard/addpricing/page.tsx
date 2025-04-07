"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { User } from "lucide-react"
import { toast } from "sonner"

interface PricingHistory {
  id: string
  basePrice: number
  perKmPrice: number
  createdAt: string
  updatedBy: string
}

export default function AddPricingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    basePrice: "",
    perKmPrice: ""
  })
  const [userPricingHistory, setUserPricingHistory] = useState<PricingHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    fetchUserPricingHistory()
    fetchUserData()
  }, [])

  const fetchUserPricingHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/prices/user-history', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch pricing history')
      }

      const { data } = await response.json()
      setUserPricingHistory(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load pricing history')
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const { user } = await response.json()
        setUserName(`${user.firstName} ${user.lastName}`)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/prices/addnew', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basePrice: Number(formData.basePrice),
          perKmPrice: Number(formData.perKmPrice)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create pricing')
      }

      const { data } = await response.json()
      
    
      setUserPricingHistory(prev => [data, ...prev])
      

      setFormData({
        basePrice: "",
        perKmPrice: ""
      })

      toast.success('Pricing created successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create pricing')
    }
  }

  if (loading && userPricingHistory.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Add New Pricing</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Pricing History</CardTitle>
            <CardDescription>Recent pricing you've created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Per KM Price</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPricingHistory.length > 0 ? (
                    userPricingHistory.map((price) => (
                      <TableRow key={price.id}>
                        <TableCell>{price.basePrice.toFixed(2)} ETB</TableCell>
                        <TableCell>{price.perKmPrice.toFixed(2)} ETB</TableCell>
                        <TableCell>
                          <Badge variant="outline">{price.createdAt}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-primary" />
                            {price.updatedBy}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No pricing history found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right side - Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Pricing</CardTitle>
            <CardDescription>Add new base and per kilometer pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="basePrice">Base Price (ETB)</Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10.00"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="perKmPrice">Per Kilometer Price (ETB)</Label>
                <Input
                  id="perKmPrice"
                  name="perKmPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2.50"
                  value={formData.perKmPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setFormData({
                      basePrice: "",
                      perKmPrice: ""
                    })
                  }}
                >
                  Clear
                </Button>
                <Button type="submit">Create Pricing</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}