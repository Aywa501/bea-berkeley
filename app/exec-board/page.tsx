"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { DetailModal } from "@/components/detail-modal"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
import { CoffeeIcon } from "@/components/icons/coffee-icon"

interface ExecMember {
  id: string
  name: string
  position: string
  description: string
  linkedin: string | null
  coffeeChat: string | null
  imageUrl: string | null
}

export default function ExecBoardPage() {
  const [execMembers, setExecMembers] = useState<ExecMember[]>([])
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<ExecMember | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchExecBoard = async () => {
      try {
        const response = await fetch("/api/exec-board")
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setExecMembers(data.execMembers || [])
      } catch (err) {
        console.error("Error fetching executive board:", err)
        setError(err instanceof Error ? err.message : "Failed to load executive board")
      } finally {
        setLoading(false)
      }
    }

    fetchExecBoard()
  }, [])

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }))
  }

  const openModal = (member: ExecMember) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMember(null)
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="py-20 bg-gray-100 flex items-center justify-center">
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Executive Board</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our executive board oversees the internal and external aspects of BEA, as well as ensuring professional
            success.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <p className="text-gray-600">Please try again later or contact the administrator.</p>
            </div>
          ) : execMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No executive board members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {execMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-square relative bg-gray-100">
                    {imageError[index] ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                        <span className="text-lg font-medium">{member.name}</span>
                      </div>
                    ) : (
                      <Image
                        src={member.imageUrl || "/placeholder.svg?height=400&width=400"}
                        alt={member.name}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={() => handleImageError(index)}
                      />
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-medium text-blue-700 mb-1">{member.position}</h3>
                      <h2 className="text-xl font-bold">{member.name}</h2>
                    </div>

                    <div className="text-sm text-gray-600 mb-4 line-clamp-2 h-10 overflow-hidden">
                      {member.description}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {member.coffeeChat && (
                          <a
                            href={member.coffeeChat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-900 hover:text-blue-700 transition-colors"
                            aria-label={`Schedule a coffee chat with ${member.name}`}
                          >
                            <CoffeeIcon className="w-6 h-6" />
                          </a>
                        )}

                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-900 hover:text-blue-700 transition-colors"
                            aria-label={`${member.name}'s LinkedIn profile`}
                          >
                            <LinkedInIcon className="w-6 h-6" />
                          </a>
                        )}
                      </div>

                      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => openModal(member)}>
                        Read more
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedMember && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedMember.name}
          subtitle={selectedMember.position}
          content={selectedMember.description}
          image={selectedMember.imageUrl || undefined}
          links={{
            linkedin: selectedMember.linkedin || undefined,
            coffeeChat: selectedMember.coffeeChat || undefined,
          }}
        />
      )}
    </main>
  )
}

