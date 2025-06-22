import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const members = await prisma.execBoardMember.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    // Transform the data to include imageUrl (now directly from the database)
    const transformedMembers = members.map(member => ({
      ...member,
      imageUrl: member.imageUrl
    }))

    const response = NextResponse.json({ execMembers: transformedMembers })
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
    return response
  } catch (error) {
    console.error("Error fetching executive board:", error)
    return NextResponse.json(
      { error: "Failed to fetch executive board members" },
      { status: 500 }
    )
  }
}

