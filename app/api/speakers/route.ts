import { NextResponse } from "next/server"
import { fetchSheetData } from "@/lib/google-sheets"

export async function GET() {
  try {
    // Use the provided sheet ID
    const sheetId = "1Ta_U3ws1syRAVNkBeqjJ6Q40O82XgOEUdt6NfTXTlA8"

    // Fetch data from Google Sheets
    const speakers = await fetchSheetData(sheetId)

    // Process the data to match our expected format
    const processedSpeakers = speakers.map((speaker) => ({
      name: speaker.Name || "",
      title: speaker.Position || "",
      description: speaker.Description || "",
      image: speaker.Img_Link || "",
    }))

    return NextResponse.json({ speakers: processedSpeakers })
  } catch (error) {
    console.error("Error in speakers API route:", error)
    // Ensure we return a proper JSON response even in case of error
    return NextResponse.json({ speakers: [], error: "Failed to fetch speakers" }, { status: 500 })
  }
}

