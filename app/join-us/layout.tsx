import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join Us - Behavioral Economics Association at Berkeley",
  description: "Join the Behavioral Economics Association at Berkeley",
}

export default function JoinUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

