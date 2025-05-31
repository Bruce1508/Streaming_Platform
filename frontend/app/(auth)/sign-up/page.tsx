'use client';

import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signUp } from "@/lib/api";

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const termsAccepted = formData.get('terms') === 'on';

        // Client-side validation
        const newErrors: any = {};
        if (!fullName) newErrors.fullName = 'Full name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!termsAccepted) newErrors.terms = 'You must accept the terms';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const result = await signUp({ fullName, email, password });

            if (result.success && result.user && result.token) {
                // Save to context and localStorage
                login(result.user, result.token);
                
                // Mark as just signed up
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
                {/* SIGNUP FORM - LEFT SIDE */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <ShipWheelIcon className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            LINGUEX
                        </span>
                    </div>

                    <div className="w-full">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Create an Account</h2>
                                    <p className="text-sm opacity-70">
                                        Join Streamify and start your language learning adventure!
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {/* FULLNAME */}
                                    <fieldset className="form-control w-full fieldset">
                                        <label className="label">
                                            <legend className="fieldset-legend text-sm font-medium text-gray-600">Name</legend>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="John Doe"
                                            className="input w-full"
                                            disabled={isLoading}
                                        />
                                        {errors.fullName && (
                                            <label className="label">
                                                <span className="text-error text-sm">{errors.fullName}</span>
                                            </label>
                                        )}
                                    </fieldset>

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
                                        <p className="text-xs opacity-70 mt-1">
                                            Password must be at least 6 characters long
                                        </p>
                                    </fieldset>

                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input 
                                                type="checkbox" 
                                                name="terms" 
                                                className="checkbox checkbox-sm" 
                                                disabled={isLoading}
                                            />
                                            <span className="text-xs leading-tight">
                                                I agree to the{" "}
                                                <span className="text-primary hover:underline">terms of service</span> and{" "}
                                                <span className="text-primary hover:underline">privacy policy</span>
                                            </span>
                                        </label>
                                        {errors.terms && (
                                            <label className="label">
                                                <span className="text-error text-sm">{errors.terms}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={isLoading}
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

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Already have an account?{" "}
                                        <Link href="/sign-in" className="text-primary hover:underline">
                                            Sign in
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
                            <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
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