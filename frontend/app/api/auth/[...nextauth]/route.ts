import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { authAPI } from "@/lib/api"

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
                    throw new Error("Please enter your email and password.");
                }

                try {
                    const response = await authAPI.signIn({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (response.success && response.data?.user) {
                        return {
                            ...response.data.user,
                            id: response.data.user._id,
                            accessToken: response.data.token 
                        };
                    } else {
                        throw new Error(response.message || "Invalid email or password.");
                    }
                } catch (error: any) {
                    console.error("Authentication error:", error);
                    throw new Error(error.response?.data?.message || error.message || "An error occurred.");
                }
            }
        })
    ],

    debug: true,

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
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
                    console.log("🔄 Making OAuth API call to backend...");
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

                    console.log("📡 OAuth API response status:", response.status);
                    
                    if (!response.ok) {
                        console.error("❌ OAuth API response not OK:", response.status, response.statusText);
                        return false;
                    }

                    const data = await response.json()
                    console.log("📦 OAuth API response data:", data);

                    if (data.success && data.user && data.token) {
                        console.log("✅ OAuth API success, updating user object...");
                        user.id = data.user._id
                        user.isOnboarded = data.user.isOnboarded || false
                        user.bio = data.user.bio || ""
                        user.nativeLanguage = data.user.nativeLanguage || ""
                        user.learningLanguage = data.user.learningLanguage || ""
                        user.location = data.user.location || ""
                        user.accessToken = data.token // Fixed: use data.token directly
                        
                        console.log("✅ User object updated successfully");
                        return true
                    } else {
                        console.error("❌ OAuth API returned success=false or missing data:", data);
                        return false;
                    }
                } catch (error) {
                    console.error("❌ OAuth API error:", error)
                    return false
                }
            }

            return true
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accessToken = (user as any).accessToken;
                token.isOnboarded = (user as any).isOnboarded;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.isOnboarded = token.isOnboarded as boolean;
            }
            session.accessToken = token.accessToken as string;
            return session;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url
            return baseUrl
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }