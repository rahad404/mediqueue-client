'use client'

import {
   ShieldCheck,
   CalendarCheck2,
   Laptop2,
   Clock3,
   LockKeyhole,
   BookOpenCheck,
} from 'lucide-react'

const features = [
   {
      icon: ShieldCheck,
      title: 'Verified Tutors',
      description:
         'Every tutor profile includes detailed subject expertise, teaching experience, and availability.',
   },
   {
      icon: CalendarCheck2,
      title: 'Easy Session Booking',
      description:
         'Book sessions quickly with a simple and smooth booking process.',
   },
   {
      icon: Laptop2,
      title: 'Flexible Learning Modes',
      description:
         'Choose online, offline, or both based on your learning preference.',
   },
   {
      icon: Clock3,
      title: 'Real-Time Slot Availability',
      description:
         'Prevent booking conflicts with automatic slot tracking.',
   },
   {
      icon: LockKeyhole,
      title: 'Secure Student Experience',
      description:
         'Protected authentication and personal dashboard for safe access.',
   },
   {
      icon: BookOpenCheck,
      title: 'Organized Learning Journey',
      description:
         'Track tutors, sessions, and schedules from one dashboard.',
   },
]

export default function WhyChooseSection() {
   return (
      <section className="py-16">
         <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* heading */}
            <div className="mx-auto mb-12 max-w-2xl text-center">
               <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Why Students Prefer MediQueue
               </h2>

               <p className="text-muted-foreground mt-3">
                  A smarter way to connect with tutors,
                  schedule sessions, and manage learning.
               </p>
            </div>

            {/* cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {features.map(
                  ({
                     icon: Icon,
                     title,
                     description,
                  }) => (
                     <div
                        key={title}
                        className="bg-card rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                     >
                        <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-xl p-3">
                           <Icon className="h-6 w-6" />
                        </div>

                        <h3 className="text-lg font-semibold">
                           {title}
                        </h3>

                        <p className="text-muted-foreground mt-2 text-sm leading-6">
                           {description}
                        </p>
                     </div>
                  )
               )}
            </div>
         </div>
      </section>
   )
}