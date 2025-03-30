"use client"

import { useState, useEffect } from "react"

interface JoinLinks {
  application: string
  interest: string
}

interface TimelineEvent {
  title: string
  date: string
  time: string
  location: string
}

export default function JoinUsClientPage() {
  const [links, setLinks] = useState<JoinLinks>({ application: "", interest: "" })
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJoinLinks = async () => {
      try {
        const cacheKey = "join_links"
        const cacheExpiryKey = "join_links_expiry"
        const now = Date.now()
        const expiry = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

        const cachedData = localStorage.getItem(cacheKey)
        const cachedExpiry = localStorage.getItem(cacheExpiryKey)

        if (cachedData && cachedExpiry && now < Number(cachedExpiry)) {
          // Use cached data
          setLinks(JSON.parse(cachedData))
        } else {
          // Fetch fresh data
          const response = await fetch("/api/join-links")

          if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          setLinks({
            application: data.application || "",
            interest: data.interest || "",
          })

          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              application: data.application || "",
              interest: data.interest || "",
            }),
          )
          localStorage.setItem(cacheExpiryKey, String(now + expiry))
        }
      } catch (err) {
        console.error("Error fetching join links:", err)
        setError(err instanceof Error ? err.message : "Failed to load join links")
      }
    }

    const fetchTimelineEvents = async () => {
      try {
        const cacheKey = "timeline_events"
        const cacheExpiryKey = "timeline_events_expiry"
        const now = Date.now()
        const expiry = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

        const cachedData = localStorage.getItem(cacheKey)
        const cachedExpiry = localStorage.getItem(cacheExpiryKey)

        if (cachedData && cachedExpiry && now < Number(cachedExpiry)) {
          // Use cached data
          setEvents(JSON.parse(cachedData))
        } else {
          // Fetch fresh data
          const response = await fetch("/api/timeline")

          if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          setEvents(data.events || [])
          localStorage.setItem(cacheKey, JSON.stringify(data.events || []))
          localStorage.setItem(cacheExpiryKey, String(now + expiry))
        }
      } catch (err) {
        console.error("Error fetching timeline events:", err)
        setError(err instanceof Error ? err.message : "Failed to load timeline events")
      } finally {
        setLoading(false)
      }
    }

    Promise.all([fetchJoinLinks(), fetchTimelineEvents()])
  }, [])

  return (
    <main className="flex min-h-screen flex-col pt-20">
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl font-bold mb-6">Join the BEA Family!</h1>
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                As a student-led organization, the Behavioral Economics Association (BEA) is committed to fostering a
                diverse and inclusive community of ambitious and innovative students who are passionate about exploring
                and promoting the interdisciplinary field of behavioral economics.
              </p>

              <h2>Our selection criteria includes:</h2>
              <ul>
                <li>
                  A demonstrated interest in behavioral economics, as demonstrated through coursework, research, or
                  other relevant experiences
                </li>
                <li>
                  A commitment to personal growth and professional development, as demonstrated through involvement in
                  extracurricular activities or other relevant experiences
                </li>
                <li>A willingness to participate in BEA events and contribute to the organization's mission</li>
                <li>A desire to be a part of a supportive and inclusive community of like-minded individuals</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              {links.interest && (
                <a
                  href={links.interest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 text-center transition-colors"
                >
                  Interest Form
                </a>
              )}

              {links.application && (
                <a
                  href={links.application}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-8 text-center transition-colors"
                >
                  Application Form
                </a>
              )}
            </div>

            <h2 className="text-3xl font-bold mb-6">Recruitment Timeline</h2>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <p className="text-gray-600">Please try again later or contact the administrator.</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No timeline events found.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform md:translate-x-px"></div>

                <div className="space-y-12">
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1.5 md:-translate-x-2 mt-1.5"></div>

                      {/* Content */}
                      <div className="md:w-1/2 pl-8 md:pl-0 md:pr-12 md:text-right">
                        {event.title && <h3 className="text-xl font-bold text-blue-700">{event.title}</h3>}
                        {event.date && <p className="text-gray-700 font-medium">{event.date}</p>}
                      </div>

                      <div className="md:w-1/2 pl-8 md:pl-12">
                        {event.time && <p className="text-gray-600">{event.time}</p>}
                        {event.location && <p className="text-gray-600">{event.location}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

