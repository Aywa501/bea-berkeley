import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { downloadAndUploadImage } from "@/lib/image-utils"

const prisma = new PrismaClient()

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
    const { items } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      try {
        // Validate required fields
        if (!item.name || !item.title || !item.company || !item.description) {
          errors.push(`Row ${i + 1}: Missing required fields (name, title, company, description)`)
          continue
        }

        let imageUrl = null
        if (item.imageUrl) {
          try {
            // Download and upload image to Vercel Blob
            const filename = `${item.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.jpg`
            imageUrl = await downloadAndUploadImage(item.imageUrl, filename)
          } catch (imageError) {
            errors.push(`Row ${i + 1}: Failed to process image - ${imageError instanceof Error ? imageError.message : 'Unknown error'}`)
            continue
          }
        }

        // Create the speaker
        const speaker = await prisma.speaker.create({
          data: {
            name: item.name,
            title: item.title,
            company: item.company,
            description: item.description,
            imageUrl: imageUrl,
          },
        })

        results.push(speaker)
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error)
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      created: results.length,
      errors: errors.length > 0 ? errors : undefined,
      results: results
    })

  } catch (error) {
    console.error("Error in bulk upload:", error)
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 500 }
    )
  }
} 