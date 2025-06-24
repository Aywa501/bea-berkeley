'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExecBoardPanel } from "@/components/admin/exec-board-panel"
import { SpeakersPanel } from "@/components/admin/speakers-panel"
import { RecruitmentPanel } from "@/components/admin/recruitment-panel"
import { FormsPanel } from "@/components/admin/forms-panel"
import { MembersNavbar } from "@/components/members-navbar"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "ADMIN") {
    router.push("/members")
    return null
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        </div>

        <MembersNavbar />

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
    </div>
  )
} 