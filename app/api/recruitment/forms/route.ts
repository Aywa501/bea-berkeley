import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const forms = await prisma.recruitmentForm.findMany({
      orderBy: {
        deadline: "asc",
      },
    })
    return NextResponse.json(forms)
  } catch (error) {
    console.error("Error fetching forms:", error)
    return NextResponse.json(
      { error: "Failed to fetch forms" },
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

    const body = await request.json()
    const { title, description, deadline, link } = body

    const form = await prisma.recruitmentForm.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        link,
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 }
    )
  }
} 