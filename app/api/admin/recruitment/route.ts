import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const events = await prisma.recruitmentEvent.findMany({
      orderBy: {
        date: "asc",
      },
    })
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching recruitment events:", error)
    return NextResponse.json(
      { error: "Failed to fetch recruitment events" },
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

    const data = await request.json()
    const { title, date, description, location } = data

    const event = await prisma.recruitmentEvent.create({
      data: {
        title,
        date: new Date(date),
        description,
        location,
      },
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error("Error creating recruitment event:", error)
    return NextResponse.json(
      { error: "Failed to create recruitment event" },
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

    await prisma.recruitmentEvent.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recruitment event:", error)
    return NextResponse.json(
      { error: "Failed to delete recruitment event" },
      { status: 500 }
    )
  }
} 