'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
   const router = useRouter()

   return (
      <section className="py-16">
         <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
               Ready To Start Learning?
            </h2>

            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
               Find experienced tutors, schedule your sessions, and improve your skills with a smarter learning experience.
            </p>

            <div className="mt-8">
               <Button
                  size="lg"
                  onClick={() => router.push('/tutors')}
               >
                  Browse Tutors
                  <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </div>
         </div>
      </section>
   )
}