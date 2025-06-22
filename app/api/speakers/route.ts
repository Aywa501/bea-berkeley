import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    // Transform the data to include imageUrl (now directly from the database)
    const transformedSpeakers = speakers.map(speaker => ({
      ...speaker,
      imageUrl: speaker.imageUrl
    }))

    const response = NextResponse.json({ speakers: transformedSpeakers })
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

