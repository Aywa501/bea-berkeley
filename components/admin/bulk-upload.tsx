'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BulkUploadProps {
  endpoint: string
  fields: string[]
  requiredFields?: string[]
  onSuccess?: () => void
}

export function BulkUpload({ endpoint, fields, requiredFields = [], onSuccess }: BulkUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  
  // Generate unique ID based on endpoint
  const uniqueId = `bulk-upload-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`

  // Debug effect to log state changes
  useEffect(() => {
    console.log('previewData state changed:', previewData)
  }, [previewData])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('File selected:', file.name)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        console.log('Parsed data:', jsonData)

        // Normalize the data by mapping column names to expected field names
        const normalizedData = jsonData.map((item: any) => {
          const normalized: any = {}
          
          // Map common variations of column names to expected field names
          const fieldMappings: { [key: string]: string } = {
            // Name variations
            'name': 'name',
            'Name': 'name',
            'NAME': 'name',
            
            // Position variations
            'position': 'position',
            'Position': 'position',
            'POSITION': 'position',
            
            // Description variations
            'description': 'description',
            'Description': 'description',
            'DESCRIPTION': 'description',
            
            // Title variations
            'title': 'title',
            'Title': 'title',
            'TITLE': 'title',
            
            // LinkedIn variations
            'linkedin': 'linkedin',
            'Linkedin': 'linkedin',
            'LinkedIn': 'linkedin',
            'LINKEDIN': 'linkedin',
            
            // Coffee chat variations
            'coffeechat': 'coffeeChat',
            'coffee_chat': 'coffeeChat',
            'Coffee_Chat': 'coffeeChat',
            'Coffee Chat': 'coffeeChat',
            'COFFEE_CHAT': 'coffeeChat',
            'coffeeChat': 'coffeeChat',
            
            // Image URL variations
            'imageurl': 'imageUrl',
            'image_url': 'imageUrl',
            'ImageUrl': 'imageUrl',
            'Image_URL': 'imageUrl',
            'IMAGE_URL': 'imageUrl',
            'image': 'imageUrl',
            'Image': 'imageUrl',
            'IMAGE': 'imageUrl'
          }
          
          Object.keys(item).forEach(key => {
            // First try exact match
            if (fieldMappings[key]) {
              normalized[fieldMappings[key]] = item[key]
            } else {
              // Then try case-insensitive match
              const lowerKey = key.toLowerCase()
              const mappedKey = Object.keys(fieldMappings).find(mappingKey => 
                mappingKey.toLowerCase() === lowerKey
              )
              if (mappedKey) {
                normalized[fieldMappings[mappedKey]] = item[key]
              } else {
                // Fallback to lowercase
                normalized[key.toLowerCase()] = item[key]
              }
            }
          })
          
          return normalized
        })

        console.log('Normalized data:', normalizedData)

        // Validate required fields (case-insensitive)
        const requiredFieldNames = requiredFields.map((f: string) => f.toLowerCase())
        const availableFields = Object.keys(normalizedData[0] || {}).map((f: string) => f.toLowerCase())
        
        console.log('Required fields:', requiredFieldNames)
        console.log('Available fields:', availableFields)
        
        const missingFields = requiredFieldNames.filter((field: string) => 
          !availableFields.includes(field)
        )

        console.log('Missing fields:', missingFields)

        if (missingFields.length > 0) {
          console.log('Validation failed, showing error toast')
          toast.error(`Missing required fields: ${missingFields.join(', ')}`)
          return
        }

        console.log('Validation passed, about to set preview data')
        console.log('About to set preview data:', normalizedData.length, 'items')
        setPreviewData(normalizedData)
        console.log('Preview data set, should trigger re-render')
        toast.success(`Loaded ${normalizedData.length} items from file`)
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload data')
      }

      const result = await response.json()
      
      if (result.errors && result.errors.length > 0) {
        toast.error(`Upload completed with ${result.errors.length} errors. Check console for details.`)
        console.error('Upload errors:', result.errors)
      } else {
        toast.success(`Successfully uploaded ${result.created} items`)
      }
      
      setPreviewData(null)
      onSuccess?.()
    } catch (error) {
      console.error('Error uploading data:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload data')
    } finally {
      setIsUploading(false)
    }
  }

  const getConfirmText = () => {
    if (endpoint.includes("exec-board")) return "Add Member(s)"
    if (endpoint.includes("speakers")) return "Add Speaker(s)"
    return "Confirm Upload"
  }

  // Debug log
  console.log('Rendering bulk upload, previewData:', previewData, 'length:', previewData?.length)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id={uniqueId}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById(uniqueId)?.click()}
            disabled={isUploading}
          >
            Upload Table
          </Button>
        </div>

        {previewData && previewData.length > 0 && (
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

      {previewData && previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Data ({previewData.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {fields.map((field) => (
                      <TableHead key={field}>{field}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 5).map((item, index) => (
                    <TableRow key={index}>
                      {fields.map((field) => (
                        <TableCell key={field}>
                          {field.toLowerCase().includes('image') && item[field] ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">URL:</span>
                              <span className="text-xs truncate max-w-32">{item[field]}</span>
                            </div>
                          ) : (
                            <span className="text-sm">{String(item[field] || '')}</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {previewData.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={fields.length} className="text-center text-sm text-gray-500">
                        ... and {previewData.length - 5} more items
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 