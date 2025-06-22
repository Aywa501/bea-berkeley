'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

interface BulkUploadProps {
  endpoint: string
  fields: string[]
  onSuccess?: () => void
}

export function BulkUpload({ endpoint, fields, onSuccess }: BulkUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewData, setPreviewData] = useState<any[] | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Validate required fields
        const missingFields = fields.filter(field => 
          !jsonData[0] || typeof jsonData[0] !== 'object' || !(field in (jsonData[0] as object))
        )

        if (missingFields.length > 0) {
          toast.error(`Missing required fields: ${missingFields.join(', ')}`)
          return
        }

        setPreviewData(jsonData)
      }
      reader.readAsBinaryString(file)
    } catch (error) {
      console.error('Error reading file:', error)
      toast.error('Error reading file. Please make sure it\'s a valid Excel or CSV file.')
    }
  }

  const handleConfirm = async () => {
    if (!previewData) return

    setIsUploading(true)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: previewData }),
      })

      if (!response.ok) {
        throw new Error('Failed to upload data')
      }

      toast.success('Data uploaded successfully')
      setPreviewData(null)
      onSuccess?.()
    } catch (error) {
      console.error('Error uploading data:', error)
      toast.error('Failed to upload data')
    } finally {
      setIsUploading(false)
    }
  }

  const getConfirmText = () => {
    if (endpoint.includes("exec-board")) return "Add Member(s)"
    if (endpoint.includes("speakers")) return "Add Speaker(s)"
    return "Confirm Upload"
  }

  return (
    <div className="flex items-center gap-4">
      <div>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          id="bulk-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('bulk-upload')?.click()}
          disabled={isUploading}
        >
          Upload Table
        </Button>
      </div>

      {previewData && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {previewData.length} items ready to upload
          </span>
          <Button
            onClick={handleConfirm}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : getConfirmText()}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setPreviewData(null)}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
} 