"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, User, Car, CopyrightIcon as License, Building } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { toast } from "sonner"
import axios from "axios"

interface MotoristDetails {
  id: string
  name: string
  email: string
  phone: string
  address: string
  licenseNumber: string
  vehicleModel: string
  vehiclePlate: string
  vehicleYear: string
  vehicleColor: string
  status: string
  registrationDate: string
  profilePhoto: string
  licensePhoto: string
  vehiclePhoto: string
  businessPermitPhoto: string
  isAvailable: boolean
  isOnline: boolean
  currentLocation: string | null
}

export default function MotoristDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const motoristId = params?.id as string

  const [motorist, setMotorist] = useState<MotoristDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMotoristDetails = async () => {
      try {
        setLoading(true)
        console.log("gettings motorist details")
        const response = await axios.get(`http://134.122.27.115:3000/api/motorist/${motoristId}`,
          {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTk5bWNydzIwMDAwcnpia3p6bmJhZ2w3IiwicGhvbmUiOiIxMjM0NTY3ODkwIiwicm9sZSI6IlNVUEVSQURNSU4iLCJzZXNzaW9uSWQiOiI4OWVkMTRmNi1hZmNhLTRiOTgtOGI3NS01ZGE0YmMzMDg5ZmIiLCJpYXQiOjE3NDc5OTc5MTEsImV4cCI6MTc1MDU4OTkxMX0.I2y-LnECnJIYBYsE362XbTGtRfmw9aBYWhV_-EYQ2oQ"
          }
        }
        )
        console.log(response)

        if (response.status != 200) {
          throw new Error('Failed to fetch motorist details')
        }

        const data = await response.data
        setMotorist(data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load motorist details')
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    if (motoristId) {
      fetchMotoristDetails()
    }
  }, [motoristId, router])

  if (loading || !motorist) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/motorists">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-2xl font-bold">Motorist Details</h1>
          <div className="flex gap-2">
            <Badge variant={motorist.status === 'active' ? 'default' : 'secondary'}>
              {motorist.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant={motorist.isOnline ? 'default' : 'secondary'}>
              {motorist.isOnline ? 'Online' : 'Offline'}
            </Badge>
            <Badge variant={motorist.isAvailable ? 'default' : 'secondary'}>
              {motorist.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
      
        <Card className="glass-card border-0 shadow-lg md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-background">
              
                <img
                      src={`http://134.122.27.115${motorist.profilePhoto}`}
                      alt="Business Permit"
                      className="object-contain"
                    />
                 
            </div>
            <h2 className="text-xl font-bold">{motorist.name}</h2>
            <p className="text-muted-foreground">{motorist.email}</p>
            <p className="text-muted-foreground">{motorist.phone}</p>
            <Separator className="my-4" />
            <div className="grid w-full text-left gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">License:</span>
                <span className="font-medium">{motorist.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-medium">{motorist.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registered:</span>
                <span className="font-medium">{new Date(motorist.registrationDate).toLocaleDateString()}</span>
              </div>
              {motorist.currentLocation && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{motorist.currentLocation}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle>Motorist Information</CardTitle>
            <CardDescription>Complete details and attachments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2 hidden sm:inline-block" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="vehicle">
                  <Car className="h-4 w-4 mr-2 hidden sm:inline-block" />
                  Vehicle
                </TabsTrigger>
                <TabsTrigger value="license">
                  <License className="h-4 w-4 mr-2 hidden sm:inline-block" />
                  License
                </TabsTrigger>
                <TabsTrigger value="business">
                  <Building className="h-4 w-4 mr-2 hidden sm:inline-block" />
                  Business
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                    <p className="text-base">{motorist.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                    <p className="text-base">{motorist.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                    <p className="text-base">{motorist.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Registration Date</h3>
                    <p className="text-base">{new Date(motorist.registrationDate).toLocaleDateString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <p className="text-base">{motorist.address}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Profile Photo</h3>
                  <div className="relative h-60 w-full rounded-md overflow-hidden border">
                    <img
                      src={`http://134.122.27.115${motorist.profilePhoto}`}
                      alt="Business Permit"
                      className="object-contain"
                    />
                    {/* <Image
                      src={`http://134.122.27.115${motorist.profilePhoto}`}
                      alt="Profile Photo"
                      fill
                      className="object-contain"
                    /> */}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download Photo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="vehicle" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Vehicle Model</h3>
                    <p className="text-base">{motorist.vehicleModel}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Plate Number</h3>
                    <p className="text-base">{motorist.vehiclePlate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Year</h3>
                    <p className="text-base">{motorist.vehicleYear}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Color</h3>
                    <p className="text-base">{motorist.vehicleColor}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Vehicle Photo</h3>
                  <div className="relative h-60 w-full rounded-md overflow-hidden border">
                    <img
                      src={`http://134.122.27.115${motorist.vehiclePhoto}`}
                      alt="Business Permit"
                      className="object-contain"
                    />
                    {/* <Image
                      src={motorist.vehiclePhoto}
                      alt="Vehicle Photo"
                      fill
                      className="object-contain"
                    /> */}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download Photo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="license" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">License Number</h3>
                    <p className="text-base">{motorist.licenseNumber}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">License Photo</h3>
                  <div className="relative h-60 w-full rounded-md overflow-hidden border">
                    <img
                      src={`http://134.122.27.115${motorist.licensePhoto}`}
                      alt="Business Permit"
                      className="object-contain"
                    />
                    {/* <Image
                      src={motorist.licensePhoto}
                      alt="License Photo"
                      fill
                      className="object-contain"
                    /> */}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download Photo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2">Business Permit</h3>
                  <div className="relative h-60 w-full rounded-md overflow-hidden border">
                    <img
                      src={`http://134.122.27.115${motorist.businessPermitPhoto}`}
                      alt="Business Permit"
                      className="object-contain"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}