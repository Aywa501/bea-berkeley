import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: UserRole
  }

  interface Session {
    user: {
      id: string
      role: UserRole
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
} 