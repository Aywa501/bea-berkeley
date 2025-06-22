'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { BulkUpload } from "./bulk-upload"

interface Speaker {
  id: string
  name: string
  title: string
  description: string
  imageUrl?: string
}

export function SpeakersPanel() {
  const { data: session } = useSession()
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    image: null as File | null,
  })

  useEffect(() => {
    console.log("Current session in SpeakersPanel:", session)
    fetchSpeakers()
  }, [session])

  const fetchSpeakers = async () => {
    try {
      const response = await fetch("/api/admin/speakers", {
        credentials: "include"
      })
      const data = await response.json()
      setSpeakers(data.speakers)
    } catch (error) {
      console.error("Error fetching speakers:", error)
      toast.error("Failed to fetch speakers")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form with session:", session)
    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value)
      }
    })

    try {
      const response = await fetch("/api/admin/speakers", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create speaker")
      }

      toast.success("Speaker created successfully")
      setFormData({
        name: "",
        title: "",
        description: "",
        image: null,
      })
      fetchSpeakers()
    } catch (error) {
      console.error("Error creating speaker:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create speaker")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/speakers?id=${id}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete speaker")
      }

      toast.success("Speaker deleted successfully")
      fetchSpeakers()
    } catch (error) {
      console.error("Error deleting speaker:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete speaker")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <BulkUpload
            endpoint="/api/admin/speakers/bulk"
            fields={["name", "title", "description", "imageUrl"]}
            requiredFields={["name", "title", "description"]}
            onSuccess={fetchSpeakers}
          />
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Required fields:</strong> name, title, description</p>
            <p><strong>Optional fields:</strong> imageUrl</p>
            <p><strong>Image URL:</strong> Provide a direct link to an image (e.g., https://example.com/image.jpg)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Single Speaker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
            <Button type="submit">Add Speaker</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Speakers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {speakers.map((speaker) => (
                <TableRow key={speaker.id}>
                  <TableCell>{speaker.name}</TableCell>
                  <TableCell>{speaker.title}</TableCell>
                  <TableCell>{speaker.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(speaker.id)}
                    >
                      Delete
                    </Button>
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