'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MembersNavbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <nav className="h-12 flex items-center justify-between">
          <div className="flex space-x-8">
            <Link
              href="/members"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/members") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            {session?.user.role === "ADMIN" && (
              <Link
                href="/members/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/members/admin") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Admin Panel
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {session?.user.name || session?.user.email}
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
} 