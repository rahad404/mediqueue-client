"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, BookUser } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ui/modetoggle"

export function Navbar() {
   const [isOpen, setIsOpen] = React.useState(false)

   const navLinks = [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
   ]

   return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container mx-auto flex h-16 items-center justify-between px-4">

            {/* Logo Section */}
            <Link href="/">
               <div className="flex items-center space-x-2 cursor-pointer">
                  <BookUser className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold tracking-tight text-foreground">
                     MediQueue
                  </span>
               </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
               {navLinks.map((link) => (
                  <a
                     key={link.label}
                     href={link.href}
                     className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                     {link.label}
                  </a>
               ))}
            </div>

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center space-x-3">
               <ModeToggle />
               <Link href="/login">
                  <Button variant="ghost">Log in</Button>
               </Link>
               <Link href="/signup">
                  <Button>Sign up</Button>
               </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle Menu"
               >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
               </Button>
            </div>
         </div>

         {/* Mobile Dropdown Panel */}
         {isOpen && (
            <div className="md:hidden border-b bg-background px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
               <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                     <Link key={link.label}
                        href={link.href}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
                        onClick={() => setIsOpen(false)}>
                        {link.label}
                     </Link>
                  ))}
               </div>
               <hr className="border-border" />
               <div className="flex flex-col space-y-2">
                  <ModeToggle />
                  <Link href="/login" className="w-full">
                     <Button variant="ghost" className="w-full justify-center">
                        Log in
                     </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                     <Button className="w-full justify-center">
                        Sign up
                     </Button>
                  </Link>
               </div>
            </div>
         )}
      </nav>
   )
}
