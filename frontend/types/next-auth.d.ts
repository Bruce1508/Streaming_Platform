import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image: string
      isOnboarded: boolean
      bio?: string
      nativeLanguage?: string
      learningLanguage?: string
      location?: string
    }
    accessToken: string
  }

  interface User {
    id: string
    email: string
    name: string
    image: string
    isOnboarded: boolean
    bio?: string
    nativeLanguage?: string
    learningLanguage?: string
    location?: string
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accessToken: string
    isOnboarded: boolean
  }
}