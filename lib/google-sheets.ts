import { parse } from "papaparse"

// Function to fetch data from a public Google Sheet
export async function fetchSheetData(sheetId: string, gid = "0") {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`)
    }

    const csv = await response.text()

    const { data, errors } = parse(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
    })

    if (errors.length > 0) {
      console.warn("CSV Parse Errors:", errors)
    }

    // Filter out rows where all fields are empty
    const rows = (data as Record<string, string>[]).filter((row) => Object.values(row).some((value) => value !== ""))

    return rows
  } catch (error) {
    console.error("Error fetching or parsing Google Sheet:", error)
    return []
  }
}

