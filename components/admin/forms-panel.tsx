'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Form {
  id: string
  type: string
  url: string
}

export function FormsPanel() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    interestFormUrl: "",
    applicationFormUrl: "",
  })

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/recruitment/forms")
      if (!response.ok) throw new Error("Failed to fetch forms")
      const data = await response.json()
      setForms(data)
      
      // Set form URLs from fetched data
      const interestForm = data.find((form: Form) => form.type === "interest")
      const applicationForm = data.find((form: Form) => form.type === "application")
      
      setFormData({
        interestFormUrl: interestForm?.url || "",
        applicationFormUrl: applicationForm?.url || "",
      })
    } catch (error) {
      console.error("Error fetching forms:", error)
      toast.error("Failed to load forms")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Update or create interest form
      if (formData.interestFormUrl) {
        const interestForm = forms.find(form => form.type === "interest")
        if (interestForm) {
          await fetch(`/api/recruitment/forms/${interestForm.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: formData.interestFormUrl }),
          })
        } else {
          await fetch("/api/recruitment/forms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "interest",
              url: formData.interestFormUrl,
            }),
          })
        }
      }

      // Update or create application form
      if (formData.applicationFormUrl) {
        const applicationForm = forms.find(form => form.type === "application")
        if (applicationForm) {
          await fetch(`/api/recruitment/forms/${applicationForm.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: formData.applicationFormUrl }),
          })
        } else {
          await fetch("/api/recruitment/forms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "application",
              url: formData.applicationFormUrl,
            }),
          })
        }
      }

      toast.success("Forms updated successfully")
      fetchForms()
    } catch (error) {
      console.error("Error updating forms:", error)
      toast.error("Failed to update forms")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interestFormUrl">Interest Form URL</Label>
              <Input
                id="interestFormUrl"
                type="url"
                value={formData.interestFormUrl}
                onChange={(e) =>
                  setFormData({ ...formData, interestFormUrl: e.target.value })
                }
                placeholder="https://forms.google.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationFormUrl">Application Form URL</Label>
              <Input
                id="applicationFormUrl"
                type="url"
                value={formData.applicationFormUrl}
                onChange={(e) =>
                  setFormData({ ...formData, applicationFormUrl: e.target.value })
                }
                placeholder="https://forms.google.com/..."
              />
            </div>
            <Button type="submit">Update Forms</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Forms</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="capitalize">{form.type}</TableCell>
                  <TableCell>
                    <a 
                      href={form.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block max-w-md"
                    >
                      {form.url}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 