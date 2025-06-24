'use client';

import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/api";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);
    type Errors = {
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
    };
    const [errors, setErrors] = useState<Errors>({});
    const router = useRouter();

    const hasGoogleAuth = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log('🔧 Google Auth Check:', {
        hasGoogleAuth: !!hasGoogleAuth,
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.substring(0, 10) + '...'
    });

    const handleGoogleSignUp = async () => {
        setOauthLoading('google');
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (error: any) {
            toast.error("Failed to sign up with Google: ", error);
            setOauthLoading(null);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const fullName = formData.get('fullName') as string;
        const termsAccepted = formData.get('terms') === 'on';

        // Client-side validation
        const newErrors: Errors = {};
        if (!fullName) newErrors.fullName = 'Full name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!termsAccepted) newErrors.terms = 'You must accept the terms';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            console.log('🔄 Creating user account...');
            // Step 1: Create user in backend
            const result = await signUp({ fullName, email, password });

            if (result.success) {
                console.log('✅ Account created, now signing in with NextAuth...');
                toast.success("Account created successfully!");

                // Step 2: Sign in with NextAuth to create proper session
                const signInResult = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (signInResult?.ok) {
                    console.log('✅ NextAuth session created, redirecting to dashboard...');
                    toast.success("Welcome! Let's get started...");
                    router.push('/dashboard');
                } else {
                    console.error('❌ NextAuth sign-in failed:', signInResult?.error);
                    toast.error("Account created but sign-in failed. Please try signing in manually.");
                    router.push('/sign-in');
                }
            } else {
                toast.error(result.message || "Registration failed");
                if (result.message?.includes('email')) {
                    setErrors({ email: result.message });
                }
            }
        } catch (error: any) {
            console.error('❌ Registration error:', error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 " data-theme="dark">
            <div className="w-full max-w-6xl mx-auto">
                <div className="border border-primary/20 flex flex-col lg:flex-row bg-base-100 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">

                    {/* IMAGE SECTION - LEFT SIDE */}
                    <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10 items-center justify-center p-8 lg:p-12">
                        <div className="max-w-md">
                            <div className="relative aspect-square max-w-[280px] mx-auto mb-8">
                                <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
                                <Image
                                    src="/i.png"
                                    alt="Language connection illustration"
                                    fill
                                    priority
                                    className="object-cover relative z-10 drop-shadow-2xl"
                                    sizes="280px"
                                />
                            </div>

                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Join the StudyBuddy Community
                                </h2>
                                <p className="text-base opacity-80 text-base-content/70">
                                    Share and discover study materials with fellow students
                                </p>

                                {/* Compact Benefits with better spacing */}
                                <div className="flex flex-col gap-3 mt-6 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">Upload and share study materials</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">Connect with study partners</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">Access course-specific resources</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SIGNUP FORM - RIGHT SIDE */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
                        {/* LOGO */}
                        <div className="mb-8 flex items-center justify-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <ShipWheelIcon className="size-6 text-primary" />
                            </div>
                            <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                StudyBuddy
                            </span>
                        </div>

                        <div className="w-full space-y-6 max-w-md mx-auto">
                            {/* HEADER */}
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
                                <p className="text-base opacity-70">
                                    Join the StudyBuddy community
                                </p>
                            </div>

                            {/* OAUTH BUTTONS */}
                            {hasGoogleAuth && (
                                <div className="space-y-3">
                                    {hasGoogleAuth && (
                                        <button
                                            type="button"
                                            onClick={handleGoogleSignUp}
                                            disabled={oauthLoading === 'google' || isLoading}
                                            className="btn btn-outline w-full gap-3 h-12 hover:bg-base-200"
                                        >
                                            {oauthLoading === 'google' ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            )}
                                            <span>Continue with Google</span>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* DIVIDER */}
                            {hasGoogleAuth && (
                                <div className="divider">OR</div>
                            )}

                            {/* SIGNUP FORM */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* FULLNAME */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="John Doe"
                                            className="input input-bordered w-full"
                                            disabled={isLoading || oauthLoading !== null}
                                        />
                                        {errors.fullName && (
                                            <span className="text-error text-sm mt-1">{errors.fullName}</span>
                                        )}
                                    </div>

                                    {/* EMAIL */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="student@myseneca.ca"
                                            className="input input-bordered w-full"
                                            disabled={isLoading || oauthLoading !== null}
                                        />
                                        {errors.email && (
                                            <span className="text-error text-sm mt-1">{errors.email}</span>
                                        )}
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="input input-bordered w-full"
                                        disabled={isLoading || oauthLoading !== null}
                                    />
                                    <span className="text-xs text-base-content/60 italic">Min 6 characters</span>

                                    {errors.password && (
                                        <span className="text-error text-sm mt-1">{errors.password}</span>
                                    )}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Confirm Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        className="input input-bordered w-full"
                                        disabled={isLoading || oauthLoading !== null}
                                    />
                                    {errors.confirmPassword && (
                                        <span className="text-error text-sm mt-1">{errors.confirmPassword}</span>
                                    )}
                                </div>

                                {/* TERMS */}
                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-3">
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            className="checkbox checkbox-primary"
                                            disabled={isLoading || oauthLoading !== null}
                                        />
                                        <span className="label-text">
                                            I agree to the{" "}
                                            <Link href="/terms" className="text-primary hover:underline">
                                                Terms
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="/privacy" className="text-primary hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </label>
                                    {errors.terms && (
                                        <span className="text-error text-sm ml-7">{errors.terms}</span>
                                    )}
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full h-12"
                                    disabled={isLoading || oauthLoading !== null}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </form>

                            {/* SIGN IN LINK */}
                            <div className="text-center pt-4">
                                <p className="text-base">
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className="text-primary hover:underline font-semibold">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}