import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: {
        createdAt: 'desc'
      }
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

