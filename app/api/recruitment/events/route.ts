import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const events = await prisma.recruitmentEvent.findMany({
      orderBy: {
        date: "asc",
      },
    })
    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })
  } catch (error) {
    console.error("Error fetching recruitment events:", error)
    return NextResponse.json(
      { error: "Failed to fetch recruitment events" },
      { status: 500 }
    )
  }
} 