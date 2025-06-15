"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"

export default function AboutPage() {
  const heroRef = useRef(null)
  const missionRef = useRef(null)
  const valuesRef = useRef(null)

  const isMissionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const isValuesInView = useInView(valuesRef, { once: true, amount: 0.3 })

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8656.jpg-p33ZJJzNN7snEjgQ4xJNBgUDbrgjMd.jpeg"
          alt="BEA Team at Lake Tahoe"
          fill
          priority
          className="object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            About Us
          </motion.h1>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-xl leading-relaxed">
              The Behavioral Economics Association at Berkeley (BEA) is a student organization dedicated to exploring
              the intersection of psychology and economics. We aim to understand how human behavior influences economic
              decision-making.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        ref={missionRef}
        className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-blue-900 to-blue-800 text-white"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isMissionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Our Mission</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Our mission is to promote the study and application of behavioral economics among UC Berkeley students. We
              believe that understanding the psychological factors that influence economic decisions is crucial for
              developing effective policies, business strategies, and personal financial decisions.
            </p>

            <h3 className="text-2xl font-bold mb-6 tracking-tight">What We Do</h3>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              BEA organizes a variety of activities to engage students interested in behavioral economics:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  title: "Speaker Series",
                  description:
                    "We invite professionals and academics to share their insights and experiences in the field of behavioral economics.",
                },
                {
                  title: "Workshops",
                  description:
                    "We conduct workshops to help students understand key concepts and methodologies in behavioral economics.",
                },
                {
                  title: "Research Opportunities",
                  description: "We connect students with research opportunities in behavioral economics.",
                },
                {
                  title: "Networking Events",
                  description: "We organize events to help students connect with professionals in the field.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isMissionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-blue-800/50 rounded-xl p-6 hover:bg-blue-700/50 transition-colors"
                >
                  <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                  <p className="text-blue-100">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                href="/events"
                className="inline-block bg-white text-blue-800 hover:bg-blue-50 font-medium py-3 px-8 rounded-full transition-colors text-lg"
              >
                View Our Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Our Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  title: "Intellectual Curiosity",
                  description:
                    "We encourage students to ask questions and explore new ideas in the field of behavioral economics.",
                },
                {
                  title: "Diversity of Thought",
                  description: "We welcome diverse perspectives and approaches to understanding economic behavior.",
                },
                {
                  title: "Practical Application",
                  description:
                    "We emphasize the real-world applications of behavioral economics in business, policy, and personal decision-making.",
                },
                {
                  title: "Community",
                  description:
                    "We foster a supportive community of students interested in behavioral economics and related fields.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <h4 className="text-xl font-semibold mb-3 text-blue-600">{item.title}</h4>
                  <p className="text-gray-700">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/join-us"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors text-lg"
              >
                Join Our Community
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

