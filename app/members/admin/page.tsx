'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExecBoardPanel } from "@/components/admin/exec-board-panel"
import { SpeakersPanel } from "@/components/admin/speakers-panel"
import { RecruitmentPanel } from "@/components/admin/recruitment-panel"
import { FormsPanel } from "@/components/admin/forms-panel"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "ADMIN") {
    router.push("/members")
    return null
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
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
              <Link
                href="/members/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/members/admin") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Admin Panel
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              {session.user.name || session.user.email}
            </div>
          </nav>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Executive Board</CardTitle>
          </CardHeader>
          <CardContent>
            <ExecBoardPanel />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Speakers</CardTitle>
          </CardHeader>
          <CardContent>
            <SpeakersPanel />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recruitment Events</CardTitle>
          </CardHeader>
          <CardContent>
            <RecruitmentPanel />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recruitment Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <FormsPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 