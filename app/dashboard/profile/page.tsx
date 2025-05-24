"use client"

import type React from "react"

import { Button } from "components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Calendar, MapPin, Phone, User, Save, X, Edit, Lock } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "components/ui/badge"
import { Skeleton } from "components/ui/skeleton"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { toast } from "components/ui/use-toast"
import { Toaster } from "components/ui/toaster"
import Link from "next/link"

interface ProfileData {
  id: string
  name: string
  firstName: string
  middleName?: string
  lastName: string
  phone: string
  gender?: string
  birthdate?: string
  address?: string
  role: string
  status: string
  profilePhoto: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/getdata/profile")

        if (!response.ok) {
          throw new Error(`Error fetching profile: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success) {
          setProfileData(result.data)
          setEditData({
            firstName: result.data.firstName,
            middleName: result.data.middleName || "",
            lastName: result.data.lastName,
            phone: result.data.phone,
          })
        } else {
          throw new Error(result.message || "Failed to fetch profile data")
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err)
        setError(err.message || "An error occurred while fetching profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided"
    try {
      return format(new Date(dateString), "PPP")
    } catch (e) {
      return "Invalid date"
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-red-500"
      case "ADMIN":
        return "bg-blue-500"
      case "MOTORIST":
        return "bg-green-500"
      case "CUSTOMER":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)

      // Validate inputs
      if (!editData.firstName.trim() || !editData.lastName.trim() || !editData.phone.trim()) {
        toast({
          title: "Validation Error",
          description: "First name, last name, and phone are required",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/getdata/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      })

      const result = await response.json()

      if (result.success) {
        // Update local state with new data
        if (profileData) {
          const updatedName = `${editData.firstName} ${editData.middleName ? editData.middleName + " " : ""}${
            editData.lastName
          }`
          setProfileData({
            ...profileData,
            firstName: editData.firstName,
            middleName: editData.middleName,
            lastName: editData.lastName,
            name: updatedName,
            phone: editData.phone,
          })
        }

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        })

        setIsEditing(false)
      } else {
        throw new Error(result.message || "Failed to update profile")
      }
    } catch (err: any) {
      console.error("Error updating profile:", err)
      toast({
        title: "Update Failed",
        description: err.message || "An error occurred while updating your profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Toaster />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Profile Information</span>
            {!loading && profileData && (
              <Badge className={getRoleBadgeColor(profileData.role)}>{profileData.role}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="grid w-full gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
              <Button className="mt-4" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          ) : profileData ? (
            <Tabs defaultValue="profile" className="w-full">
          
              <TabsContent value="profile" className="mt-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.profilePhoto || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback>{getInitials(profileData.name)}</AvatarFallback>
                  </Avatar>

                  {!isEditing ? (
                    <>
                      <div className="text-center">
                        <h2 className="text-xl font-bold">{profileData.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          Member since {formatDate(profileData.createdAt)}
                        </p>
                      </div>

                      <div className="grid w-full gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div className="grid gap-1">
                            <p className="text-sm font-medium">Full Name</p>
                            <p className="text-sm text-muted-foreground">{profileData.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div className="grid gap-1">
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{profileData.phone}</p>
                          </div>
                        </div>

                        {profileData.birthdate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="grid gap-1">
                              <p className="text-sm font-medium">Birthdate</p>
                              <p className="text-sm text-muted-foreground">{formatDate(profileData.birthdate)}</p>
                            </div>
                          </div>
                        )}

                        {profileData.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div className="grid gap-1">
                              <p className="text-sm font-medium">Address</p>
                              <p className="text-sm text-muted-foreground">{profileData.address}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-green-500" />
                          <div className="grid gap-1">
                            <p className="text-sm font-medium">Status</p>
                            <p className="text-sm text-muted-foreground">{profileData.status}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex w-full gap-2">
                        <Button className="flex-1" onClick={() => setIsEditing(true)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                          Close
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={editData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="middleName">Middle Name (Optional)</Label>
                        <Input
                          id="middleName"
                          name="middleName"
                          value={editData.middleName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" value={editData.lastName} onChange={handleInputChange} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={editData.phone} onChange={handleInputChange} />
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={handleSaveProfile} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Skeleton className="h-4 w-4 mr-2 rounded-full" /> Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" /> Save
                            </>
                          )}
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

            </Tabs>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
