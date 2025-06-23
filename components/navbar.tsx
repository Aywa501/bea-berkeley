'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
      isScrolled ? "bg-background/80 backdrop-blur-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/join-us"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/join-us") ? "text-primary" : "text-foreground"
              }`}
            >
              Join Us
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-foreground"
              }`}
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/members"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/members") ? "text-primary" : "text-foreground"
                  }`}
                >
                  Member Portal
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="text-foreground"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button variant="default">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 