"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  CalendarIcon,
  CheckCircle2,
  Loader2,
  UploadIcon,
  ChevronRight,
  ChevronLeft,
  User,
  Car,
  FileText,
  Lock,
} from "lucide-react"

import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { cn } from "../lib/utils"
import { format } from "date-fns"
import { useToast } from "../hooks/use-toast"
import { Button } from "./ui/button"

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    gender: z.string().optional(),
    birthdate: z.date().optional(),
    address: z.string().optional(),
    licenseNumber: z.string().min(1, "License number is required"),
    vehicleModel: z.string().min(1, "Vehicle model is required"),
    vehiclePlateNumber: z.string().min(1, "Vehicle plate number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const steps = [
  { id: "personal", name: "Personal Information", icon: User },
  { id: "vehicle", name: "Vehicle Information", icon: Car },
  { id: "documents", name: "Document Uploads", icon: FileText },
  { id: "security", name: "Security", icon: Lock },
]

export default function MotoristRegistrationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileUploads, setFileUploads] = useState({
    profile: null,
    Librephoto: null,
    driversLicencephotoFront: null,
    businessPermit: null,
  })
  const [fileNames, setFileNames] = useState({
    profile: "",
    Librephoto: "",
    driversLicencephotoFront: "",
    businessPermit: "",
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      licenseNumber: "",
      vehicleModel: "",
      vehiclePlateNumber: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setFileUploads((prev) => ({
        ...prev,
        [fieldName]: file,
      }))
      setFileNames((prev) => ({
        ...prev,
        [fieldName]: file.name,
      }))
    }
  }

  const nextStep = async () => {
    const fields = [
      ["firstName", "lastName", "phone", "gender", "birthdate", "address"],
      ["licenseNumber", "vehicleModel", "vehiclePlateNumber"],
      [], // No validation for document uploads step
      ["password", "confirmPassword"],
    ][currentStep]

    if (fields.length > 0) {
      const isValid = await form.trigger(fields as any)
      if (!isValid) return
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Create FormData to handle file uploads
      const formData = new FormData()

      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "birthdate" && key !== "confirmPassword") {
          formData.append(key, value as string)
        }
      })

      // Add birthdate if present, formatted as ISO string
      if (values.birthdate) {
        formData.append("birthdate", values.birthdate.toISOString())
      }

      // Add file uploads if present
      Object.entries(fileUploads).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file)
        }
      })

      // Call the API endpoint
      const response = await fetch("http://134.122.27.115:3000/api/auth/signup", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Success toast
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      })

      // Redirect to login page
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-green-500/20 shadow-xl">
      <CardHeader className="space-y-1 text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg py-3">
        <CardTitle className="text-xl font-bold">Create your account</CardTitle>
        <CardDescription className="text-green-50">
          Enter your information below to register as a motorist
        </CardDescription>
      </CardHeader>

      {/* Stepper */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2",
                  currentStep === index
                    ? "bg-green-600 text-white border-green-600"
                    : currentStep > index
                      ? "bg-green-100 text-green-700 border-green-600"
                      : "bg-gray-100 text-gray-400 border-gray-300",
                )}
              >
                {currentStep > index ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden md:block",
                  currentStep === index ? "text-green-700" : currentStep > index ? "text-green-600" : "text-gray-500",
                )}
              >
                {step.name}
              </span>
            </div>
          ))}
          <div className="absolute left-0 right-0 h-0.5 top-[4.5rem] mx-12 hidden md:block">
            <div className="h-full bg-gray-200"></div>
            <div
              className="h-full bg-green-600 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="David" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                            <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your address" className="resize-none py-2" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="A12345678" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="vehicleModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Toyota Corolla" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="vehiclePlateNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Plate Number</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC 123" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Vehicle Information</h4>
                    <p className="text-sm text-green-700">
                      Please ensure your vehicle information matches your registration documents. This information will
                      be verified.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Document Uploads */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profile">Profile Photo</Label>
                  <div className="relative">
                    <Input
                      id="profile"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "profile")}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => document.getElementById("profile")?.click()}
                      >
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload Profile Photo
                      </Button>
                      {fileNames.profile && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    </div>
                    {fileNames.profile && (
                      <p className="mt-1 text-sm text-muted-foreground truncate">{fileNames.profile}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="libre">Libre Photo</Label>
                  <div className="relative">
                    <Input
                      id="libre"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "Librephoto")}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => document.getElementById("libre")?.click()}
                      >
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload Libre Photo
                      </Button>
                      {fileNames.Librephoto && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    </div>
                    {fileNames.Librephoto && (
                      <p className="mt-1 text-sm text-muted-foreground truncate">{fileNames.Librephoto}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">Driver's License (Front)</Label>
                  <div className="relative">
                    <Input
                      id="license"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "driversLicencephotoFront")}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => document.getElementById("license")?.click()}
                      >
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload License (Front)
                      </Button>
                      {fileNames.driversLicencephotoFront && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    </div>
                    {fileNames.driversLicencephotoFront && (
                      <p className="mt-1 text-sm text-muted-foreground truncate">
                        {fileNames.driversLicencephotoFront}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permit">Business Permit (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="permit"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "businessPermit")}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => document.getElementById("permit")?.click()}
                      >
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload Business Permit
                      </Button>
                      {fileNames.businessPermit && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    </div>
                    {fileNames.businessPermit && (
                      <p className="mt-1 text-sm text-muted-foreground truncate">{fileNames.businessPermit}</p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Important</h4>
                    <p className="text-sm text-red-700">
                      Please upload clear, readable images of all required documents. Blurry or incomplete documents may
                      delay your registration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Security */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Password Requirements</h4>
                    <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
                      <li>At least 6 characters long</li>
                      <li>Include a mix of letters, numbers, and special characters for better security</li>
                      <li>Avoid using easily guessable information like birthdays or names</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <div className="px-6 pb-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} className="bg-green-600 hover:bg-green-700 flex items-center">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  )
}
