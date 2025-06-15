'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MembersHomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Member Portal</h1>
      </div>

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
              {session.user.role === "ADMIN" && (
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
            <div className="text-sm text-muted-foreground">
              {session.user.name || session.user.email}
            </div>
          </nav>
        </div>
      </div>

      <div className="text-center text-muted-foreground">
        <p className="text-lg">TBA</p>
      </div>
    </div>
  )
} 