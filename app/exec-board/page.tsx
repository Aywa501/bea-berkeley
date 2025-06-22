import Image from "next/image"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
import { CoffeeIcon } from "@/components/icons/coffee-icon"
import { prisma } from "@/lib/prisma"

interface ExecMember {
  id: string
  name: string
  position: string
  description: string
  linkedin: string | null
  coffeeChat: string | null
  imageUrl: string | null
}

async function getExecBoardMembers(): Promise<ExecMember[]> {
  try {
    const members = await prisma.execBoardMember.findMany({
      orderBy: {
        position: 'asc'
      }
    })

    return members.map(member => ({
      ...member,
      imageUrl: member.imageUrl
    }))
  } catch (error) {
    console.error("Error fetching executive board:", error)
    return []
  }
}

export default async function ExecBoardPage() {
  const execMembers = await getExecBoardMembers()

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
          {execMembers.length === 0 ? (
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
                    <Image
                      src={member.imageUrl || "/placeholder.svg?height=400&width=400"}
                      alt={member.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
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

                      <a className="text-sm text-blue-600 hover:text-blue-800" href={`/exec-board/${member.id}`}>
                        Read more
                      </a>
                    </div>
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

