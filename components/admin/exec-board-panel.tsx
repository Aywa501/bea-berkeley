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
import { SortableTable } from "@/components/ui/sortable-table"

interface ExecBoardMember {
  id: string
  name: string
  position: string
  description: string
  linkedin?: string
  coffeeChat?: string
  imageUrl?: string
  order?: number
}

interface EditableExecBoardMember extends ExecBoardMember {
  isEditing?: boolean
  originalData?: ExecBoardMember
}

export function ExecBoardPanel() {
  const { data: session } = useSession()
  const [members, setMembers] = useState<EditableExecBoardMember[]>([])
  const [selectedMember, setSelectedMember] = useState<ExecBoardMember | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    linkedin: "",
    coffeeChat: "",
    image: null as File | null,
  })

  useEffect(() => {
    console.log("Current session in ExecBoardPanel:", session)
    fetchMembers()
  }, [session])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/admin/exec-board", {
        credentials: "include"
      })
      const data = await response.json()
      setMembers(data.execMembers.map((member: ExecBoardMember) => ({
        ...member,
        isEditing: false,
        originalData: member
      })))
    } catch (error) {
      console.error("Error fetching members:", error)
      toast.error("Failed to fetch executive board members")
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
      const response = await fetch("/api/admin/exec-board", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create member")
      }

      toast.success("Executive board member created successfully")
      setFormData({
        name: "",
        position: "",
        description: "",
        linkedin: "",
        coffeeChat: "",
        image: null,
      })
      fetchMembers()
    } catch (error) {
      console.error("Error creating member:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create executive board member")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/exec-board?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete member")
      }

      toast.success("Executive board member deleted successfully")
      fetchMembers()
    } catch (error) {
      console.error("Error deleting member:", error)
      toast.error("Failed to delete executive board member")
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
      setMembers(members.map(member => ({
        ...member,
        isEditing: false,
        originalData: member.originalData || member
      })))
    }
  }

  const startEditing = (id: string) => {
    setMembers(members.map(member => ({
      ...member,
      isEditing: member.id === id,
      originalData: member.originalData || member
    })))
  }

  const cancelEditing = (id: string) => {
    setMembers(members.map(member => {
      if (member.id === id && member.originalData) {
        return {
          ...member.originalData,
          isEditing: false,
          originalData: member.originalData
        }
      }
      return member
    }))
  }

  const saveEditing = async (id: string) => {
    const member = members.find(m => m.id === id)
    if (!member) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", member.name)
      formDataToSend.append("position", member.position)
      formDataToSend.append("description", member.description)
      if (member.linkedin) formDataToSend.append("linkedin", member.linkedin)
      if (member.coffeeChat) formDataToSend.append("coffeeChat", member.coffeeChat)

      const response = await fetch(`/api/admin/exec-board/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to update member")
      }

      toast.success("Executive board member updated successfully")
      fetchMembers()
    } catch (error) {
      console.error("Error updating member:", error)
      toast.error("Failed to update executive board member")
    }
  }

  const handleImageUpload = async (id: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch(`/api/admin/exec-board/${id}/image`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update image")
      }

      const result = await response.json()
      
      // Update the member's imageUrl in the local state
      setMembers(members.map(member => 
        member.id === id 
          ? { ...member, imageUrl: result.imageUrl }
          : member
      ))

      toast.success("Image updated successfully")
    } catch (error) {
      console.error("Error updating image:", error)
      toast.error("Failed to update image")
    }
  }

  const updateMemberField = (id: string, field: keyof ExecBoardMember, value: string) => {
    setMembers(members.map(member => 
      member.id === id 
        ? { ...member, [field]: value }
        : member
    ))
  }

  const handleReorder = async (newOrder: EditableExecBoardMember[]) => {
    setMembers(newOrder)
    
    try {
      const response = await fetch("/api/admin/exec-board/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: newOrder }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder members")
      }

      toast.success("Order updated successfully")
    } catch (error) {
      console.error("Error reordering members:", error)
      toast.error("Failed to update order")
      // Revert to original order
      fetchMembers()
    }
  }

  const renderHeaders = () => (
    <>
      <TableHead className="min-w-[150px]">Name</TableHead>
      <TableHead className="min-w-[150px]">Position</TableHead>
      <TableHead className="min-w-[200px]">Description</TableHead>
      <TableHead className="min-w-[150px]">LinkedIn</TableHead>
      <TableHead className="min-w-[150px]">Coffee Chat</TableHead>
      <TableHead className="min-w-[128px]">Image</TableHead>
      <TableHead className="min-w-[120px]">Actions</TableHead>
    </>
  )

  const renderRow = (member: EditableExecBoardMember) => (
    <>
      <TableCell className="min-w-[150px]">
        {member.isEditing ? (
          <div className="relative group">
            <Input
              value={member.name}
              onChange={(e) => updateMemberField(member.id, "name", e.target.value)}
              className="w-full"
            />
            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="relative group">
            <span>{member.name}</span>
            {isEditMode && (
              <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[150px]">
        {member.isEditing ? (
          <div className="relative group">
            <Input
              value={member.position}
              onChange={(e) => updateMemberField(member.id, "position", e.target.value)}
              className="w-full"
            />
            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="relative group">
            <span>{member.position}</span>
            {isEditMode && (
              <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[200px]">
        {member.isEditing ? (
          <div className="relative group">
            <Textarea
              value={member.description}
              onChange={(e) => updateMemberField(member.id, "description", e.target.value)}
              className="w-full min-h-[60px]"
            />
            <Edit className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="relative group">
            <span className="text-sm max-w-[200px] block overflow-hidden text-ellipsis whitespace-nowrap">
              {member.description}
            </span>
            {isEditMode && (
              <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[150px]">
        {member.isEditing ? (
          <div className="relative group">
            <Input
              value={member.linkedin || ""}
              onChange={(e) => updateMemberField(member.id, "linkedin", e.target.value)}
              className="w-full"
              placeholder="LinkedIn URL"
            />
            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="relative group">
            <span className="text-sm text-blue-600 truncate max-w-[150px] block">
              {member.linkedin || "—"}
            </span>
            {isEditMode && (
              <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[150px]">
        {member.isEditing ? (
          <div className="relative group">
            <Input
              value={member.coffeeChat || ""}
              onChange={(e) => updateMemberField(member.id, "coffeeChat", e.target.value)}
              className="w-full"
              placeholder="Coffee Chat URL"
            />
            <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="relative group">
            <span className="text-sm text-blue-600 truncate max-w-[150px] block">
              {member.coffeeChat || "—"}
            </span>
            {isEditMode && (
              <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[128px]">
        <div className="relative w-32 h-32 group">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
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
                      handleImageUpload(member.id, e.target.files[0])
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
          {member.isEditing ? (
            <>
              <Button
                size="sm"
                onClick={() => saveEditing(member.id)}
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cancelEditing(member.id)}
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
                  onClick={() => startEditing(member.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(member.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <BulkUpload
            endpoint="/api/admin/exec-board/bulk"
            fields={["name", "position", "description", "linkedin", "coffeeChat", "imageUrl"]}
            requiredFields={["name", "position", "description"]}
            onSuccess={fetchMembers}
          />
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Required fields:</strong> name, position, description</p>
            <p><strong>Optional fields:</strong> linkedin, coffeeChat, imageUrl</p>
            <p><strong>Image URL:</strong> Provide a direct link to an image (e.g., https://example.com/image.jpg)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Single Member</CardTitle>
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
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coffeeChat">Coffee Chat URL</Label>
                <Input
                  id="coffeeChat"
                  value={formData.coffeeChat}
                  onChange={(e) => setFormData({ ...formData, coffeeChat: e.target.value })}
                />
              </div>
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
            <Button type="submit">Add Member</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Members</CardTitle>
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
            <SortableTable
              items={members}
              onReorder={handleReorder}
              renderHeaders={renderHeaders}
              renderRow={renderRow}
              disabled={!isEditMode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 