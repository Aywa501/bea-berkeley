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
import { User } from "lucide-react"
import { BulkUpload } from "./bulk-upload"

interface ExecBoardMember {
  id: string
  name: string
  position: string
  description: string
  linkedin?: string
  coffeeChat?: string
  imageUrl?: string
}

export function ExecBoardPanel() {
  const { data: session } = useSession()
  const [members, setMembers] = useState<ExecBoardMember[]>([])
  const [selectedMember, setSelectedMember] = useState<ExecBoardMember | null>(null)
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
      setMembers(data.execMembers)
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
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.description}</TableCell>
                  <TableCell>
                    <div className="relative w-32 h-32">
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
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