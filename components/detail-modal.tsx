"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
import { CoffeeIcon } from "@/components/icons/coffee-icon"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  content: string
  image?: string
  links?: {
    linkedin?: string
    coffeeChat?: string
  }
}

export function DetailModal({ isOpen, onClose, title, subtitle, content, image, links }: DetailModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isMounted) return null
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {image && (
            <div className="mb-6 relative h-64 w-full">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover object-center" />
            </div>
          )}

          {subtitle && <p className="text-blue-700 mb-4 font-medium">{subtitle}</p>}

          <div className="prose max-w-none">
            <p>{content}</p>
          </div>

          {links && (links.linkedin || links.coffeeChat) && (
            <div className="mt-6 flex space-x-6">
              {links.coffeeChat && (
                <a
                  href={links.coffeeChat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors"
                >
                  <CoffeeIcon className="w-6 h-6 mr-2" />
                  Schedule Coffee Chat
                </a>
              )}

              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors"
                >
                  <LinkedInIcon className="w-6 h-6 mr-2" />
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

