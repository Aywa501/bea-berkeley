import { put } from '@vercel/blob'

export async function downloadAndUploadImage(imageUrl: string, filename: string): Promise<string> {
  try {
    // Download the image from the URL
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to download image from ${imageUrl}: ${response.statusText}`)
    }

    // Get the image as a blob
    const imageBlob = await response.blob()
    
    // Convert blob to file-like object for Vercel Blob
    const file = new File([imageBlob], filename, { type: imageBlob.type })
    
    // Upload to Vercel Blob
    const blob = await put(`bulk-upload/${Date.now()}-${filename}`, file, {
      access: 'public',
    })

    return blob.url
  } catch (error) {
    console.error('Error downloading/uploading image:', error)
    throw new Error(`Failed to process image from ${imageUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 