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
import { CheckCircle, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"

interface Motorist {
  id: string
  name: string
  phone: string
  licenseNumber: string
  vehicle: string
  status: string
  onlineStatus: string
  joinedDate: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function MotoristsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [onlineStatusFilter, setOnlineStatusFilter] = useState<string>("all")
  const [allMotorists, setAllMotorists] = useState<Motorist[]>([])
  const [filteredMotorists, setFilteredMotorists] = useState<Motorist[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  useEffect(() => {
    fetchMotorists()
  }, [pagination.page])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, statusFilter, onlineStatusFilter, allMotorists])

  const fetchMotorists = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `http://134.122.27.115:3002/api/admin/list_of_motorist`,
        {
          params: {
            page: pagination.page,
            limit: pagination.limit
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      
      if (response.status !== 200) {
        throw new Error('Failed to fetch motorists')
      }
      
      const { data, pagination: paginationData } = response.data
      setAllMotorists(data)
      setPagination({
        page: paginationData.page,
        limit: paginationData.limit,
        total: paginationData.total,
        totalPages: paginationData.totalPages
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load motorists')
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let results = [...allMotorists]

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(motorist => 
        motorist.name.toLowerCase().includes(term) ||
        motorist.phone.includes(term) ||
        motorist.licenseNumber.toLowerCase().includes(term) ||
        motorist.vehicle.toLowerCase().includes(term) ||
        motorist.joinedDate.toLowerCase().includes(term)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(motorist => motorist.status === statusFilter)
    }

    // Apply online status filter
    if (onlineStatusFilter !== "all") {
      results = results.filter(motorist => motorist.onlineStatus === onlineStatusFilter)
    }

    setFilteredMotorists(results)
  }

  const handleDeleteMotorist = async (motoristId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this motorist?")
    if (!confirmed) return

    const token = localStorage.getItem('accessToken')
    try {
      await axios.delete(`http://134.122.27.115:3002/api/motorist/delete/${motoristId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Motorist deleted successfully")
      // Reset to page 1 after deletion to avoid empty page
      setPagination(prev => ({ ...prev, page: 1 }))
      fetchMotorists()
    } catch (err) {
      toast.error("Failed to delete motorist")
    }
  }

  const toggleAvailability = async (motoristId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const isAvailable = currentStatus !== "Available"
      await axios.post(
        `http://134.122.27.115:3002/api/motorist/isAvailable`,
        {
          motoristId,
          isAvailable,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success(`Motorist marked as ${isAvailable ? "Available" : "Unavailable"}`)
      fetchMotorists()
    } catch (error) {
      toast.error("Failed to update availability")
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  if (loading && allMotorists.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Motorists</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search motorists..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={onlineStatusFilter}
              onChange={(e) => setOnlineStatusFilter(e.target.value)}
            >
              <option value="all">All Online Statuses</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Motorist List</CardTitle>
          <CardDescription>
            Showing {filteredMotorists.length} of {pagination.total} motorists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>License Number</TableHead>
                    <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMotorists.length > 0 ? (
                    filteredMotorists.map((motorist) => (
                      <TableRow key={motorist.id}>
                        <TableCell className="font-medium">{motorist.name}</TableCell>
                        <TableCell>{motorist.licenseNumber}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {motorist.vehicle}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{motorist.phone}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={motorist.status === 'Available' ? 'default' : 'secondary'}>
                              {motorist.status}
                            </Badge>
                            <Badge variant={motorist.onlineStatus === 'Online' ? 'default' : 'secondary'} className="w-fit">
                              {motorist.onlineStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{motorist.joinedDate}</TableCell>
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
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/motorists/${motorist.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteMotorist(motorist.id)}>
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleAvailability(motorist.id, motorist.status)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                {motorist.status === "Available" ? "Mark Unavailable" : "Mark Available"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No motorists found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} motorists
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                >
                  First
                </Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}