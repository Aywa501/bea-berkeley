"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-24">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-K3Of8PKqpCgUZTWj2I4S33CUFb3HZJ.png"
                alt="BEA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/")
                  ? isScrolled
                    ? "text-blue-600"
                    : "text-white"
                  : isScrolled
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
              }`}
            >
              <span>Home</span>
              {isActive("/") && (
                <motion.span
                  layoutId="underline"
                  className={`absolute left-0 top-full h-0.5 w-full ${isScrolled ? "bg-blue-600" : "bg-white"}`}
                />
              )}
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/about")
                  ? isScrolled
                    ? "text-blue-600"
                    : "text-white"
                  : isScrolled
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
              }`}
            >
              <span>About</span>
              {isActive("/about") && (
                <motion.span
                  layoutId="underline"
                  className={`absolute left-0 top-full h-0.5 w-full ${isScrolled ? "bg-blue-600" : "bg-white"}`}
                />
              )}
            </Link>
            <Link
              href="/speakers"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/speakers")
                  ? isScrolled
                    ? "text-blue-600"
                    : "text-white"
                  : isScrolled
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
              }`}
            >
              <span>Speakers</span>
              {isActive("/speakers") && (
                <motion.span
                  layoutId="underline"
                  className={`absolute left-0 top-full h-0.5 w-full ${isScrolled ? "bg-blue-600" : "bg-white"}`}
                />
              )}
            </Link>
            <Link
              href="/bwim"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/bwim")
                  ? isScrolled
                    ? "text-blue-600"
                    : "text-white"
                  : isScrolled
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
              }`}
            >
              <span>BWIM</span>
              {isActive("/bwim") && (
                <motion.span
                  layoutId="underline"
                  className={`absolute left-0 top-full h-0.5 w-full ${isScrolled ? "bg-blue-600" : "bg-white"}`}
                />
              )}
            </Link>
            <Link
              href="/exec-board"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/exec-board")
                  ? isScrolled
                    ? "text-blue-600"
                    : "text-white"
                  : isScrolled
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
              }`}
            >
              <span>Exec Board</span>
              {isActive("/exec-board") && (
                <motion.span
                  layoutId="underline"
                  className={`absolute left-0 top-full h-0.5 w-full ${isScrolled ? "bg-blue-600" : "bg-white"}`}
                />
              )}
            </Link>
            <Link
              href="/join-us"
              className={`bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 transition-colors`}
            >
              Join Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`w-6 h-6 ${isScrolled ? "text-gray-800" : "text-white"}`}
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col space-y-4"
              >
                <Link
                  href="/"
                  className={`text-sm font-medium px-4 py-2  ${
                    isActive("/")
                      ? isScrolled
                        ? "text-blue-600 bg-blue-50"
                        : "text-white bg-white/10"
                      : isScrolled
                        ? "text-gray-800"
                        : "text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`text-sm font-medium px-4 py-2  ${
                    isActive("/about")
                      ? isScrolled
                        ? "text-blue-600 bg-blue-50"
                        : "text-white bg-white/10"
                      : isScrolled
                        ? "text-gray-800"
                        : "text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/speakers"
                  className={`text-sm font-medium px-4 py-2  ${
                    isActive("/speakers")
                      ? isScrolled
                        ? "text-blue-600 bg-blue-50"
                        : "text-white bg-white/10"
                      : isScrolled
                        ? "text-gray-800"
                        : "text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Speakers
                </Link>
                <Link
                  href="/bwim"
                  className={`text-sm font-medium px-4 py-2  ${
                    isActive("/bwim")
                      ? isScrolled
                        ? "text-blue-600 bg-blue-50"
                        : "text-white bg-white/10"
                      : isScrolled
                        ? "text-gray-800"
                        : "text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  BWIM
                </Link>
                <Link
                  href="/exec-board"
                  className={`text-sm font-medium px-4 py-2  ${
                    isActive("/exec-board")
                      ? isScrolled
                        ? "text-blue-600 bg-blue-50"
                        : "text-white bg-white/10"
                      : isScrolled
                        ? "text-gray-800"
                        : "text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Exec Board
                </Link>
                <Link
                  href="/join-us"
                  className={`text-sm font-medium px-4 py-2  ${
                    isActive("/join-us")
                      ? isScrolled
                        ? "text-blue-600 bg-blue-50"
                        : "text-white bg-white/10"
                      : isScrolled
                        ? "text-gray-800"
                        : "text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Us
                </Link>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

