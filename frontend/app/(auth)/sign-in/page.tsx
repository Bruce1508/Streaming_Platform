"use client";

import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const LoginPage = () => {
    const router = useRouter();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [isPending, setIsPending] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const hasGoogleAuth = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const handleGoogleSignIn = async () => {
        setOauthLoading('google');
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (error: any) {
            toast.error("Đăng nhập với Google thất bại.");
            setOauthLoading(null);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: loginData.email,
                password: loginData.password,
            });

            if (result?.ok) {
                toast.success("Chào mừng bạn đã quay trở lại!");
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(result?.error || "Email hoặc mật khẩu không hợp lệ.");
                toast.error(result?.error || "Đăng nhập thất bại.");
            }
        } catch (err: any) {
            setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsPending(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
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
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-gray-400 mb-8">Sign in to access your study materials</p>

                    {error && (
                        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* OAuth Buttons */}
                    {hasGoogleAuth && (
                        <div className="space-y-4 mb-8">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={oauthLoading === 'google' || isPending}
                                className="w-full bg-slate-800 border border-slate-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {oauthLoading === 'google' ? (
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                )}
                                Continue with Google
                            </button>
                        </div>
                    )}

                    {/* DIVIDER */}
                    {hasGoogleAuth && (
                        <div className="flex items-center my-8">
                            <div className="flex-1 border-t border-slate-700"></div>
                            <span className="px-4 text-sm text-gray-400">Or continue with email</span>
                            <div className="flex-1 border-t border-slate-700"></div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="student@myseneca.ca"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={loginData.email}
                                onChange={handleInputChange}
                                required
                                disabled={isPending || !!oauthLoading}
                            />
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
                                value={loginData.password}
                                onChange={handleInputChange}
                                required
                                disabled={isPending || !!oauthLoading}
                            />
                        </div>

                        {/* FORGOT PASSWORD */}
                        <div className="flex items-center justify-between">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isPending || !!oauthLoading}
                            className="w-full bg-white text-slate-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </div>
                            ) : "Sign In"}
                        </button>
                    </form>

                    {/* SIGN UP LINK */}
                    <p className="text-center text-gray-400 mt-8">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign up
                        </Link>
                    </p>
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
                    <h2 className="text-2xl font-bold text-white mb-6">Welcome back!</h2>

                    {/* DESCRIPTION */}
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Continue your learning journey with StudyBuddy. 
                        Access your saved materials and connect with your study community.
                    </p>

                    {/* STATS */}
                    <div className="mt-12 grid grid-cols-2 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">24/7</div>
                            <div className="text-sm text-gray-400">Study Support</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">100+</div>
                            <div className="text-sm text-gray-400">Programs</div>
                        </div>
                    </div>

                    {/* FEATURES */}
                    <div className="mt-8 space-y-3 text-left">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Access your personalized dashboard</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Continue where you left off</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Connect with study partners</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;