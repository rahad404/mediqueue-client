'use client'

import {
   UserPlus,
   Search,
   CalendarCheck2,
   GraduationCap,
} from 'lucide-react'

const steps = [
   {
      icon: UserPlus,
      title: 'Create Your Account',
      description:
         'Register using email or Google account to access tutor booking features.',
   },
   {
      icon: Search,
      title: 'Find Your Tutor',
      description:
         'Browse tutors by subject, schedule, and learning mode.',
   },
   {
      icon: CalendarCheck2,
      title: 'Book Your Session',
      description:
         'Select an available slot and confirm your booking instantly.',
   },
   {
      icon: GraduationCap,
      title: 'Start Learning',
      description:
         'Join sessions and manage all your bookings from your dashboard.',
   },
]

export default function HowItWorksSection() {
   return (
      <section className="py-16">
         <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* heading */}
            <div className="mb-12 text-center">
               <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  How MediQueue Works
               </h2>

               <p className="text-muted-foreground mt-3">
                  Simple steps to start learning with expert tutors
               </p>
            </div>

            {/* steps */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
               {steps.map(
                  ({ icon: Icon, title, description }, idx) => (
                     <div
                        key={title}
                        className="bg-card relative rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1"
                     >
                        {/* step number */}
                        <span className="bg-primary text-primary-foreground absolute -top-3 left-4 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                           {idx + 1}
                        </span>

                        <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-xl p-3">
                           <Icon className="h-6 w-6" />
                        </div>

                        <h3 className="text-lg font-semibold">
                           {title}
                        </h3>

                        <p className="text-muted-foreground mt-2 text-sm">
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