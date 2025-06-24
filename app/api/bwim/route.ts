import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEntry = await prisma.bWIM.findFirst({
      where: { email: email.toLowerCase() }
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      )
    }

    // Create new BWIM entry
    const bwimEntry = await prisma.bWIM.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: "Successfully subscribed to BWIM updates",
      id: bwimEntry.id 
    })
  } catch (error) {
    console.error("Error creating BWIM entry:", error)
    return NextResponse.json(
      { error: "Failed to submit form. Please try again." },
      { status: 500 }
    )
  }
} 