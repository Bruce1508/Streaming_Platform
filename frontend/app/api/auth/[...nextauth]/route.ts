import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),

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
                            image: data.user.profilePic || "",
                            isOnboarded: data.user.isOnboarded || false,
                            bio: data.user.bio || "",
                            nativeLanguage: data.user.nativeLanguage || "",
                            learningLanguage: data.user.learningLanguage || "",
                            location: data.user.location || "",
                            accessToken: data.token // Ensure this is always defined
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

    debug: true,

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/sign-in",
        error: "/sign-in",
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("SignIn callback - user:", user);

            if (account?.provider === "google") {
                try {
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
                    console.log("OAuth API response:", data);

                    if (data.success) {
                        user.id = data.user._id
                        user.isOnboarded = data.user.isOnboarded || false
                        user.bio = data.user.bio || ""
                        user.nativeLanguage = data.user.nativeLanguage || ""
                        user.learningLanguage = data.user.learningLanguage || ""
                        user.location = data.user.location || ""
                        user.accessToken = data.token // Ensure token is set
                        return true
                    }
                    return false
                } catch (error) {
                    console.error("OAuth API error:", error)
                    return false
                }
            }

            return true
        },

        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                token.picture = user.image
                token.isOnboarded = user.isOnboarded
                token.bio = user.bio
                token.nativeLanguage = user.nativeLanguage
                token.learningLanguage = user.learningLanguage
                token.location = user.location
                // Use optional chaining and provide default empty string
                token.accessToken = user.accessToken || ""
                console.log("JWT callback - token:", token);
            }
            return token
        },

        async session({ session, token }) {
            console.log("Session callback - session:", session);
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
                session.user.isOnboarded = token.isOnboarded as boolean
                session.user.bio = token.bio as string
                session.user.nativeLanguage = token.nativeLanguage as string
                session.user.learningLanguage = token.learningLanguage as string
                session.user.location = token.location as string
            }
            // Use optional chaining and provide default empty string
            session.accessToken = token.accessToken || ""
            return session
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url
            return baseUrl
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }