"use client";

import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { signIn as loginApi } from "@/lib/api";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react"

// Define the error type
interface ApiError extends Error {
    response?: {
        data?: {
            message?: string;
        };
    };
    message: string;
}

const LoginPage = () => {
    const router = useRouter();
    const { login } = useAuth();

    // Form state
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    // Loading and error states
    const [isPending, setIsPending] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);
    const [error, setError] = useState<ApiError | null>(null);

    // Check if OAuth is configured
    const hasGoogleAuth = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log('🔧 Google Auth Check:', {
        hasGoogleAuth: !!hasGoogleAuth,
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.substring(0, 10) + '...'
    });
    // const hasMicrosoftAuth = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;

    const handleGoogleSignIn = async () => {
        setOauthLoading('google');
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (error: any) {
            toast.error("Failed to sign in with Google: ", error);
            setOauthLoading(null);
        }
    }

    // const handleMicrosoftSignIn = async () => {
    //     setOauthLoading('microsoft');
    //     try {
    //         await signIn("microsoft-entra-id", { callbackUrl: "/" });
    //     } catch (error) {
    //         toast.error("Failed to sign in with Microsoft");
    //         setOauthLoading(null);
    //     }
    // }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        try {
            const result = await loginApi(loginData);

            if (result.success && result.user && result.token) {
                // Save to context and localStorage
                login(result.user, result.token);

                toast.success("Welcome back!");

                // Redirect based on onboarding status
                setTimeout(() => {
                    if (result.user.isOnboarded) {
                        router.push("/");
                    } else {
                        router.push("/onBoarding");
                    }
                }, 1000);
            } else {
                setError({
                    response: { data: { message: result.message || "Login failed" } },
                } as ApiError);
            }
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
            data-theme="dark"
        >
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-2xl overflow-hidden">
                {/* LOGIN FORM SECTION */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-8 flex items-center justify-start gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ShipWheelIcon className="size-8 text-primary" />
                        </div>
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            LINGUEX
                        </span>
                    </div>

                    {/* ERROR MESSAGE DISPLAY */}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {error.response?.data?.message || error.message}
                            </span>
                        </div>
                    )}

                    <div className="w-full space-y-6">
                        {/* HEADER */}
                        <div>
                            <h2 className="text-3xl font-bold">Welcome Back</h2>
                            <p className="text-base opacity-70 mt-2">
                                Sign in to continue your language learning journey
                            </p>
                        </div>

                        {/* OAUTH BUTTONS */}
                        <div className="space-y-3">
                            {/* Google Sign In */}
                            {hasGoogleAuth && (
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={oauthLoading === 'google' || isPending}
                                    className="btn btn-outline w-full gap-3 h-12 hover:bg-base-200"
                                >
                                    {oauthLoading === 'google' ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    )}
                                    <span className="font-medium">Continue with Google</span>
                                </button>
                            )}

                            {/* Microsoft Sign In
                            {hasMicrosoftAuth && (
                                <button
                                    type="button"
                                    onClick={handleMicrosoftSignIn}
                                    disabled={oauthLoading === 'microsoft' || isPending}
                                    className="btn btn-outline w-full gap-3 h-12 hover:bg-base-200"
                                >
                                    {oauthLoading === 'microsoft' ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 23 23">
                                            <path fill="#f25022" d="M0 0h11v11H0z"/>
                                            <path fill="#00a4ef" d="M12 0h11v11H12z"/>
                                            <path fill="#7fba00" d="M0 12h11v11H0z"/>
                                            <path fill="#ffb900" d="M12 12h11v11H12z"/>
                                        </svg>
                                    )}
                                    <span className="font-medium">Continue with Microsoft</span>
                                </button>
                            )} */}
                        </div>

                        {/* DIVIDER */}
                        {(hasGoogleAuth) && (
                            <div className="divider text-sm">OR CONTINUE WITH EMAIL</div>
                        )}

                        {/* LOGIN FORM */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-4">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className="input input-bordered w-full h-12"
                                        value={loginData.email}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, email: e.target.value })
                                        }
                                        required
                                        disabled={isPending || oauthLoading !== null}
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input input-bordered w-full h-12"
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, password: e.target.value })
                                        }
                                        required
                                        disabled={isPending || oauthLoading !== null}
                                    />
                                    <label className="label">
                                        <Link href="/forgot-password" className="label-text-alt link link-hover text-primary">
                                            Forgot password?
                                        </Link>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full h-12"
                                    disabled={isPending || oauthLoading !== null}
                                >
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* SIGN UP LINK */}
                        <div className="text-center">
                            <p className="text-sm">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>

                        {/* DEV MODE WARNING */}
                        {process.env.NODE_ENV === 'development' && !hasGoogleAuth && (
                            <div className="alert alert-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-sm">OAuth sign-in is not configured yet. Add OAuth credentials to enable social login.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* IMAGE SECTION */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center p-8">
                    <div className="max-w-md">
                        {/* Illustration */}
                        <div className="relative aspect-square max-w-sm mx-auto mb-8">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                            <Image
                                src="/i.png"
                                alt="Language connection illustration"
                                fill
                                className="object-cover relative z-10"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-bold">
                                Welcome back to Linguex
                            </h2>
                            <p className="text-base opacity-80">
                                Continue your language learning journey and connect with native speakers worldwide
                            </p>
                            
                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">500+</div>
                                    <div className="text-sm opacity-70">Active Learners</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-secondary">14</div>
                                    <div className="text-sm opacity-70">Languages</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;