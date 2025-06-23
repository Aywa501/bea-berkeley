"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

export default function Home() {
  const { scrollY } = useScroll()
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const partnersRef = useRef(null)
  const eventsRef = useRef(null)
  const teamRef = useRef(null)

  const isAboutInView = useInView(aboutRef, { once: true, amount: 0.3 })
  const isPartnersInView = useInView(partnersRef, { once: true, amount: 0.3 })
  const isEventsInView = useInView(eventsRef, { once: true, amount: 0.3 })
  const isTeamInView = useInView(teamRef, { once: true, amount: 0.3 })

  const heroY = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="https://glrzi8puspeey1rz.public.blob.vercel-storage.com/0-1-LpxWqq0WUhxiUiu1aZ8Cs6ns8r1uk4.jpg"
            alt="BEA Berkeley members"
            fill
            priority
            className="object-cover brightness-[0.6]"
          />
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 z-10 pb-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Behavioral Economics Association
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white mb-10 max-w-3xl font-light"
          >
            Shaping the future of business, one decision at a time
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/join-us"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 transition-colors text-lg"
            >
              Join Us
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="animate-bounce"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 px-4 md:px-8 bg-gradient-to-b from-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 md:order-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Who Are We?</h2>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                The Behavioral Economics Association at Berkeley is a student organization dedicated to exploring the
                intersection of psychology and economics. We aim to understand how human behavior influences economic
                decision-making.
              </p>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Through workshops, speaker events, and research opportunities, we provide students with practical
                insights into behavioral economics and its applications in the real world.
              </p>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="relative h-[400px] md:h-[500px] overflow-hidden shadow-2xl">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6106-Mpsc8UkAbqrasnTN5wlBgP6ysRgvmZ.jpeg"
                  alt="BEA Event"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-yellow-400 hidden md:block"></div>
              <div className="absolute -top-6 -left-6 h-16 w-16 bg-blue-500 hidden md:block"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section ref={partnersRef} className="py-24 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isPartnersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">Our Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We collaborate with leading companies and organizations to provide our members with valuable experiences
              and opportunities.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isPartnersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-5xl h-[300px] md:h-[400px] bg-white shadow-lg p-8 overflow-hidden">
              <Image
                src="https://glrzi8puspeey1rz.public.blob.vercel-storage.com/logo_new-CpjAXBYz72gFACSqEgOituC14czAOY.png"
                alt="Partner Companies"
                fill
                className="object-contain p-8"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section with Parallax */}
      <section
        ref={teamRef}
        className="py-24 px-4 md:px-8 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute h-64 w-64 rounded-full bg-blue-600 -top-20 -left-20"></div>
          <div className="absolute h-96 w-96 rounded-full bg-yellow-400 -bottom-40 -right-40"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated students behind the Behavioral Economics Association at Berkeley.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] overflow-hidden shadow-xl">
              <Image
                src="https://glrzi8puspeey1rz.public.blob.vercel-storage.com/0-GoJsLKjJurQuj34rjaI9A5PTdq02GG.jpg"
                alt="BEA Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <Link
                href="/exec-board"
                className="inline-block bg-white hover:bg-gray-100 text-blue-800 font-medium py-3 px-8 transition-colors text-lg shadow-lg"
              >
                Meet Our Executive Board
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

