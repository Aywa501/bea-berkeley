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

    const body = await request.json()
    const { title, date, description, location } = body

    if (!title || !date || !description) {
      return NextResponse.json(
        { error: "Title, date, and description are required" },
        { status: 400 }
      )
    }

    const updatedEvent = await prisma.recruitmentEvent.update({
      where: { id: params.id },
      data: {
        title,
        date: new Date(date),
        description,
        location: location || null,
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Error updating recruitment event:", error)
    return NextResponse.json(
      { error: "Failed to update recruitment event" },
      { status: 500 }
    )
  }
} 