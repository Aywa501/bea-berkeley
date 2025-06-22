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

    const formData = await request.formData()
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const description = formData.get("description") as string
    const linkedin = formData.get("linkedin") as string || null
    const coffeeChat = formData.get("coffeeChat") as string || null

    if (!name || !position || !description) {
      return NextResponse.json(
        { error: "Name, position, and description are required" },
        { status: 400 }
      )
    }

    const updatedMember = await prisma.execBoardMember.update({
      where: { id: params.id },
      data: {
        name,
        position,
        description,
        linkedin,
        coffeeChat,
      },
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Error updating exec board member:", error)
    return NextResponse.json(
      { error: "Failed to update executive board member" },
      { status: 500 }
    )
  }
} 