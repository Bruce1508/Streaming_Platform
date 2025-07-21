import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: AuthOptions = {
    // ✅ REMOVED MongoDB adapter - Using JWT strategy to avoid DB conflicts
    // adapter: MongoDBAdapter(clientPromise),
    
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // ✅ Credentials provider for magic link sessions
        CredentialsProvider({
            id: "magic-link",
            name: "Magic Link",
            credentials: {
                email: { label: "Email", type: "email" },
                userData: { label: "User Data", type: "text" },
                accessToken: { label: "Access Token", type: "text" }
            },
            async authorize(credentials): Promise<any> {
                try {
                    if (!credentials?.userData || !credentials?.accessToken) return null;
                    
                    const userData = JSON.parse(credentials.userData);
                    console.log('🔄 Magic link credentials authorize:', userData.email);
                    
                    return {
                        id: userData._id,
                        email: userData.email,
                        name: userData.fullName,
                        image: userData.profilePic || '',
                        backendData: {
                            ...userData,
                            accessToken: credentials.accessToken // ✅ Store accessToken
                        }
                    };
                } catch (error) {
                    console.error('❌ Magic link authorize error:', error);
                    return null;
                }
            }
        }),

        // ✅ REMOVED EmailProvider - We'll handle magic links separately
        // The magic link flow will be handled by custom API routes
    ],

    debug: true,

    session: {
        strategy: "jwt" as const, // ✅ Changed to JWT strategy
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    },

    pages: {
        signIn: "/sign-in",
        error: "/sign-in", 
        verifyRequest: "/auth/verify-request"
    },

    callbacks: {
        // ✅ SIMPLIFIED: Only handle Google OAuth
        async signIn({ user, account, profile }: any) {
            console.log("SignIn callback - user:", user);

            if (account?.provider === "google") {
                // ✅ Google OAuth - No automatic verification
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
                        console.log("✅ OAuth API success - Verification status:", data.user.verificationStatus);
                        // Store user data AND token for session callback
                        (user as any).backendData = {
                            ...data.user,
                            accessToken: data.token // ✅ Store accessToken from backend
                        };
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

            // ✅ REMOVED email provider handling - will be done through custom routes
            return true
        },

        // ✅ Enhanced session callback with verification status
        async session({ session, token }: any) {
            if (session.user && token) {
                session.user.id = token.sub;
                
                // Add verification status from token data
                session.user.isOnboarded = token.isOnboarded || false;
                session.user.isVerified = token.isVerified || false;
                session.user.verificationStatus = token.verificationStatus || 'unverified';
                session.user.verificationMethod = token.verificationMethod || 'none';
                session.user.institutionInfo = token.institutionInfo || null;
                session.user.role = token.role || 'student';
                session.user.bio = token.bio || '';
                session.user.location = token.location || '';
                
                // Add access token from backend
                if (token.accessToken) {
                    session.accessToken = token.accessToken;
                }
            }
            return session;
        },

        // ✅ JWT callback to store backend user data
        async jwt({ token, user, account }: any) {
            // Store backend data in JWT token
            if (user?.backendData) {
                const backendData = user.backendData;
                token.isOnboarded = backendData.isOnboarded;
                token.isVerified = backendData.isVerified;
                token.verificationStatus = backendData.verificationStatus;
                token.verificationMethod = backendData.verificationMethod;
                token.institutionInfo = backendData.institutionInfo;
                token.role = backendData.role;
                token.bio = backendData.bio;
                token.location = backendData.location;
                token.accessToken = backendData.accessToken;
            }
            
            return token;
        },

        async redirect({ url, baseUrl }: any) {
            if (url.startsWith(baseUrl)) return url
            return baseUrl
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }