import { prisma } from "@/lib/prisma"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface RecruitmentEvent {
  id: string
  title: string
  date: Date
  description: string
  location: string | null
}

interface RecruitmentForm {
  id: string
  title: string
  description: string
  deadline: Date
  link: string
}

async function getRecruitmentData() {
  try {
    const [events, forms] = await Promise.all([
      prisma.recruitmentEvent.findMany({
        orderBy: {
          date: 'desc'
        }
      }),
      prisma.recruitmentForm.findMany({
        orderBy: {
          deadline: "asc",
        },
      })
    ])

    return { events, forms }
  } catch (error) {
    console.error("Error fetching recruitment data:", error)
    return { events: [], forms: [] }
  }
}

export default async function JoinUsPage() {
  const { events, forms } = await getRecruitmentData()

  const getFormUrl = (type: string) => {
    const form = forms.find(form => form.title.toLowerCase().includes(type.toLowerCase()))
    return form?.link || "#"
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="pt-32 pb-20 bg-gray-100 flex items-end justify-center">
        <div className="text-center z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Join the BEA Family!</h1>
          <p className="text-xl text-gray-600 mb-8">
            As a student-led organization, the Behavioral Economics Association (BEA) is committed to fostering a diverse and inclusive community of ambitious and innovative students who are passionate about exploring and promoting the interdisciplinary field of behavioral economics.
          </p>

          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900">Our selection criteria includes:</h2>
            <ul className="text-lg text-gray-600 space-y-3 text-left max-w-2xl mx-auto">
              <li>• A demonstrated interest in behavioral economics, as demonstrated through coursework, research, or other relevant experiences</li>
              <li>• A commitment to personal growth and professional development, as demonstrated through involvement in extracurricular activities or other relevant experiences</li>
              <li>• A willingness to participate in BEA events and contribute to the organization's mission</li>
              <li>• A desire to be a part of a supportive and inclusive community of like-minded individuals</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getFormUrl("interest")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Interest Form
            </a>
            <a
              href={getFormUrl("application")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Application Form
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No recruitment events found.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>

              {/* Events */}
              <div className="space-y-12">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {/* Timeline node */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600"></div>

                    {/* Content */}
                    <div
                      className={`w-1/2 ${
                        index % 2 === 0 ? "pr-12 text-right" : "pl-12"
                      }`}
                    >
                      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-2">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        {event.location && (
                          <p className="text-gray-600 mb-2">{event.location}</p>
                        )}
                        <p className="text-gray-700 mb-4">{event.description}</p>
                        <a
                          className="text-sm text-blue-600 hover:text-blue-800"
                          href={`/recruitment/${event.id}`}
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

