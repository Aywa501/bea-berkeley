import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const members = await prisma.execBoardMember.findMany({
      orderBy: {
        position: 'asc'
      }
    })
    return NextResponse.json({ execMembers: members })
  } catch (error) {
    console.error("Error fetching executive board:", error)
    return NextResponse.json(
      { error: "Failed to fetch executive board members" },
      { status: 500 }
    )
  }
}

