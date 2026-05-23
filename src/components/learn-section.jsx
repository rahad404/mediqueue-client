'use client'

import {
   Calculator,
   Atom,
   FlaskConical,
   BookOpen,
   Languages,
   Code2,
   Briefcase,
   BarChart3,
   MonitorSmartphone,
   Globe2,
   GraduationCap,
   Laptop,
   Building2,
} from 'lucide-react'

const categories = [
   {
      title: 'Mathematics',
      icon: Calculator,
   },
   {
      title: 'Physics',
      icon: Atom,
   },
   {
      title: 'Chemistry',
      icon: FlaskConical,
   },
   {
      title: 'Biology',
      icon: BookOpen,
   },
   {
      title: 'English',
      icon: Languages,
   },
   {
      title: 'Programming',
      icon: Code2,
   },
   {
      title: 'IELTS Preparation',
      icon: Globe2,
   },
   {
      title: 'Higher Math',
      icon: GraduationCap,
   },
   {
      title: 'ICT',
      icon: MonitorSmartphone,
   },
   {
      title: 'Accounting',
      icon: BarChart3,
   },
   {
      title: 'Business Studies',
      icon: Briefcase,
   },
   {
      title: 'Statistics',
      icon: Calculator,
   },
]

const methods = [
   {
      title: 'Online Learning',
      icon: Laptop,
      description:
         'Join sessions from anywhere with flexible remote learning.',
   },
   {
      title: 'Offline Learning',
      icon: Building2,
      description:
         'Meet tutors physically for focused classroom sessions.',
   },
]

export default function LearningCategoriesSection() {
   return (
      <section className="bg-slate-50/50 py-16 dark:bg-zinc-900/40">
         <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* heading */}
            <div className="mx-auto mb-12 max-w-2xl text-center">
               <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Popular Learning Categories
               </h2>

               <p className="text-muted-foreground mt-3">
                  Discover tutors across academic and
                  skill-based subjects.
               </p>
            </div>

            {/* categories */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
               {categories.map(
                  ({
                     title,
                     icon: Icon,
                  }) => (
                     <div
                        key={title}
                        className="bg-card flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                     >
                        <div className="bg-primary/10 text-primary rounded-xl p-2">
                           <Icon className="h-5 w-5" />
                        </div>

                        <span className="font-medium">
                           {title}
                        </span>
                     </div>
                  )
               )}
            </div>

            {/* teaching methods */}
            <div className="mt-14 grid gap-6 md:grid-cols-2">
               {methods.map(
                  ({
                     title,
                     icon: Icon,
                     description,
                  }) => (
                     <div
                        key={title}
                        className="bg-card rounded-2xl border p-6 shadow-sm"
                     >
                        <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-xl p-3">
                           <Icon className="h-6 w-6" />
                        </div>

                        <h3 className="text-xl font-semibold">
                           {title}
                        </h3>

                        <p className="text-muted-foreground mt-2">
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