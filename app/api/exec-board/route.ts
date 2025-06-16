import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const members = await prisma.execBoardMember.findMany({
      orderBy: {
        position: 'asc'
      }
    })

    // Transform the data to include imageUrl
    const transformedMembers = members.map(member => ({
      ...member,
      imageUrl: member.image ? `/api/images/${member.id}` : null
    }))

    return NextResponse.json({ execMembers: transformedMembers })
  } catch (error) {
    console.error("Error fetching executive board:", error)
    return NextResponse.json(
      { error: "Failed to fetch executive board members" },
      { status: 500 }
    )
  }
}

