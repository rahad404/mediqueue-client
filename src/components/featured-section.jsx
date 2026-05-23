'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
   GraduationCap,
   Users,
   Loader2,
   ArrowRight,
   MapPin,
   CalendarClock,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function AvailableTutorsSection() {
   const router = useRouter()

   const [tutors, setTutors] = useState([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchTutors = async () => {
         setLoading(true)

         try {
            const res = await fetch(`${API_BASE}/tutors?limit=6`)

            if (!res.ok) {
               throw new Error('Failed to fetch tutors')
            }

            const data = await res.json()
            setTutors(data)
         } 
         catch (error) {
            console.error(error)
            setTutors([])
         } finally {
            setLoading(false)
         }
      }

      fetchTutors()
   }, [])

   const teachingModeStyle = mode => {
      if (mode === 'Online') {
         return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400'
      }

      if (mode === 'Offline') {
         return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400'
      }

      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400'
   }

   return (
      <section className="bg-slate-50/50 py-16 dark:bg-zinc-900/40">
         <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* heading */}
            <div className="mb-10 flex flex-col items-center text-center">
               <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Featured Tutors
               </h2>

               <p className="text-muted-foreground mt-3 max-w-2xl">
                  Explore skilled tutors across
                  different subjects and book a
                  session that matches your
                  schedule.
               </p>
            </div>

            {/* loading */}
            {loading && (
               <div className="flex justify-center py-20">
                  <Loader2 className="text-primary h-10 w-10 animate-spin" />
               </div>
            )}

            {/* empty */}
            {!loading &&
               tutors.length === 0 && (
                  <div className="rounded-xl border border-dashed bg-background py-16 text-center">
                     <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground" />

                     <h3 className="mt-4 text-lg font-semibold">
                        No tutors available
                     </h3>
                  </div>
               )}

            {/* cards */}
            {!loading && tutors.length > 0 && (
                  <>
                     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tutors.map(tutor => (
                           <Card
                              key={tutor._id}
                              className="overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
                           >
                              {/* image */}
                              <div className="relative h-60 overflow-hidden">
                                 <img
                                    src={
                                       tutor.photo ||
                                       'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600'
                                    }
                                    alt={
                                       tutor.tutorName
                                    }
                                    className="h-full w-full object-cover"
                                 />

                                 <div className="absolute left-3 top-3 rounded bg-background px-2 py-1 text-xs font-medium">
                                    {tutor.subject}
                                 </div>

                                 <div
                                    className={`absolute right-3 top-3 rounded border px-2 py-1 text-xs font-medium ${teachingModeStyle(
                                       tutor.teachingMode
                                    )}`}
                                 >
                                    {
                                       tutor.teachingMode
                                    }
                                 </div>
                              </div>

                              {/* content */}
                              <div className="space-y-3 p-3">
                                 <div>
                                    <h2 className="text-base font-bold">
                                       {
                                          tutor.tutorName
                                       }
                                    </h2>

                                    <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                                       <GraduationCap className="h-4 w-4" />

                                       {
                                          tutor.institution
                                       }
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between text-sm">
                                    <div className="text-muted-foreground flex items-center gap-2">
                                       <MapPin className="h-4 w-4" />

                                       {
                                          tutor.location
                                       }
                                    </div>

                                    <div className="flex items-center gap-2 text-amber-600">
                                       <Users className="h-4 w-4" />

                                       {tutor.totalSlots <=
                                          0
                                          ? 'Fully booked'
                                          : `${tutor.totalSlots} left`}
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between text-sm">
                                    <div className="text-muted-foreground flex items-center gap-2">
                                       <CalendarClock className="h-4 w-4" />

                                       Start on:
                                    </div>

                                    <div className="text-amber-600">
                                       {tutor.sessionStartDate
                                          ? new Date(
                                             tutor.sessionStartDate
                                          ).toLocaleDateString(
                                             'en-US',
                                             {
                                                dateStyle:
                                                   'medium',
                                             }
                                          )
                                          : '-'}
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between border-t pt-3">
                                    <div>
                                       <p className="text-muted-foreground text-xs">
                                          Hourly Rate
                                       </p>

                                       <p className="text-xl font-bold">
                                          ৳
                                          {
                                             tutor.hourlyFee
                                          }

                                          <span className="text-muted-foreground ml-1 text-sm font-normal">
                                             /hr
                                          </span>
                                       </p>
                                    </div>

                                    <Button
                                       size="sm"
                                       onClick={() =>
                                          router.push(
                                             `/tutors/${tutor._id}`
                                          )
                                       }
                                    >
                                       Book Session

                                       <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                 </div>
                              </div>
                           </Card>
                        ))}
                     </div>

                     {/* CTA */}
                     <div className="mt-10 flex justify-center">
                        <Button size="lg" variant="outline" onClick={() => router.push('/tutors')}>
                           View All Tutors
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </div>
                  </>
               )}
         </div>
      </section>
   )
}
