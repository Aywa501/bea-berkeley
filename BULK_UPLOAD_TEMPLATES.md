# Bulk Upload Templates

This document provides templates and instructions for bulk uploading data to the BEA admin panel.

## Executive Board Members Template

Create an Excel/CSV file with the following columns:

| name | position | description | linkedin | coffeeChat | imageUrl |
|------|----------|-------------|----------|------------|----------|
| John Doe | President | Leads the organization and oversees all operations | https://linkedin.com/in/johndoe | https://calendly.com/johndoe | https://example.com/john.jpg |
| Jane Smith | Vice President | Assists the president and manages internal affairs | https://linkedin.com/in/janesmith | | https://example.com/jane.jpg |

**Required fields:** name, position, description
**Optional fields:** linkedin, coffeeChat, imageUrl

## Speakers Template

Create an Excel/CSV file with the following columns:

| name | title | description | imageUrl |
|------|-------|-------------|----------|
| Dr. John Smith | Professor of Economics | Expert in behavioral economics with 20+ years of research experience | https://example.com/john.jpg |
| Jane Doe | Senior Researcher | Leading researcher in experimental economics | https://example.com/jane.jpg |

**Required fields:** name, title, description
**Optional fields:** imageUrl

## Image URL Requirements

- Must be a direct link to an image file (e.g., .jpg, .png, .gif)
- The URL should end with a file extension
- The image should be publicly accessible
- Recommended image size: 400x400 pixels or larger
- Supported formats: JPG, PNG, GIF, WebP

## Example Image URLs

- `https://example.com/photo.jpg`
- `https://images.unsplash.com/photo-1234567890`
- `https://cdn.example.com/profile.png`

## Instructions

1. Create an Excel or CSV file with the appropriate columns
2. Fill in the data according to the templates above
3. For images, provide direct URLs to image files
4. Save the file as .xlsx, .xls, or .csv
5. Use the "Upload Table" button in the admin panel
6. Review the preview data before confirming
7. Click "Add Member(s)" or "Add Speaker(s)" to upload

## Notes

- The system will automatically download images from the provided URLs and upload them to Vercel Blob storage
- If an image URL is invalid or inaccessible, that row will be skipped with an error message
- All other data will still be processed even if some images fail
- The bulk upload will show you how many items were successfully created and any errors that occurred 