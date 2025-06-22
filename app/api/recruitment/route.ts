import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const events = await prisma.recruitmentEvent.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    
    const response = NextResponse.json({ events })
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
    return response
  } catch (error) {
    console.error("Error fetching recruitment events:", error)
    return NextResponse.json(
      { error: "Failed to fetch recruitment events" },
      { status: 500 }
    )
  }
} 