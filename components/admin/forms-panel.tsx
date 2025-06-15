'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

interface Form {
  id: string
  title: string
  description: string
  deadline: string
  link: string
  createdAt: string
  updatedAt: string
}

export function FormsPanel() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    deadline: "",
    link: "",
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
      const response = await fetch("/api/recruitment/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newForm),
      })

      if (!response.ok) throw new Error("Failed to create form")

      toast.success("Form created successfully")
      setNewForm({
        title: "",
        description: "",
        deadline: "",
        link: "",
      })
      fetchForms()
    } catch (error) {
      console.error("Error creating form:", error)
      toast.error("Failed to create form")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return

    try {
      const response = await fetch(`/api/recruitment/forms/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete form")

      toast.success("Form deleted successfully")
      fetchForms()
    } catch (error) {
      console.error("Error deleting form:", error)
      toast.error("Failed to delete form")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={newForm.title}
              onChange={(e) =>
                setNewForm({ ...newForm, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium">
              Deadline
            </label>
            <Input
              id="deadline"
              type="datetime-local"
              value={newForm.deadline}
              onChange={(e) =>
                setNewForm({ ...newForm, deadline: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={newForm.description}
            onChange={(e) =>
              setNewForm({ ...newForm, description: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="link" className="text-sm font-medium">
            Form Link
          </label>
          <Input
            id="link"
            type="url"
            value={newForm.link}
            onChange={(e) => setNewForm({ ...newForm, link: e.target.value })}
            required
          />
        </div>
        <Button type="submit">Add Form</Button>
      </form>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.title}</TableCell>
                <TableCell>{form.description}</TableCell>
                <TableCell>
                  {new Date(form.deadline).toLocaleString()}
                </TableCell>
                <TableCell>
                  <a
                    href={form.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open Form
                  </a>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(form.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 