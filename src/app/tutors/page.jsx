'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Clock,
  Calendar,
  MapPin,
  GraduationCap,
  DollarSign,
  Users,
  Loader2,
  Search,
  ArrowRight
} from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function TutorsPage() {
  const router = useRouter()
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch all tutor card data profiles on mount
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        // Update this endpoint to match your actual backend URL structure
        const res = await fetch("http://localhost:5000/tutors")
        if (res.ok) {
          const data = await res.json()
          setTutors(data)
        } else {
          console.error("Failed to load tutors data structural assets.")
        }
      } catch (error) {
        console.error("Error communicating with data APIs:", error)
      } finally {
        // Fallback placeholder data for immediate testing if backend is currently empty
        setLoading(false)
      }
    };
    fetchTutors()
  }, [])

  // Filter tutors based on name or subject input match
  const filteredTutors = tutors.filter(tutor =>
    tutor.tutorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50/50 dark:bg-zinc-900/50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Finding available tutors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header Title Section */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">Find Your Expert Tutor</h1>
            <p className="mt-2 text-base text-muted-foreground">
              Browse professional educators, verify availability constraints, and book direct private sessions.
            </p>
          </div>

          {/* Dynamic Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full bg-background shadow-sm"
            />
          </div>
        </div>

        {/* Empty State Layout Fallback */}
        {filteredTutors.length === 0 && (
          <div className="text-center py-20 bg-background rounded-xl border border-dashed shadow-sm">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground stroke-[1.5]" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-zinc-100">No tutors found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your keywords or check back later.</p>
          </div>
        )}

        {/* 3-Column Responsive Grid System Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTutors.map((tutor) => (
            <Card
              key={tutor._id || tutor.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div>
                {/* Visual Banner Image Header Container - Restored to full size */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <img
                    src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"}
                    alt={tutor.tutorName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {/* Subtle overlay gradients to make text stand out if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent" />

                  {/* Floating Absolute Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-md bg-background/90 px-2.5 py-1 text-xs font-semibold tracking-wide border shadow-sm backdrop-blur-md">
                      {tutor.subject}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide border shadow-sm ${
                      tutor.teachingMode === 'Online'
                        ? 'bg-blue-50/95 text-blue-700 border-blue-200 dark:bg-blue-950/90 dark:text-blue-400 dark:border-blue-900'
                        : tutor.teachingMode === 'Offline'
                        ? 'bg-amber-50/95 text-amber-700 border-amber-200 dark:bg-amber-950/90 dark:text-amber-400 dark:border-amber-900'
                        : 'bg-emerald-50/95 text-emerald-700 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-400 dark:border-emerald-900'
                    }`}>
                      {tutor.teachingMode}
                    </span>
                  </div>
                </div>

                {/* Info Body */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h2 className="font-bold text-slate-900 dark:text-zinc-50 tracking-tight text-lg group-hover:text-primary transition-colors truncate">
                      {tutor.tutorName}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-zinc-500" />
                      <span className="truncate">{tutor.institution}</span>
                    </div>
                  </div>

                  {/* Clean Inline Metadata Grid */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-zinc-800/80 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate max-w-[140px]">{tutor.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400/90">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>{tutor.totalSlots || 0} slots left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer CTA & Pricing Block */}
              <div className="mx-4 mb-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-zinc-800/80">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Hourly Rate</span>
                  <div className="flex items-baseline font-bold text-slate-900 dark:text-zinc-50">
                    <span className="text-sm font-semibold mr-0.5">৳</span>
                    <span className="text-xl tracking-tight">{tutor.hourlyFee}</span>
                    <span className="text-xs font-normal text-muted-foreground ml-0.5">/hr</span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push(`/tutors/${tutor._id || tutor.id}`)}
                  size="sm"
                  className="rounded-lg font-medium px-4 h-9 shadow-sm hover:opacity-95 transition-opacity"
                >
                  Book Session
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}
