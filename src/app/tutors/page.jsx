'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Users, Loader2, Search, ArrowRight, Filter, X, SlidersHorizontal, MapPin, CalendarClock } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import Image from "next/image"

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// achive delay in search field while tupe
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// load all tutor or filtered
export default function TutorsPage() {
  const router = useRouter()

  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchInput, setSearchInput] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)

  const debouncedSearch = useDebounce(searchInput, 500)

  const hasActiveFilters = Boolean(startDate) || Boolean(endDate)

  const clearFilters = () => {
    setStartDate("")
    setEndDate("")
    setFilterOpen(false)
  }

  const fetchTutors = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (debouncedSearch.trim()) {
        params.set("search", debouncedSearch.trim())
      }

      if (startDate) {
        params.set("startDate", startDate)
      }

      if (endDate) {
        params.set("endDate", endDate)
      }

      // api url to hit GET: /tutor
      const url = `${API_BASE}/tutors${params.toString() ? `?${params.toString()}` : ""}`

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Failed to fetch tutors")
      }

      const data = await res.json()
      setTutors(data)
    }
    catch (error) {
      console.error(error)
      setTutors([])
    }
    finally {
      setLoading(false)
    }
  }, [debouncedSearch, startDate, endDate])

  useEffect(() => { fetchTutors() }, [fetchTutors])

  const teachingModeStyle = (mode) => {
    if (mode === "Online") {
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400"
    }

    if (mode === "Offline") {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400"
    }

    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
  }


  // function return the page
  return (
    <div className="min-h-screen bg-slate-50/50 px-16 py-8 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between">

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Find Your Expert Tutor
            </h1>

            <p className="mt-2 text-muted-foreground">
              Browse tutors, check availability, and book sessions.
            </p>
          </div>

          {/* Search + filter */}
          <div className="flex w-full items-center gap-2 md:w-auto">

            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchInput}
                placeholder="Search tutor..."
                className="pl-9"
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
              />

              {searchInput && (
                <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter */}
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4" />

                  {hasActiveFilters && (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-80 p-4"
                align="end"
              >
                <div className="space-y-4">

                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <Filter className="h-4 w-4" />
                      Filter by Session Date
                    </h4>

                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="text-xs text-muted-foreground">
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>From</Label>

                    <Input
                      type="date"
                      value={startDate}
                      max={endDate || undefined}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>To</Label>

                    <Input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={() => setFilterOpen(false)}>
                    Apply Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">

            <span className="text-xs text-muted-foreground">
              Active filters:
            </span>

            {startDate && (
              <Badge variant="secondary" className="gap-1">
                From:
                {new Date(startDate).toLocaleDateString()}

                <button onClick={() => setStartDate("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {endDate && (
              <Badge variant="secondary" className="gap-1">
                To:
                {new Date(endDate).toLocaleDateString()}

                <button onClick={() => setEndDate("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {/* Empty */}
        {!loading && tutors.length === 0 && (
          <div className="rounded-xl border border-dashed bg-background py-16 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold">
              No tutors found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing search or filters.
            </p>
          </div>
        )}

        {/* Grid for tutor cards */}
        {!loading && tutors.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {tutors.map((tutor) => (
              <Card key={tutor._id} className="overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
                {/* reduced image container height for smaller card */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600"}
                    alt={tutor.tutorName}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-3 top-3 rounded bg-background px-2 py-1 text-xs font-medium">
                    {tutor.subject}
                  </div>

                  <div className={`absolute right-3 top-3 rounded border px-2 py-1 text-xs font-medium ${teachingModeStyle(tutor.teachingMode)}`}>
                    {tutor.teachingMode}
                  </div>
                </div>

                {/* tightened spacing inside card */}
                <div className="space-y-3 p-3">
                  <div>
                    <h2 className="text-base font-bold">
                      {tutor.tutorName}
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      {tutor.institution}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {tutor.location}
                    </div>

                    <div className="flex items-center gap-2 text-amber-600">
                      <Users className="h-4 w-4" />
                      {tutor.totalSlots <= 0 ? "Fully booked" : `${tutor.totalSlots} left`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarClock className="h-4 w-4" />
                      Start on:
                    </div>

                    <div className="flex items-center gap-2 text-amber-600">
                      {tutor.sessionStartDate ? new Date(tutor.sessionStartDate).toLocaleDateString("en-US", { dateStyle: "long" }):'-'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">

                    <div>
                      <p className="text-xs text-muted-foreground">Hourly Rate</p>

                      <p className="text-xl font-bold">
                        ৳{tutor.hourlyFee}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">/hr</span>
                      </p>
                    </div>

                    <Button size="sm" onClick={() => router.push(`/tutors/${tutor._id}`)}>
                      Book Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
