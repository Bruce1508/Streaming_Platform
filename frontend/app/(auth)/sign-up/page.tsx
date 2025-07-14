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
    const [formValues, setFormValues] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });
    const router = useRouter();

    const hasGoogleAuth = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const handleGoogleSignUp = async () => {
        setOauthLoading('google');
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (error: any) {
            toast.error("Failed to sign up with Google");
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
        const termsAccepted = !!formData.get('terms');

        // Client-side validation
        const newErrors: Errors = {};
        let passwordError = false;
        if (!fullName) newErrors.fullName = 'Full name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!password) { newErrors.password = 'Password is required'; passwordError = true; }
        if (password && password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; passwordError = true; }
        if (password !== confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; passwordError = true; }
        if (!termsAccepted) newErrors.terms = 'You must accept the terms';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            if (passwordError) {
                setFormValues({ fullName: '', email: '', password: '', confirmPassword: '', terms: false });
            }
            return;
        }

        try {
            const result = await signUp({ fullName, email, password, terms: termsAccepted });

            if (result.success) {
                toast.success("Account created successfully!");

                const signInResult = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (signInResult?.ok) {
                    toast.success("Welcome! Let's get started...");
                    router.push('/');
                } else {
                    toast.error("Account created but sign-in failed. Please try signing in manually.");
                    router.push('/');
                }
            } else {
                toast.error(result.message || "Registration failed");
                if (result.message?.includes('email')) {
                    setErrors({ email: result.message });
                }
            }
        } catch (error: any) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex">
            {/* LEFT SIDE - FORM */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16 xl:px-20">
                {/* LOGO */}
                {/* <div className="mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                            <ShipWheelIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">StudyBuddy</span>
                    </div>
                </div> */}

                {/* FORM */}
                <div className="w-full max-w-sm">
                    <h1 className="text-3xl font-bold text-white mb-2">Sign up for an account</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {/* FULL NAME */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading || oauthLoading !== null}
                                value={formValues.fullName}
                                onChange={(e) => setFormValues({ ...formValues, fullName: e.target.value })}
                            />
                            {errors.fullName && (
                                <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="hello@johndoe.com"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading || oauthLoading !== null}
                                value={formValues.email}
                                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading || oauthLoading !== null}
                                value={formValues.password}
                                onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading || oauthLoading !== null}
                                value={formValues.confirmPassword}
                                onChange={(e) => setFormValues({ ...formValues, confirmPassword: e.target.value })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* TERMS CHECKBOX */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="terms"
                                className="w-4 h-4 mt-1 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
                                disabled={isLoading || oauthLoading !== null}
                                checked={formValues.terms}
                                onChange={(e) => setFormValues({ ...formValues, terms: e.target.checked })}
                            />
                            <label className="text-sm text-gray-300">
                                I agree to the{" "}
                                <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-red-400 text-sm">{errors.terms}</p>
                        )}

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-white text-slate-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || oauthLoading !== null}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    {/* SIGN IN LINK */}
                    <p className="text-center text-gray-400 mt-8">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </Link>
                    </p>

                    {/* DIVIDER */}
                    {hasGoogleAuth && (
                        <div className="flex items-center my-8">
                            <div className="flex-1 border-t border-slate-700"></div>
                            <span className="px-4 text-sm text-gray-400">Or continue with</span>
                            <div className="flex-1 border-t border-slate-700"></div>
                        </div>
                    )}

                    {/* OAUTH BUTTONS */}
                    {hasGoogleAuth && (
                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            disabled={oauthLoading === 'google' || isLoading}
                            className="w-full bg-slate-800 border border-slate-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {oauthLoading === 'google' ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            Continue with Google
                        </button>
                    )}

                    <div className="mt-8 text-xs text-gray-500 text-center">
                        By clicking on sign up, you agree to our{" "}
                        <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - COMMUNITY SECTION */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center px-16 xl:px-20 relative">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
                
                <div className="relative z-10 text-center max-w-md">
                    {/* SCHOOL LOGOS */}
                    <div className="flex justify-center mb-8">
                        <div className="flex -space-x-3">
                            <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-white flex items-center justify-center">
                                <Image 
                                    src="/Seneca-logo.svg" 
                                    alt="Seneca College" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-white flex items-center justify-center">
                                <Image 
                                    src="/centennial.png" 
                                    alt="Centennial College" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-white flex items-center justify-center">
                                <Image 
                                    src="/George_Brown_College_logo.svg" 
                                    alt="George Brown College" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-white flex items-center justify-center">
                                <Image 
                                    src="/Humber_College_logo.svg" 
                                    alt="Humber College" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-white flex items-center justify-center">
                                <Image 
                                    src="/Logo_York_University.svg" 
                                    alt="York University" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-white flex items-center justify-center">
                                <Image 
                                    src="/TMU_logo.svg" 
                                    alt="Toronto Metropolitan University" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* HEADING */}
                    <h2 className="text-2xl font-bold text-white mb-6">People love us</h2>

                    {/* DESCRIPTION */}
                    <p className="text-gray-300 text-lg leading-relaxed">
                        StudyBuddy is loved by thousands of students in Canada. 
                        Be part of the community and join us in transforming how we learn together.
                    </p>

                    {/* STATS */}
                    <div className="mt-12 grid grid-cols-2 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">10K+</div>
                            <div className="text-sm text-gray-400">Active Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">50K+</div>
                            <div className="text-sm text-gray-400">Study Materials</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}