import { NextResponse } from "next/server"
import { fetchSheetData } from "@/lib/google-sheets"

export async function GET() {
  try {
    // Use the provided sheet ID
    const sheetId = "1sivhs2Dy3PGYWPZWZEuGWDjwiGl2uhOLo4nSxObKToo"

    // Fetch data from Google Sheets
    const execMembers = await fetchSheetData(sheetId)

    // Process the data to match our expected format
    const processedExecMembers = execMembers.map((member) => ({
      name: member.Name || "",
      position: member.Position || "",
      description: member.Description || "",
      linkedin: member.Linkedin || "",
      coffeeChat: member.Coffee_Chat || "",
      image: member.Img_Link || "",
    }))

    return NextResponse.json({ execMembers: processedExecMembers })
  } catch (error) {
    console.error("Error in exec-board API route:", error)
    // Ensure we return a proper JSON response even in case of error
    return NextResponse.json({ execMembers: [], error: "Failed to fetch exec board members" }, { status: 500 })
  }
}

