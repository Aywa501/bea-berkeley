import { NextResponse } from "next/server"
import { fetchSheetData } from "@/lib/google-sheets"

export async function GET() {
  try {
    // Use the provided sheet ID
    const sheetId = "1wCxCsw3X0UIF4CeGJz7IH7wwuErMRD1HLsJkXUkjpsA"

    // Fetch data from Google Sheets
    const events = await fetchSheetData(sheetId)

    // Process the data to match our expected format
    const processedEvents = events.map((event) => ({
      title: event.Event_Title || "",
      date: event.Date || "",
      time: event.Time || "",
      location: event.Location || "",
    }))

    return NextResponse.json({ events: processedEvents })
  } catch (error) {
    console.error("Error in timeline API route:", error)
    return NextResponse.json({ events: [], error: "Failed to fetch timeline events" }, { status: 500 })
  }
}

