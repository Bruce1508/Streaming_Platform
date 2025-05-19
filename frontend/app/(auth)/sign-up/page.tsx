'use client';

import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signUp } from "@/app/actions/auth";
import SubmitButton from "@/components/ui/submitButton";
import { useActionState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function SignUpPage() {

    const initialState = {
        success: false,
        message: null,
        errors: {}
    };

    const router = useRouter();
    const queryClient = useQueryClient();

    //state chứa kết quả từ server action còn formAction gán vào action của form
    const [state, formAction] = useActionState(signUp, initialState);

    useEffect(() => {
        if (state.success) {
            // Đánh dấu vừa đăng ký thành công trong sessionStorage
            sessionStorage.setItem('justSignedUp', 'true');
            
            toast.success(state.message || "Registration successful!");
            queryClient.invalidateQueries({ queryKey: ['authUser'] });

            const timer = setTimeout(() => {
                router.push('/');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [state.success, state.message, router, queryClient]);

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="dark">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* SIGNUP FORM - LEFT SIDE */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <ShipWheelIcon className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            STREAMIFY
                        </span>
                    </div>

                    {/* ERROR MESSAGE IF ANY */}
                    {state.message && !state.success && (
                        <div className="alert alert-error mb-4">
                            <span>{state.message}</span>
                        </div>
                    )}

                    {/* SUCCESS MESSAGE */}
                    {state.success && (
                        <div className="alert alert-success mb-4">
                            <span>{state.message}</span>
                        </div>
                    )}

                    <div className="w-full">
                        <form action={formAction}>
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
                                            required
                                        />
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
                                            required
                                        />
                                    </fieldset>
                                    {/* PASSWORD */}
                                    <fieldset className="form-control w-full fieldset">
                                        <label className="label">
                                            <legend className=" fieldset-legend text-sm font-medium text-gray-600">Password</legend>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="********"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                        <p className="text-xs opacity-70 mt-1">
                                            Password must be at least 6 characters long
                                        </p>
                                    </fieldset>

                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input type="checkbox" name="terms" className="checkbox checkbox-sm" required />
                                            <span className="text-xs leading-tight">
                                                I agree to the{" "}
                                                <span className="text-primary hover:underline">terms of service</span> and{" "}
                                                <span className="text-primary hover:underline">privacy policy</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <SubmitButton text="Create Account" loadingText="Loading..." />

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Already have an account?{" "}
                                        <Link href="/login" className="text-primary hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* SIGNUP FORM - RIGHT SIDE */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
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