"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function BWIMPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Simulate form submission
    try {
      // In a real implementation, you would send this to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      setEmail("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6106-Mpsc8UkAbqrasnTN5wlBgP6ysRgvmZ.jpeg"
          alt="BWIM Team"
          fill
          priority
          className="object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Berkeley Women in Markets
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white mb-10 max-w-3xl font-light"
          >
            Promoting gender diversity in economic markets
          </motion.p>
        </div>
      </section>

      {/* Email Submission Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Join Our Community</h2>
            <p className="text-lg text-gray-700 mb-8">
              Berkeley Women in Markets (BWIM) is an initiative by the Behavioral Economics Association at
              Berkeley focused on promoting gender diversity in economic markets and the field of behavioral economics.
              Sign up to receive updates about our events and opportunities.
            </p>
          </div>

          <div className="bg-gray-50 p-8 border border-gray-200 shadow-sm">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Subscribe"}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-green-500 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-600">You've successfully subscribed to Berkeley Women in Markets updates.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Subscribe another email
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

