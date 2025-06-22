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
import Image from "next/image"
import { User, Edit, Save, X, Upload } from "lucide-react"
import { BulkUpload } from "./bulk-upload"

interface Speaker {
  id: string
  name: string
  title: string
  company: string
  description: string
  linkedin?: string
  imageUrl?: string
}

interface EditableSpeaker extends Speaker {
  isEditing?: boolean
  originalData?: Speaker
}

export function SpeakersPanel() {
  const { data: session } = useSession()
  const [speakers, setSpeakers] = useState<EditableSpeaker[]>([])
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    description: "",
    linkedin: "",
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
      setSpeakers(data.speakers.map((speaker: Speaker) => ({
        ...speaker,
        isEditing: false,
        originalData: speaker
      })))
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
        company: "",
        description: "",
        linkedin: "",
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
      })

      if (!response.ok) {
        throw new Error("Failed to delete speaker")
      }

      toast.success("Speaker deleted successfully")
      fetchSpeakers()
    } catch (error) {
      console.error("Error deleting speaker:", error)
      toast.error("Failed to delete speaker")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    if (isEditMode) {
      // Exit edit mode - reset all editing states
      setSpeakers(speakers.map(speaker => ({
        ...speaker,
        isEditing: false,
        originalData: speaker.originalData || speaker
      })))
    }
  }

  const startEditing = (id: string) => {
    setSpeakers(speakers.map(speaker => ({
      ...speaker,
      isEditing: speaker.id === id,
      originalData: speaker.originalData || speaker
    })))
  }

  const cancelEditing = (id: string) => {
    setSpeakers(speakers.map(speaker => {
      if (speaker.id === id && speaker.originalData) {
        return {
          ...speaker.originalData,
          isEditing: false,
          originalData: speaker.originalData
        }
      }
      return speaker
    }))
  }

  const saveEditing = async (id: string) => {
    const speaker = speakers.find(s => s.id === id)
    if (!speaker) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", speaker.name)
      formDataToSend.append("title", speaker.title)
      formDataToSend.append("company", speaker.company)
      formDataToSend.append("description", speaker.description)
      if (speaker.linkedin) formDataToSend.append("linkedin", speaker.linkedin)

      const response = await fetch(`/api/admin/speakers/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to update speaker")
      }

      toast.success("Speaker updated successfully")
      fetchSpeakers()
    } catch (error) {
      console.error("Error updating speaker:", error)
      toast.error("Failed to update speaker")
    }
  }

  const handleImageUpload = async (id: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch(`/api/admin/speakers/${id}/image`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update image")
      }

      const result = await response.json()
      
      // Update the speaker's imageUrl in the local state
      setSpeakers(speakers.map(speaker => 
        speaker.id === id 
          ? { ...speaker, imageUrl: result.imageUrl }
          : speaker
      ))

      toast.success("Image updated successfully")
    } catch (error) {
      console.error("Error updating image:", error)
      toast.error("Failed to update image")
    }
  }

  const updateSpeakerField = (id: string, field: keyof Speaker, value: string) => {
    setSpeakers(speakers.map(speaker => 
      speaker.id === id 
        ? { ...speaker, [field]: value }
        : speaker
    ))
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
            fields={["name", "title", "company", "description", "linkedin", "imageUrl"]}
            requiredFields={["name", "title", "company", "description"]}
            onSuccess={fetchSpeakers}
          />
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Required fields:</strong> name, title, company, description</p>
            <p><strong>Optional fields:</strong> linkedin, imageUrl</p>
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
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
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
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Speakers</CardTitle>
          <Button
            variant={isEditMode ? "destructive" : "outline"}
            onClick={toggleEditMode}
            size="sm"
          >
            {isEditMode ? "Exit Edit Mode" : "Edit Mode"}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[150px]">Title</TableHead>
                  <TableHead className="min-w-[150px]">Company</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[150px]">LinkedIn</TableHead>
                  <TableHead className="min-w-[128px]">Image</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {speakers.map((speaker) => (
                  <TableRow key={speaker.id} className={speaker.isEditing ? "bg-blue-50" : ""}>
                    <TableCell className="min-w-[150px]">
                      {speaker.isEditing ? (
                        <div className="relative group">
                          <Input
                            value={speaker.name}
                            onChange={(e) => updateSpeakerField(speaker.id, "name", e.target.value)}
                            className="w-full"
                          />
                          <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span>{speaker.name}</span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      {speaker.isEditing ? (
                        <div className="relative group">
                          <Input
                            value={speaker.title}
                            onChange={(e) => updateSpeakerField(speaker.id, "title", e.target.value)}
                            className="w-full"
                          />
                          <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span>{speaker.title}</span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      {speaker.isEditing ? (
                        <div className="relative group">
                          <Input
                            value={speaker.company}
                            onChange={(e) => updateSpeakerField(speaker.id, "company", e.target.value)}
                            className="w-full"
                          />
                          <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span>{speaker.company}</span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      {speaker.isEditing ? (
                        <div className="relative group">
                          <Textarea
                            value={speaker.description}
                            onChange={(e) => updateSpeakerField(speaker.id, "description", e.target.value)}
                            className="w-full min-h-[60px]"
                          />
                          <Edit className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span className="text-sm max-w-[200px] block overflow-hidden text-ellipsis whitespace-nowrap">
                            {speaker.description}
                          </span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      {speaker.isEditing ? (
                        <div className="relative group">
                          <Input
                            value={speaker.linkedin || ""}
                            onChange={(e) => updateSpeakerField(speaker.id, "linkedin", e.target.value)}
                            className="w-full"
                            placeholder="LinkedIn URL"
                          />
                          <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span className="text-sm text-blue-600 truncate max-w-[150px] block">
                            {speaker.linkedin || "—"}
                          </span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[128px]">
                      <div className="relative w-32 h-32 group">
                        {speaker.imageUrl ? (
                          <Image
                            src={speaker.imageUrl}
                            alt={speaker.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        {isEditMode && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <label className="cursor-pointer">
                              <Upload className="w-6 h-6 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageUpload(speaker.id, e.target.files[0])
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex gap-2">
                        {speaker.isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveEditing(speaker.id)}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelEditing(speaker.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            {isEditMode && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(speaker.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(speaker.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 