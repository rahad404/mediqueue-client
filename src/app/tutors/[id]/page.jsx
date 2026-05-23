"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  GraduationCap, MapPin, Users, Calendar, Clock,
  BookOpen, ArrowLeft, AlertTriangle, ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// BetterAuth session hook

import { authClient } from "@/lib/auth-client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function TutorDetailsPage() {
  const { id } = useParams()
  const router = useRouter()

  // Real logged-in user
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession()
  const currentUser = sessionData?.user   // null when not logged in

  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch tutor data
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(`${API_BASE}/tutors/${id}`)
        if (res.ok) setTutor(await res.json())
      } catch (err) {
        console.error("Error fetching tutor:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTutor()
  }, [id])

  // Booking submit
  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      toast.error("Please log in to book a session.")
      router.push("/login")
      return
    }

    setBookingLoading(true)
    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: tutor._id,
          tutorName: tutor.tutorName,
          studentName: e.target.name.value,
          studentEmail: currentUser.email,
          studentPhone: e.target.phone.value,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTutor(prev => ({ ...prev, totalSlots: prev.totalSlots - 1 }))
        setIsModalOpen(false)
        toast.success("Booking confirmed! Your slot has been reserved.")
      } else {
        toast.error(data.message || "Booking failed. Please try again.")
      }
    } catch (err) {
      console.error("Booking error:", err)
      toast.error("Network error. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  // Loading / not found states
  if (loading || sessionLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="mx-auto max-w-md py-20 text-center space-y-4">
        <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold">Tutor Profile Not Found</h2>
        <Button onClick={() => router.push("/tutors")} variant="outline">
          Back to Listings
        </Button>
      </div>
    )
  }

  const totalSlotsLeft = tutor.totalSlots || 0
  const isFullyBooked = totalSlotsLeft <= 0
  const parsedsessionStartDate = tutor.sessionStartDate ? new Date(tutor.sessionStartDate) : null
  // booking should be closed when the current date is AFTER the session start date
  const isBookingClosed = parsedsessionStartDate ? new Date() > parsedsessionStartDate : false

  // The button is disabled (but always visible) when fully booked or booking is closed
  const bookingBlocked = isFullyBooked || isBookingClosed

  const teachingModeStyle = (mode) => {
    if (mode === "Online")
      return "bg-blue-50/95 text-blue-700 border-blue-200 dark:bg-blue-950/90 dark:text-blue-400 dark:border-blue-900"
    if (mode === "Offline")
      return "bg-amber-50/95 text-amber-700 border-amber-200 dark:bg-amber-950/90 dark:text-amber-400 dark:border-amber-900"
    return "bg-emerald-50/95 text-emerald-700 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-400 dark:border-emerald-900"
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <Button
        onClick={() => router.push("/tutors")}
        variant="ghost"
        className="gap-2 text-muted-foreground hover:text-foreground pl-0"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

        <div className="md:col-span-1 space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 aspect-square">
            <img
              src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"}
              alt={tutor.tutorName}
              className="h-full w-full object-cover"
            />
          </div>

          <Card className="border-slate-200/60 dark:border-zinc-800/80 shadow-none">
            <CardContent className="p-4 space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-bold text-lg text-slate-900 dark:text-zinc-50">৳{tutor.hourlyFee}/hr</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Teaching Mode</span>
                <Badge variant="outline" className="font-semibold">{tutor.teachingMode}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subject</span>
                <Badge className="font-semibold bg-primary/10 text-primary border-none hover:bg-primary/10">
                  {tutor.subject}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Starts On: </span>
                <Badge className="font-semibold bg-primary/10 text-primary border-none hover:bg-primary/10">
                  {tutor.sessionStartDate}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              {tutor.tutorName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <span>{tutor.institution}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{tutor.location}</span>
              </div>
            </div>
          </div>

          <Card className="shadow-sm border-slate-200/80 dark:border-zinc-800/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Professional Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
              {tutor.experience
                ? `${tutor.experience} years of experience`
                : "No bio configured for this profile yet."}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Calendar className="h-4 w-4 text-primary" />, label: "Available Days", value: tutor.availableDays || "Flexible" },
              { icon: <Clock className="h-4 w-4 text-primary" />, label: "Timing Window", value: tutor.availableTime || "Contact directly" },
              { icon: <Users className="h-4 w-4 text-amber-600" />, label: "Slots Left", value: isFullyBooked ? "Fully booked" : `${totalSlotsLeft} available` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 dark:border-zinc-900 dark:bg-zinc-900/40 text-xs">
                {icon}
                <div>
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">{label}</p>
                  <p className="font-medium text-slate-800 dark:text-zinc-200">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {isFullyBooked && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>This session is fully booked. No available slots left.</span>
            </div>
          )}

          {!isFullyBooked && isBookingClosed && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
              <Calendar className="h-5 w-5 shrink-0" />
              <span>
                Booking is over on {parsedsessionStartDate.toLocaleDateString("en-US", { dateStyle: "long" })}.
              </span>
            </div>
          )}

          <div className="pt-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <span>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto font-semibold px-8 shadow-md"
                    disabled={bookingBlocked}
                    style={bookingBlocked ? { pointerEvents: "auto", cursor: "not-allowed", opacity: 0.5 } : {}}
                    onClick={(e) => { if (bookingBlocked) e.preventDefault() }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {isFullyBooked ? "Session Full" : isBookingClosed ? "Booking Closed" : "Book Class Session"}
                  </Button>
                </span>
              </DialogTrigger>

              {!bookingBlocked && (
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Booking</DialogTitle>
                    <DialogDescription>
                      Review your details and confirm to reserve your slot.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 pt-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Instructor</Label>
                      <Input value={tutor.tutorName} disabled className="bg-slate-50 dark:bg-zinc-900 font-medium" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Tutor Reference ID</Label>
                      <Input value={id} disabled className="bg-slate-50 dark:bg-zinc-900 text-xs font-mono" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs font-semibold">
                          Your Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="name"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Your Email</Label>
                        <Input
                          value={currentUser?.email ?? ""}
                          disabled
                          className="bg-slate-50 dark:bg-zinc-900 text-xs truncate"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-semibold">
                        Contact Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        required
                        placeholder="+8801xxxxxxxxx"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full font-semibold"
                      >
                        {bookingLoading ? "Processing..." : "Confirm & Reserve Slot"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              )}
            </Dialog>
          </div>

        </div>
      </div>
    </div>
  )
}
