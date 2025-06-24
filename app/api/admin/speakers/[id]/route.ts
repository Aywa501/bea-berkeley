import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const title = formData.get("title") as string
    const company = formData.get("company") as string
    const description = formData.get("description") as string
    const linkedin = formData.get("linkedin") as string || null

    if (!name || !title || !company || !description) {
      return NextResponse.json(
        { error: "Name, title, company, and description are required" },
        { status: 400 }
      )
    }

    const updatedSpeaker = await prisma.speaker.update({
      where: { id: params.id },
      data: {
        name,
        title,
        company,
        description,
        linkedin,
      },
    })

    return NextResponse.json(updatedSpeaker)
  } catch (error) {
    console.error("Error updating speaker:", error)
    return NextResponse.json(
      { error: "Failed to update speaker" },
      { status: 500 }
    )
  }
} 