'use client';

import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signIn as loginApi } from "@/lib/api";

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Client-side validation
        const newErrors: any = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const result = await loginApi({ email, password });

            if (result.success && result.user && result.token) {
                // Save to context and localStorage
                login(result.user, result.token);
                
                toast.success("Login successful!");
                
                // Redirect based on onboarding status
                setTimeout(() => {
                    if (result.user.isOnboarded) {
                        router.push('/');
                    } else {
                        router.push('/onboarding');
                    }
                }, 1000);
            } else {
                toast.error(result.message || "Login failed");
                if (result.message?.includes('credentials')) {
                    setErrors({ email: 'Invalid email or password', password: 'Invalid email or password' });
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
                {/* SIGNIN FORM - LEFT SIDE */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <ShipWheelIcon className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            STREAMIFY
                        </span>
                    </div>

                    <div className="w-full">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                                    <p className="text-sm opacity-70">
                                        Sign in to continue your language learning journey!
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {/* EMAIL */}
                                    <fieldset className="form-control w-full fieldset">
                                        <label className="label">
                                            <legend className="fieldset-legend text-sm font-medium text-gray-600">Email</legend>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="john@gmail.com"
                                            className="input input-bordered w-full"
                                            disabled={isLoading}
                                        />
                                        {errors.email && (
                                            <label className="label">
                                                <span className="text-error text-sm">{errors.email}</span>
                                            </label>
                                        )}
                                    </fieldset>

                                    {/* PASSWORD */}
                                    <fieldset className="form-control w-full fieldset">
                                        <label className="label">
                                            <legend className="fieldset-legend text-sm font-medium text-gray-600">Password</legend>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="********"
                                            className="input input-bordered w-full"
                                            disabled={isLoading}
                                        />
                                        {errors.password && (
                                            <label className="label">
                                                <span className="text-error text-sm">{errors.password}</span>
                                            </label>
                                        )}
                                    </fieldset>
                                </div>

                                <button 
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs"></span>
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Don't have an account?{" "}
                                        <Link href="/sign-up" className="text-primary hover:underline">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <Image
                                src="/i.png"
                                alt="Language connection illustration"
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Welcome back to your language journey</h2>
                            <p className="opacity-70">
                                Continue practicing and connecting with language partners worldwide
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}