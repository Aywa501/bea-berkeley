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
import { Edit, Save, X } from "lucide-react"

interface RecruitmentEvent {
  id: string
  title: string
  date: string
  description: string
  location?: string
}

interface EditableRecruitmentEvent extends RecruitmentEvent {
  isEditing?: boolean
  originalData?: RecruitmentEvent
}

export function RecruitmentPanel() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<EditableRecruitmentEvent[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    location: "",
  })

  useEffect(() => {
    console.log("Current session in RecruitmentPanel:", session)
    fetchEvents()
  }, [session])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/recruitment", {
        credentials: "include"
      })
      const data = await response.json()
      setEvents(data.events.map((event: RecruitmentEvent) => ({
        ...event,
        isEditing: false,
        originalData: event
      })))
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Failed to fetch recruitment events")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form with session:", session)

    try {
      const response = await fetch("/api/admin/recruitment", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create event")
      }

      toast.success("Recruitment event created successfully")
      setFormData({
        title: "",
        date: "",
        description: "",
        location: "",
      })
      fetchEvents()
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create recruitment event")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/recruitment?id=${id}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete event")
      }

      toast.success("Recruitment event deleted successfully")
      fetchEvents()
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete recruitment event")
    }
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    if (isEditMode) {
      // Exit edit mode - reset all editing states
      setEvents(events.map(event => ({
        ...event,
        isEditing: false,
        originalData: event.originalData || event
      })))
    }
  }

  const startEditing = (id: string) => {
    setEvents(events.map(event => ({
      ...event,
      isEditing: event.id === id,
      originalData: event.originalData || event
    })))
  }

  const cancelEditing = (id: string) => {
    setEvents(events.map(event => {
      if (event.id === id && event.originalData) {
        return {
          ...event.originalData,
          isEditing: false,
          originalData: event.originalData
        }
      }
      return event
    }))
  }

  const saveEditing = async (id: string) => {
    const event = events.find(e => e.id === id)
    if (!event) return

    try {
      const response = await fetch(`/api/admin/recruitment/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: event.title,
          date: event.date,
          description: event.description,
          location: event.location,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      toast.success("Recruitment event updated successfully")
      fetchEvents()
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error("Failed to update recruitment event")
    }
  }

  const updateEventField = (id: string, field: keyof RecruitmentEvent, value: string) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { ...event, [field]: value }
        : event
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <Button type="submit">Add Event</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Events</CardTitle>
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
                  <TableHead className="min-w-[150px]">Title</TableHead>
                  <TableHead className="min-w-[180px]">Date</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[150px]">Location</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className={event.isEditing ? "bg-blue-50" : ""}>
                    <TableCell className="min-w-[150px]">
                      {event.isEditing ? (
                        <div className="relative group">
                          <Input
                            value={event.title}
                            onChange={(e) => updateEventField(event.id, "title", e.target.value)}
                            className="w-full"
                          />
                          <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span>{event.title}</span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[180px]">
                      {event.isEditing ? (
                        <div className="relative group">
                          <Input
                            type="datetime-local"
                            value={event.date}
                            onChange={(e) => updateEventField(event.id, "date", e.target.value)}
                            className="w-full"
                          />
                          <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span>{new Date(event.date).toLocaleString()}</span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      {event.isEditing ? (
                        <div className="relative group">
                          <Textarea
                            value={event.description}
                            onChange={(e) => updateEventField(event.id, "description", e.target.value)}
                            className="w-full min-h-[60px]"
                          />
                          <Edit className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span className="text-sm max-w-[200px] block overflow-hidden text-ellipsis whitespace-nowrap">
                            {event.description}
                          </span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      {event.isEditing ? (
                        <div className="relative group">
                          <Input
                            value={event.location || ""}
                            onChange={(e) => updateEventField(event.id, "location", e.target.value)}
                            className="w-full"
                            placeholder="Location"
                          />
                          <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <span className="text-sm">{event.location || "—"}</span>
                          {isEditMode && (
                            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex gap-2">
                        {event.isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveEditing(event.id)}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelEditing(event.id)}
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
                                onClick={() => startEditing(event.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(event.id)}
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