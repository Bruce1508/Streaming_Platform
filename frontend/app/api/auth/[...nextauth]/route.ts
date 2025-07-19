import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { MongoClient } from "mongodb"
import { MongoDBAdapter } from "@auth/mongodb-adapter"

const client = new MongoClient(process.env.MONGODB_URL!)
const clientPromise = client.connect()

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise) as any,
    
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

        EmailProvider({
            server: {
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            },
            from: process.env.EMAIL_FROM || "noreply@studyhub.com",
            
            // ✅ GIỮ NGUYÊN CUSTOM LOGIC
            sendVerificationRequest: async ({ identifier, url, provider }) => {
                try {
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-magic-link`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            email: identifier, 
                            callbackUrl: url,
                            baseUrl: process.env.NEXTAUTH_URL 
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error("Failed to send magic link");
                    }
                } catch (error) {
                    console.error("Magic link sending error:", error);
                    throw error;
                }
            }
        }),
    ],

    debug: true,

    session: {
        strategy: "database", // ✅ THAY ĐỔI THÀNH DATABASE
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    },

    pages: {
        signIn: "/sign-in",
        error: "/sign-in", 
        verifyRequest: "/auth/verify-request"
    },

    callbacks: {
        // ✅ GIỮ NGUYÊN LOGIC CỦA BẠN
        async signIn({ user, account, profile }) {
            console.log("SignIn callback - user:", user);

            if (account?.provider === "google") {
                // Logic Google OAuth của bạn - giữ nguyên
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

                    if (!response.ok) {
                        console.error("❌ OAuth API response not OK:", response.status);
                        return false;
                    }

                    const data = await response.json()
                    
                    if (data.success && data.user && data.token) {
                        console.log("✅ OAuth API success");
                        return true
                    } else {
                        console.error("❌ OAuth API returned success=false:", data);
                        return false;
                    }
                } catch (error) {
                    console.error("❌ OAuth API error:", error)
                    return false
                }
            }

            if (account?.provider === "email") {
                // Logic magic link của bạn - giữ nguyên
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/magic-link-verify`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: user.email
                        })
                    });

                    if (!response.ok) {
                        return false;
                    }

                    const data = await response.json();
                    if (data.success && data.user) {
                        return true;
                    }
                } catch (error) {
                    console.error("Magic link authentication error:", error);
                    return false;
                }
            }

            return true
        },

        // ✅ VỚI DATABASE STRATEGY - THAY ĐỔI CALLBACKS
        async session({ session, user }) {
            // user là từ database adapter
            if (session.user && user) {
                session.user.id = user.id;
                session.user.isOnboarded = (user as any).isOnboarded || false;
            }
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