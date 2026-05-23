import * as React from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapPin, FaPhone, FaEnvelope ,IoMdMail} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { BookUser } from "lucide-react";


export function Footer() {
  const currentYear = new Date().getFullYear();

  const servicesLinks = [
    { label: "Find a Tutor", href: "/tutor" },
    { label: "Become a Tutor", href: "/add-tutor" },
    { label: "Booked Sessions", href: "/my-booked-sessions" },
    { label: "Online Classes", href: "/classes" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full border-t bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand Column */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2 font-bold tracking-tight">
              <BookUser className="h-6 w-6 text-primary" />
              <span className="text-xl">MediQueue</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting eager learners with expert tutors for a streamlined, personalized educational experience.
            </p>
          </div>

          {/* Learning Services Column */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Tutor Services
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              {servicesLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Quick Links Column */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Support
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Column */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-sm font-medium text-muted-foreground">
              <li className="flex items-start space-x-2.5">
                <FaMapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FaPhone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+880123456789" className="transition-colors hover:text-foreground">
                  +880 1234-567890
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <FaEnvelope className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:support@mediqueue.com" className="transition-colors hover:text-foreground">
                  support@mediqueue.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <hr className="my-8 border-border" />

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} MediQueue. All rights reserved.
          </p>

          <div className="flex items-center space-x-2">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>

      </div>
    </footer>
  );
}
