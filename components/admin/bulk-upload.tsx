'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface BulkUploadProps {
  endpoint: string
  fields: string[]
  requiredFields?: string[]
  onSuccess?: () => void
}

interface ValidationError {
  type: 'missing_fields' | 'empty_file' | 'invalid_format' | 'no_data'
  message: string
  details?: string[]
}

export function BulkUpload({ endpoint, fields, requiredFields = [], onSuccess }: BulkUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [validationError, setValidationError] = useState<ValidationError | null>(null)
  
  // Generate unique ID based on endpoint
  const uniqueId = `bulk-upload-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`

  // Debug effect to log state changes
  useEffect(() => {
    console.log('previewData state changed:', previewData)
  }, [previewData])

  const clearValidationError = () => {
    setValidationError(null)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('File selected:', file.name)
    clearValidationError()

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        console.log('Parsed data:', jsonData)

        // Check if file is empty
        if (!jsonData || jsonData.length === 0) {
          setValidationError({
            type: 'empty_file',
            message: 'The uploaded file contains no data.',
            details: ['Please make sure your Excel/CSV file has at least one row of data (excluding headers).']
          })
          return
        }

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
            
            // Company variations
            'company': 'company',
            'Company': 'company',
            'COMPANY': 'company',
            
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
          console.log('Validation failed, showing error')
          setValidationError({
            type: 'missing_fields',
            message: `Your table is missing ${missingFields.length} required field${missingFields.length > 1 ? 's' : ''}.`,
            details: [
              `Missing: ${missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}`,
              `Available columns: ${availableFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}`,
              'Make sure your Excel/CSV file has the correct column headers.',
              'Column names are case-insensitive and can include spaces or underscores.'
            ]
          })
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
      setValidationError({
        type: 'invalid_format',
        message: 'Unable to read the uploaded file.',
        details: [
          'Please make sure you\'re uploading a valid Excel (.xlsx, .xls) or CSV file.',
          'Check that the file is not corrupted or password-protected.',
          'Ensure the file contains data in the first sheet.'
        ]
      })
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
      clearValidationError()
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

  const getRequiredFieldsText = () => {
    if (requiredFields.length === 0) return "No required fields"
    return `Required: ${requiredFields.join(', ')}`
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
              onClick={() => {
                setPreviewData(null)
                clearValidationError()
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Validation Error Display */}
      {validationError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">{validationError.message}</p>
              {validationError.details && (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {validationError.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Field Requirements Info */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <p className="font-medium">Table Requirements</p>
            <p className="text-sm">{getRequiredFieldsText()}</p>
            <p className="text-sm">Optional: {fields.filter(f => !requiredFields.includes(f)).join(', ')}</p>
          </div>
        </AlertDescription>
      </Alert>

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
                      <TableHead key={field}>
                        {field}
                        {requiredFields.includes(field) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </TableHead>
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