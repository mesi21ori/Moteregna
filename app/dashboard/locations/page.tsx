"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Badge } from "../../../components/ui/badge"
import { Eye, MapPin, MoreHorizontal, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Location {
  id: string
  name: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  deliveryStats: {
    asPickup: number
    asDropoff: number
    total: number
  }
  createdAt: string
  updatedAt: string
}

export default function LocationsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  useEffect(() => {
    fetchLocations()
  }, [pagination.page, searchTerm])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/admin/list_of_location?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch locations')
      }

      const { data, pagination: paginationData } = await response.json()
      setLocations(data)
      setPagination(paginationData)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load locations')
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getActivityStatus = (totalDeliveries: number) => {
    if (totalDeliveries === 0) return 'New'
    if (totalDeliveries > 100) return 'Very Active'
    if (totalDeliveries > 50) return 'Active'
    return 'Moderate'
  }

  if (loading && locations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Locations</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
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
          <CardTitle>Location List</CardTitle>
          <CardDescription>View and manage all service locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Pickups</TableHead>
                  <TableHead>Dropoffs</TableHead>
                  <TableHead>Total Deliveries</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-destructive" />
                          {location.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {location.address}
                      </TableCell>
                      <TableCell>{location.deliveryStats.asPickup}</TableCell>
                      <TableCell>{location.deliveryStats.asDropoff}</TableCell>
                      <TableCell>{location.deliveryStats.total}</TableCell>
                      <TableCell>
                        <Badge variant={
                          location.deliveryStats.total > 100 ? "default" : 
                          location.deliveryStats.total > 50 ? "secondary" : "outline"
                        }>
                          {getActivityStatus(location.deliveryStats.total)}
                        </Badge>
                      </TableCell>
                      <TableCell>{location.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No locations found.
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
    </div>
  )
}