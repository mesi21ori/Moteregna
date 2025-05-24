"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "../../../components/ui/switch"

interface PricingHistory {
  id: string
  basePrice: number
  perKmPrice: number
  perMinutePrice: number
  isActive: boolean
  isActiveDate: string | null
  createdAt: string
  updatedBy: string
}

export default function AddPricingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    basePrice: "",
    perKmPrice: "",
    perMinutePrice: "",
    isActive: false,
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
      const response = await fetch("/api/prices/user-history", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch pricing history")
      }

      const { data } = await response.json()
      setUserPricingHistory(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load pricing history")
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const { user } = await response.json()
        setUserName(`${user.firstName} ${user.lastName}`)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/prices/addnew", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          basePrice: Number(formData.basePrice),
          perKmPrice: Number(formData.perKmPrice),
          perMinutePrice: Number(formData.perMinutePrice) || 0.5,
          isActive: formData.isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create pricing")
      }

      const { data } = await response.json()

      // If this price is active, update the UI to reflect that
      if (data.isActive) {
        setUserPricingHistory((prev) =>
          prev.map((price) => ({
            ...price,
            isActive: price.id === data.id,
          })),
        )
      }

      setUserPricingHistory((prev) => [data, ...prev])

      setFormData({
        basePrice: "",
        perKmPrice: "",
        perMinutePrice: "",
        isActive: false,
      })

      toast.success("Pricing created successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create pricing")
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
                    <TableHead>Per KM</TableHead>
                    <TableHead>Per Minute</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPricingHistory.length > 0 ? (
                    userPricingHistory.map((price) => (
                      <TableRow key={price.id}>
                        <TableCell>{price.basePrice !== undefined ? price.basePrice.toFixed(2) : "0.00"} ETB</TableCell>
                        <TableCell>
                          {price.perKmPrice !== undefined ? price.perKmPrice.toFixed(2) : "0.00"} ETB
                        </TableCell>
                        <TableCell>
                          {price.perMinutePrice !== undefined ? price.perMinutePrice.toFixed(2) : "0.00"} ETB
                        </TableCell>
                        <TableCell>
                          {price.isActive ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle className="mr-1 h-3 w-3" /> Active
                            </Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{price.createdAt}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
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
            <CardDescription>Add new pricing configuration</CardDescription>
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
                  placeholder="100.00"
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
                  placeholder="1.20"
                  value={formData.perKmPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="perMinutePrice">Per Minute Price (ETB)</Label>
                <Input
                  id="perMinutePrice"
                  name="perMinutePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.50"
                  value={formData.perMinutePrice}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">Default is 0.50 ETB per minute if not specified</p>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isActive">Set as active pricing</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      basePrice: "",
                      perKmPrice: "",
                      perMinutePrice: "",
                      isActive: false,
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
