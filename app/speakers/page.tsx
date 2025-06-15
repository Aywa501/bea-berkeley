"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { DetailModal } from "@/components/detail-modal"

interface Speaker {
  id: string
  name: string
  title: string
  description: string
  imageUrl: string | null
}

export default function SpeakersPage() {
  const heroRef = useRef(null)
  const speakersRef = useRef(null)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isSpeakersInView = useInView(speakersRef, { once: true, amount: 0.1 })

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch("/api/speakers")
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setSpeakers(data.speakers || [])
      } catch (err) {
        console.error("Error fetching speakers:", err)
        setError(err instanceof Error ? err.message : "Failed to load speakers")
      } finally {
        setLoading(false)
      }
    }

    fetchSpeakers()
  }, [])

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }))
  }

  const openModal = (speaker: Speaker) => {
    setSelectedSpeaker(speaker)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSpeaker(null)
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gray-100 flex items-center justify-center">
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Past Speakers</h1>
        </div>
      </section>

      {/* Speakers Section */}
      <section ref={speakersRef} className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <p className="text-gray-600">Please try again later or contact the administrator.</p>
            </div>
          ) : speakers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No speakers found.</p>
            </div>
          ) : (
            <div className="space-y-24">
              {speakers.map((speaker, index) => (
                <div
                  key={speaker.id}
                  className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center`}
                >
                  <div className="w-full md:w-1/2 max-w-md">
                    <div className="relative aspect-square w-full bg-gray-200">
                      {imageError[index] ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                          <span className="text-lg font-medium">{speaker.name}</span>
                        </div>
                      ) : (
                        <Image
                          src={speaker.imageUrl || "/placeholder.svg?height=500&width=500"}
                          alt={speaker.name}
                          fill
                          className="object-cover object-center"
                          onError={() => handleImageError(index)}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <div className="text-gray-600 mb-1">{speaker.title}</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{speaker.name}</h2>
                    <p className="text-gray-700">{speaker.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedSpeaker && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedSpeaker.name}
          subtitle={selectedSpeaker.title}
          content={selectedSpeaker.description}
          image={selectedSpeaker.imageUrl || undefined}
        />
      )}
    </main>
  )
}

