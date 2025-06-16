import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    // Transform the data to include imageUrl
    const transformedSpeakers = speakers.map(speaker => ({
      ...speaker,
      imageUrl: speaker.image ? `/api/images/${speaker.id}` : null
    }))

    return NextResponse.json({ speakers: transformedSpeakers })
  } catch (error) {
    console.error("Error fetching speakers:", error)
    return NextResponse.json(
      { error: "Failed to fetch speakers" },
      { status: 500 }
    )
  }
}

