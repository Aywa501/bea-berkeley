import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"

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
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(image.name, image, {
      access: 'public',
    })

    // Update the database with the new image URL
    const updatedSpeaker = await prisma.speaker.update({
      where: { id: params.id },
      data: {
        imageUrl: blob.url,
      },
    })

    return NextResponse.json({ imageUrl: blob.url })
  } catch (error) {
    console.error("Error updating speaker image:", error)
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    )
  }
} 