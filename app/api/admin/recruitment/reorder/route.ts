import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    // Update the order of all items
    const updates = items.map((item: any, index: number) => 
      prisma.recruitmentEvent.update({
        where: { id: item.id },
        data: { order: index }
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json({ success: true, updated: items.length })
  } catch (error) {
    console.error("Error reordering recruitment events:", error)
    return NextResponse.json(
      { error: "Failed to reorder events" },
      { status: 500 }
    )
  }
} 