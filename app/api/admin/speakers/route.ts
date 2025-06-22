import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    
    const response = NextResponse.json({ speakers })
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
    return response
  } catch (error) {
    console.error("Error fetching speakers:", error)
    return NextResponse.json(
      { error: "Failed to fetch speakers" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    // Upload image to Vercel Blob
    const blob = await put(`speakers/${Date.now()}-${imageFile.name}`, imageFile, {
      access: 'public',
    })

    const speaker = await prisma.speaker.create({
      data: {
        name,
        title,
        description,
        imageUrl: blob.url,
      },
    })

    return NextResponse.json({ speaker })
  } catch (error) {
    console.error("Error creating speaker:", error)
    return NextResponse.json(
      { error: "Failed to create speaker" },
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

    await prisma.speaker.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting speaker:", error)
    return NextResponse.json(
      { error: "Failed to delete speaker" },
      { status: 500 }
    )
  }
} 