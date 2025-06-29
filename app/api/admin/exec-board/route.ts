import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const execMembers = await prisma.execBoardMember.findMany({
      orderBy: {
        order: "asc",
      },
    })
    
    const response = NextResponse.json({ execMembers })
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
    return response
  } catch (error) {
    console.error("Error fetching exec board members:", error)
    return NextResponse.json(
      { error: "Failed to fetch executive board members" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in POST /api/admin/exec-board:", session)

    if (!session) {
      console.log("No session found")
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      )
    }

    if (session.user.role !== "ADMIN") {
      console.log("User is not admin:", session.user)
      return NextResponse.json(
        { error: "User is not admin" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const description = formData.get("description") as string
    const linkedin = formData.get("linkedin") as string
    const coffeeChat = formData.get("coffeeChat") as string
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    // Get the highest order value and add 1
    const lastMember = await prisma.execBoardMember.findFirst({
      orderBy: { order: 'desc' }
    })
    const newOrder = (lastMember?.order ?? -1) + 1

    // Upload image to Vercel Blob
    const blob = await put(`exec-board/${Date.now()}-${imageFile.name}`, imageFile, {
      access: 'public',
    })

    const execMember = await prisma.execBoardMember.create({
      data: {
        name,
        position,
        description,
        linkedin,
        coffeeChat,
        imageUrl: blob.url,
        order: newOrder,
      },
    })

    return NextResponse.json({ execMember })
  } catch (error) {
    console.error("Error creating exec board member:", error)
    return NextResponse.json(
      { error: "Failed to create executive board member" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      )
    }

    await prisma.execBoardMember.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting exec board member:", error)
    return NextResponse.json(
      { error: "Failed to delete executive board member" },
      { status: 500 }
    )
  }
} 