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
    
    const response = NextResponse.json(forms)
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400')
    return response
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
    const { type, url } = body

    const form = await prisma.recruitmentForm.create({
      data: {
        title: type === "interest" ? "Interest Form" : "Application Form",
        description: type === "interest" ? "Interest Form for BEA" : "Application Form for BEA",
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Set deadline to 1 year from now
        link: url,
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