import Link from "next/link"

export const metadata = {
  title: "Events - Behavioral Economics Association at Berkeley",
  description: "Upcoming and past events by the Behavioral Economics Association at Berkeley",
}

export default function EventsPage() {
  const upcomingEvents = [
    {
      title: "Speaker Series: Behavioral Finance",
      date: "March 15, 2025",
      time: "5:00 PM - 6:30 PM",
      location: "Haas School of Business, Room F320",
      description:
        "Join us for an insightful discussion on behavioral economics applications in modern finance with Dr. Colin Camerer, Professor of Behavioral Finance at Caltech.",
      registrationLink: "#",
    },
    {
      title: "Workshop: Decision Making Under Uncertainty",
      date: "March 22, 2025",
      time: "4:00 PM - 6:00 PM",
      location: "Evans Hall, Room 60",
      description:
        "A hands-on workshop exploring how people make decisions when faced with uncertain outcomes. Led by Professor Matthew Rabin from Harvard University.",
      registrationLink: "#",
    },
    {
      title: "Networking Event: Industry Professionals",
      date: "April 5, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Chou Hall, Spieker Forum",
      description:
        "Connect with professionals working in behavioral economics across various industries. Representatives from tech, finance, consulting, and more will be present.",
      registrationLink: "#",
    },
    {
      title: "BWIM Panel: Women in Finance",
      date: "April 12, 2025",
      time: "5:30 PM - 7:00 PM",
      location: "Haas School of Business, Wells Fargo Room",
      description:
        "A panel discussion featuring successful women in finance sharing their experiences and insights on navigating the industry.",
      registrationLink: "#",
    },
  ]

  const pastEvents = [
    {
      title: "Speaker Series: Nudge Theory in Public Policy",
      date: "February 10, 2025",
      time: "5:00 PM - 6:30 PM",
      location: "Wheeler Hall, Room 150",
      description:
        "Dr. Richard Thaler discussed the applications of nudge theory in public policy and how small changes can lead to significant behavioral shifts.",
      recordingLink: "#",
    },
    {
      title: "Workshop: Experimental Economics",
      date: "January 25, 2025",
      time: "3:00 PM - 5:00 PM",
      location: "Evans Hall, Room 60",
      description:
        "A workshop on designing and conducting experiments in behavioral economics, led by Professor Stefano DellaVigna.",
      recordingLink: "#",
    },
    {
      title: "Career Panel: Behavioral Economics in Industry",
      date: "December 5, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Chou Hall, Spieker Forum",
      description:
        "A panel discussion featuring professionals applying behavioral economics in various industries, including tech, finance, and consulting.",
      recordingLink: "#",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col pt-20">
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Events</h1>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
            <div className="space-y-8">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 mb-4 text-sm">
                      <p className="text-gray-600">
                        <strong>Date:</strong> {event.date}
                      </p>
                      <p className="text-gray-600">
                        <strong>Time:</strong> {event.time}
                      </p>
                      <p className="text-gray-600">
                        <strong>Location:</strong> {event.location}
                      </p>
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <Link
                      href={event.registrationLink}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded inline-block transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8">Past Events</h2>
            <div className="space-y-8">
              {pastEvents.map((event, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 mb-4 text-sm">
                      <p className="text-gray-600">
                        <strong>Date:</strong> {event.date}
                      </p>
                      <p className="text-gray-600">
                        <strong>Time:</strong> {event.time}
                      </p>
                      <p className="text-gray-600">
                        <strong>Location:</strong> {event.location}
                      </p>
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <Link
                      href={event.recordingLink}
                      className="text-blue-700 hover:text-blue-800 font-medium inline-block transition-colors"
                    >
                      View Recording →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

