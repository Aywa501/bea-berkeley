import { NextResponse } from "next/server"
import { fetchSheetData } from "@/lib/google-sheets"

export async function GET() {
  try {
    // Use the provided sheet ID
    const sheetId = "1m7aCIzbDoqZZ0i8HppuIyIEIdtr5zbbKbFp3u8xLzQ0"

    // Fetch data from Google Sheets
    const data = await fetchSheetData(sheetId)

    // Extract the links from the first row
    const links = {
      application: data[0]?.Application || "",
      interest: data[0]?.Interest || "",
    }

    return NextResponse.json(links)
  } catch (error) {
    console.error("Error in join links API route:", error)
    return NextResponse.json({ application: "", interest: "", error: "Failed to fetch join links" }, { status: 500 })
  }
}

