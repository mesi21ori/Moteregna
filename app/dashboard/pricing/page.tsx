"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Badge } from "../../../components/ui/badge"
import { Edit, User, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Price {
  id: string
  basePrice: number
  perKmPrice: number
  createdAt: string
  updatedAt: string
  updatedBy: string
}

export default function PricingPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null)
  const [newBasePrice, setNewBasePrice] = useState("")
  const [newPerKmPrice, setNewPerKmPrice] = useState("")
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  useEffect(() => {
    fetchPrices()
  }, [pagination.page, searchTerm])

  const fetchPrices = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/prices/history?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch pricing data')
      }

      const { data, pagination: paginationData } = await response.json()
      setPrices(data)
      setPagination(paginationData)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load pricing data')
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/signin')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleEditClick = (price: Price) => {
    setSelectedPrice(price)
    setNewBasePrice(price.basePrice.toString())
    setNewPerKmPrice(price.perKmPrice.toString())
    setEditDialogOpen(true)
  }

  const handleSavePrice = async () => {
    if (!selectedPrice) return

    try {
      const response = await fetch('/api/prices', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basePrice: Number(newBasePrice),
          perKmPrice: Number(newPerKmPrice)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update pricing')
      }

      toast.success('Pricing updated successfully')
      fetchPrices() 
      setEditDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update pricing')
    }
  }

  const filteredPrices = prices.filter((price) => 
    price.updatedBy.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && prices.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Pricing History</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by updated by..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPagination(prev => ({ ...prev, page: 1 }))
            }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price List</CardTitle>
          <CardDescription>View and update pricing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Per KM Price</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.length > 0 ? (
                  filteredPrices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>{price.basePrice.toFixed(2)} ETB</TableCell>
                      <TableCell>ETB {price.perKmPrice.toFixed(2)}/km</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {new Date(price.createdAt).toLocaleDateString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {new Date(price.updatedAt).toLocaleDateString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-primary" />
                          {price.updatedBy}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(price)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No pricing data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Pricing</DialogTitle>
            <DialogDescription>
              Set new base price and per kilometer rate
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="basePrice">Base Price (ETB)</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0"
                value={newBasePrice}
                onChange={(e) => setNewBasePrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="perKmPrice">Per KM Price (ETB)</Label>
              <Input
                id="perKmPrice"
                type="number"
                step="0.01"
                min="0"
                value={newPerKmPrice}
                onChange={(e) => setNewPerKmPrice(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePrice}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}