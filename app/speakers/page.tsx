import Image from "next/image"
import { prisma } from "@/lib/prisma"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Speaker {
  id: string
  name: string
  title: string
  company: string
  description: string
  linkedin: string | null
  imageUrl: string | null
}

async function getSpeakers(): Promise<Speaker[]> {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    // Transform the data to include imageUrl
    const transformedSpeakers = speakers.map(speaker => ({
      ...speaker,
      imageUrl: speaker.imageUrl
    }))

    return transformedSpeakers
  } catch (error) {
    console.error("Error fetching speakers:", error)
    return []
  }
}

export default async function SpeakersPage() {
  const speakers = await getSpeakers()

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gray-100 flex items-center justify-center">
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Past Speakers</h1>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {speakers.length === 0 ? (
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
                      <Image
                        src={speaker.imageUrl || "/placeholder.svg?height=500&width=500"}
                        alt={speaker.name}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <div className="text-gray-600 mb-1">{speaker.title}</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{speaker.name}</h2>
                    <div className="text-gray-600 mb-2">{speaker.company}</div>
                    <p className="text-gray-700">{speaker.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

