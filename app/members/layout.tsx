'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MembersNavbar } from "@/components/members-navbar"

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mt-24">
        <main className="container mx-auto px-4 pt-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  )
} 