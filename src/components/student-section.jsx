'use client'

import { Quote } from 'lucide-react'

export default function StudentSuccessSection() {
   return (
      <section className="bg-slate-50/50 py-16 dark:bg-zinc-900/40">
         <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
            <div className="mb-6 flex justify-center">
               <div className="bg-primary/10 text-primary rounded-full p-3">
                  <Quote className="h-6 w-6" />
               </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
               Helping Students Learn With Confidence
            </h2>

            <p className="text-muted-foreground mx-auto mt-6 max-w-3xl leading-7">
               Thousands of students struggle with finding reliable tutors and managing class schedules efficiently. MediQueue simplifies the process by connecting learners with qualified tutors through a fast, organized, and user-friendly booking platform.
            </p>
         </div>
      </section>
   )
}