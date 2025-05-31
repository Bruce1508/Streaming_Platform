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

    // Form state - giữ nguyên như bạn
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    // Loading and error states
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/" })
    }

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
            className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
            data-theme="dark"
        >
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* LOGIN FORM SECTION */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-8 flex items-center justify-start gap-2">
                        <ShipWheelIcon className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            LINGUEX
                        </span>
                    </div>

                    {/* ERROR MESSAGE DISPLAY */}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>
                                {error.response?.data?.message || error.message}
                            </span>
                        </div>
                    )}

                    <div className="w-full">
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                                    <p className="text-sm opacity-70">
                                        Sign in to your account to continue your language journey
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="input input-bordered w-full"
                                            value={loginData.email}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, email: e.target.value })
                                            }
                                            required
                                            disabled={isPending}
                                        />
                                    </div>

                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input input-bordered w-full"
                                            value={loginData.password}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, password: e.target.value })
                                            }
                                            required
                                            disabled={isPending}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>

                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Don&apos;t have an account?{" "}
                                            <Link
                                                href="/sign-up"
                                                className="text-primary hover:underline"
                                            >
                                                Create one
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* IMAGE SECTION */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
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
                                Welcome back to your language journey
                            </h2>
                            <p className="opacity-70">
                                Continue practicing and connecting with language partners
                                worldwide
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
