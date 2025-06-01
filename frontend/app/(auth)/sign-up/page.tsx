'use client';

import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signUp } from "@/lib/api";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();
    const { login } = useAuth();

    const hasGoogleAuth = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const handleGoogleSignUp = async () => {
        setOauthLoading('google');
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            toast.error("Failed to sign up with Google");
            setOauthLoading(null);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const termsAccepted = formData.get('terms') === 'on';

        // Client-side validation
        const newErrors: any = {};
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
            const result = await signUp({ fullName, email, password });

            if (result.success && result.user && result.token) {
                login(result.user, result.token);
                sessionStorage.setItem('justSignedUp', 'true');
                toast.success("Registration successful!");
                
                setTimeout(() => {
                    router.push('/onBoarding');
                }, 1000);
            } else {
                toast.error(result.message || "Registration failed");
                if (result.message?.includes('email')) {
                    setErrors({ email: result.message });
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="dark">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                
                {/* SIGNUP FORM SECTION */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-6 flex items-center justify-start gap-2">
                        <ShipWheelIcon className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            LINGUEX
                        </span>
                    </div>

                    <div className="w-full">
                        <div className="space-y-4">
                            {/* CENTERED HEADER */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-semibold">Create an Account</h2>
                                <p className="text-sm opacity-70 mt-1">
                                    Start your language learning adventure today
                                </p>
                            </div>

                            {/* OAUTH BUTTON */}
                            {hasGoogleAuth && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleGoogleSignUp}
                                        disabled={oauthLoading === 'google' || isLoading}
                                        className="btn btn-outline w-full gap-3"
                                    >
                                        {oauthLoading === 'google' ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                        )}
                                        <span className="font-medium">Sign up with Google</span>
                                    </button>

                                    <div className="divider">OR</div>
                                </>
                            )}

                            {/* SIGNUP FORM */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* FULLNAME */}
                                <div className="form-control w-full">
                                    <label className="label py-1">
                                        <span className="label-text text-sm">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="John Doe"
                                        className="input input-bordered input-sm w-full"
                                        disabled={isLoading || oauthLoading !== null}
                                    />
                                    {errors.fullName && (
                                        <label className="label py-0">
                                            <span className="text-error text-xs">{errors.fullName}</span>
                                        </label>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div className="form-control w-full">
                                    <label className="label py-1">
                                        <span className="label-text text-sm">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="john@example.com"
                                        className="input input-bordered input-sm w-full"
                                        disabled={isLoading || oauthLoading !== null}
                                    />
                                    {errors.email && (
                                        <label className="label py-0">
                                            <span className="text-error text-xs">{errors.email}</span>
                                        </label>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div className="form-control w-full">
                                    <label className="label py-1">
                                        <span className="label-text text-sm">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="input input-bordered input-sm w-full"
                                        disabled={isLoading || oauthLoading !== null}
                                    />
                                    {errors.password && (
                                        <label className="label py-0">
                                            <span className="text-error text-xs">{errors.password}</span>
                                        </label>
                                    )}
                                    <label className="label py-0">
                                        <span className="text-xs opacity-70">Must be at least 6 characters</span>
                                    </label>
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="form-control w-full">
                                    <label className="label py-1">
                                        <span className="label-text text-sm">Confirm Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        className="input input-bordered input-sm w-full"
                                        disabled={isLoading || oauthLoading !== null}
                                    />
                                    {errors.confirmPassword && (
                                        <label className="label py-0">
                                            <span className="text-error text-xs">{errors.confirmPassword}</span>
                                        </label>
                                    )}
                                </div>

                                {/* TERMS */}
                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-2 py-1">
                                        <input 
                                            type="checkbox" 
                                            name="terms" 
                                            className="checkbox checkbox-primary checkbox-sm" 
                                            disabled={isLoading || oauthLoading !== null}
                                        />
                                        <span className="label-text text-sm">
                                            I agree to the{" "}
                                            <Link href="/terms" className="text-primary hover:underline">
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="/privacy" className="text-primary hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </label>
                                    {errors.terms && (
                                        <label className="label py-0">
                                            <span className="text-error text-xs ml-7">{errors.terms}</span>
                                        </label>
                                    )}
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button 
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={isLoading || oauthLoading !== null}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs"></span>
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </form>

                            {/* SIGN IN LINK */}
                            <div className="text-center mt-4">
                                <p className="text-sm">
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className="text-primary hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IMAGE SECTION */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <Image
                                src="/i.png"
                                alt="Language connection illustration"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">
                                Connect with language partners worldwide
                            </h2>
                            <p className="opacity-70">
                                Practice conversations, make friends, and improve your language skills together
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}