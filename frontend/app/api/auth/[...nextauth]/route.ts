import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongoDB"
import { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        // Google Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // Credentials Provider cho login thông thường
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    })

                    const data = await response.json()

                    if (data.success && data.user) {
                        return {
                            id: data.user._id,
                            email: data.user.email,
                            name: data.user.fullName,
                            image: data.user.profilePic,
                            ...data.user,
                            accessToken: data.token
                        }
                    }
                    return null
                } catch (error) {
                    console.error("Login error:", error)
                    return null
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },

    pages: {
        signIn: "/sign-in",
        error: "/sign-in",
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    // Gọi API backend để create/update user
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            provider: "google",
                            email: user.email,
                            fullName: user.name,
                            profilePic: user.image,
                            providerId: account.providerAccountId
                        })
                    })

                    const data = await response.json()

                    if (data.success) {
                        user.id = data.user._id
                        user.accessToken = data.token
                        return true
                    }
                    return false
                } catch (error) {
                    console.error("OAuth error:", error)
                    return false
                }
            }
            return true
        },

        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.accessToken = user.accessToken
                token.isOnboarded = user.isOnboarded
            }
            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.accessToken = token.accessToken as string
                session.user.isOnboarded = token.isOnboarded as boolean
            }
            return session
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }