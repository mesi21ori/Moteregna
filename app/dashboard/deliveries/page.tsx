"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { Eye, MoreHorizontal, Search, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "../../../components/ui/button"

interface Delivery {
  id: string
  startPoint: string
  endPoint: string
  motorist: string
  motoristContact: string
  customer: string
  distance: string
  fee: string
  status: string
  startTime: string
  endTime: string
  createdAt: string
  coordinates: {
    start: {
      lat: number
      lng: number
    }
    end: {
      lat: number
      lng: number
    } | null
  }
}

export default function DeliveriesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  useEffect(() => {
    fetchDeliveries()
  }, [pagination.page, searchTerm])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/admin/list_of_delivery?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`,
        {
          credentials: 'include'
        }
      )

      
      if (!response.ok) {
        throw new Error('Failed to fetch deliveries')
      }

      const { data, pagination: paginationData } = await response.json()
      setDeliveries(data)
      setPagination(paginationData)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load deliveries')
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

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.motorist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.endPoint.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "in-progress":
      case "in_progress":
      case "assigned":
        return <Badge variant="secondary">In Progress</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "cancelled":
      case "rejected":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (dateString === 'Not started' || dateString === 'In progress') {
      return dateString
    }
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  if (loading && deliveries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Deliveries</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deliveries..."
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
          <CardTitle>Delivery List</CardTitle>
          <CardDescription>View and manage all deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Motorist</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{delivery.motorist}</span>
                          <span className="text-xs text-muted-foreground">{delivery.motoristContact}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-primary" />
                          {delivery.startPoint}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-destructive" />
                          {delivery.endPoint}
                        </div>
                      </TableCell>
                      <TableCell>{delivery.distance}</TableCell>
                      <TableCell>{delivery.fee}</TableCell>
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                      <TableCell>{formatDate(delivery.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No deliveries found.
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