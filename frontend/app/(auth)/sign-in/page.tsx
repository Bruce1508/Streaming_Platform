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
        <div className="min-h-screen flex items-center justify-center p-4" data-theme="dark">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-2xl overflow-hidden">
                <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
                    <div className="mb-8 flex items-center justify-start gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ShipWheelIcon className="size-8 text-primary" />
                        </div>
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            StudyBuddy
                        </span>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="w-full space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold">Welcome Back</h2>
                            <p className="text-base opacity-70 mt-2">
                                Sign in to access your study materials
                            </p>
                        </div>

                        <div className="space-y-3">
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
                        </div>

                        {hasGoogleAuth && (
                            <div className="divider text-sm">OR CONTINUE WITH EMAIL</div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-4">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="student@myseneca.ca"
                                        className="input input-bordered w-full"
                                        value={loginData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isPending || !!oauthLoading}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="input input-bordered w-full"
                                        value={loginData.password}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isPending || !!oauthLoading}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={isPending || !!oauthLoading}
                                className="btn btn-primary w-full mt-6"
                            >
                                {isPending ? (
                                    <span className="loading loading-spinner"></span>
                                ) : "Sign In"}
                            </button>
                        </form>
                        <p className="text-center text-sm mt-4">
                            Don&apos;t have an account?{" "}
                            <Link href="/sign-up" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/5 to-secondary/5 items-center justify-center p-12">
                    <Image
                        src="/globe.svg" 
                        alt="StudyBuddy Branding"
                        width={400}
                        height={400}
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;