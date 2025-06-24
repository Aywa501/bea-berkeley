"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const showWipPages = false // Flag to hide WIP pages

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2"
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
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              <span>Home</span>
              {isActive("/") && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 top-full h-0.5 w-full bg-blue-600"
                />
              )}
            </Link>
            <Link
              href="/speakers"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/speakers")
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              <span>Speakers</span>
              {isActive("/speakers") && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 top-full h-0.5 w-full bg-blue-600"
                />
              )}
            </Link>
            <Link
              href="/exec-board"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/exec-board")
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              <span>Exec Board</span>
              {isActive("/exec-board") && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 top-full h-0.5 w-full bg-blue-600"
                />
              )}
            </Link>
            <Link
              href="/join-us"
              className={`text-sm font-medium transition-colors relative ${
                isActive("/join-us")
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              <span>Join Us</span>
              {isActive("/join-us") && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 top-full h-0.5 w-full bg-blue-600"
                />
              )}
            </Link>
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`text-sm font-medium transition-colors relative ${
                  isMoreMenuOpen ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
                }`}
              >
                More
              </button>
              {isMoreMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {showWipPages && (
                      <>
                        <Link
                          href="/past-clients"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsMoreMenuOpen(false)}
                        >
                          Past Clients
                        </Link>
                        <Link
                          href="/ongoing-research"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsMoreMenuOpen(false)}
                        >
                          Ongoing Research
                        </Link>
                      </>
                    )}
                    <Link
                      href="/bwim"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      BWIM
                    </Link>
                    <Link
                      href="/members"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      Members
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-800"
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
                  className={`text-sm font-medium px-4 py-2 ${
                    isActive("/") ? "text-blue-600 bg-blue-50" : "text-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/speakers"
                  className={`text-sm font-medium px-4 py-2 ${
                    isActive("/speakers") ? "text-blue-600 bg-blue-50" : "text-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Speakers
                </Link>
                <Link
                  href="/exec-board"
                  className={`text-sm font-medium px-4 py-2 ${
                    isActive("/exec-board") ? "text-blue-600 bg-blue-50" : "text-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Exec Board
                </Link>
                <Link
                  href="/join-us"
                  className={`text-sm font-medium px-4 py-2 ${
                    isActive("/join-us") ? "text-blue-600 bg-blue-50" : "text-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Us
                </Link>
                <div className="px-4 py-2">
                  <button
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    className={`text-sm font-medium ${
                      isMoreMenuOpen ? "text-blue-600" : "text-gray-800"
                    }`}
                  >
                    More
                  </button>
                  <AnimatePresence>
                    {isMoreMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 mt-2 space-y-2"
                      >
                        {showWipPages && (
                          <>
                            <Link
                              href="/past-clients"
                              className="block text-sm text-gray-700"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Past Clients
                            </Link>
                            <Link
                              href="/ongoing-research"
                              className="block text-sm text-gray-700"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Ongoing Research
                            </Link>
                          </>
                        )}
                        <Link
                          href="/bwim"
                          className="block text-sm text-gray-700"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          BWIM
                        </Link>
                        <Link
                          href="/members"
                          className="block text-sm text-gray-700"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Members
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

