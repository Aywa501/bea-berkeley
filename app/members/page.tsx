'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MembersNavbar } from "@/components/members-navbar"

export default function MembersHomePage() {
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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Member Portal</h1>
      </div>

      <MembersNavbar />

      <div className="text-center text-muted-foreground">
        <p className="text-lg">TBA</p>
      </div>
    </div>
  )
} 