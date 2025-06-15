import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json({ speakers })
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

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    const speaker = await prisma.speaker.create({
      data: {
        name,
        title,
        description,
        image: imageBuffer,
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