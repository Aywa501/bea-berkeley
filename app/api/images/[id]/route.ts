import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const member = await prisma.execBoardMember.findUnique({
      where: { id },
      select: { image: true }
    })

    if (!member?.image) {
      return new NextResponse(null, { status: 404 })
    }

    const uint8Array = new Uint8Array(member.image)
    const blob = new Blob([uint8Array], { type: "image/jpeg" })
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return new NextResponse(null, { status: 500 })
  }
} 