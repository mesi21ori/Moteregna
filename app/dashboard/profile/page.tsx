"use client"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "Super Admin"
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            
            <div className="grid w-full gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={profileData.name} readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profileData.email} readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profileData.role} readOnly />
              </div>
            </div>
            
            <Button 
              className="w-full mt-4"
              onClick={() => router.back()}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}