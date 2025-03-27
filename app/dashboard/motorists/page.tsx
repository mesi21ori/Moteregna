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
import { Eye, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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

export default function MotoristsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [motorists, setMotorists] = useState<Motorist[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  useEffect(() => {
    fetchMotorists()
  }, [pagination.page, searchTerm])

  const fetchMotorists = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/admin/list_of_motorist?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch motorists')
      }

      const { data, pagination: paginationData } = await response.json()
      setMotorists(data)
      setPagination(paginationData)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load motorists')
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

  const filteredMotorists = motorists.filter(
    (motorist) =>
      motorist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motorist.phone.includes(searchTerm) ||
      motorist.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motorist.vehicle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading && motorists.length === 0) {
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
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search motorists..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPagination(prev => ({ ...prev, page: 1 }))
            }}
          />
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Motorist List</CardTitle>
          <CardDescription>View and manage all registered motorists</CardDescription>
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
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No motorists found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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