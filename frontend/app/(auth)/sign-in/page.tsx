"use client";

import { useState } from "react";
import { GraduationCap, Mail, ChevronDown, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const LoginPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);
    const [emailValidation, setEmailValidation] = useState<{
        isValid: boolean;
        isEducational: boolean;
        institution?: string;
    }>({ isValid: false, isEducational: false });

    const hasGoogleAuth = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Educational email validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        // Educational domains
        const eduDomains = [
            'senecacollege.ca', 'senecapolytechnic.ca', 'georgebrown.ca', 
            'humber.ca', 'centennialcollege.ca', 'torontomu.ca', 'yorku.ca',
            'utoronto.ca', 'queensu.ca', '.edu', '.ac.ca'
        ];
        
        const isEducational = eduDomains.some(domain => 
            email.toLowerCase().includes(domain)
        );

        let institution = '';
        if (isEducational) {
            if (email.includes('seneca')) institution = 'Seneca College';
            else if (email.includes('georgebrown')) institution = 'George Brown College';
            else if (email.includes('humber')) institution = 'Humber College';
            else if (email.includes('centennial')) institution = 'Centennial College';
            else if (email.includes('torontomu')) institution = 'Toronto Metropolitan University';
            else if (email.includes('yorku')) institution = 'York University';
            else if (email.includes('utoronto')) institution = 'University of Toronto';
            else if (email.includes('queensu')) institution = "Queen's University";
            else institution = 'Educational Institution';
        }

        setEmailValidation({ isValid, isEducational, institution });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        if (emailValue) validateEmail(emailValue);
        else setEmailValidation({ isValid: false, isEducational: false });
    };

    const handleGoogleSignIn = async () => {
        setOauthLoading('google');
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (error: any) {
            toast.error("Google sign-in failed.");
            setOauthLoading(null);
        }
    };

    const handleMagicLinkSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailValidation.isValid) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsPending(true);

        try {
            await signIn('email', { 
                email: email,
                callbackUrl: '/dashboard',
                redirect: false
            });
            
            // Redirect to verify request page
            router.push(`/auth/verify-request?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            toast.error("Failed to send magic link. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col">
            {/* Header */}
            <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <GraduationCap className="w-8 h-8 text-gray-800" />
                        <span className="text-xl font-bold text-gray-800">StudyHub</span>
                    </Link>
                    <Link 
                        href="/help" 
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Need help? <span className="font-semibold underline">Contact support</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Branding */}
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-serif text-gray-900 mb-4">
                            Your ideas,<br />
                            amplified
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Privacy-first platform that helps you learn in confidence.
                        </p>
                    </div>

                    {/* Sign In Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                        {/* Google Button */}
                        {hasGoogleAuth && (
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={oauthLoading === 'google'}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 mb-6"
                            >
                                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded"></div>
                                <span className="text-gray-700 font-medium">
                                    {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
                                </span>
                            </button>
                        )}

                        {/* Divider */}
                        <div className="flex items-center mb-6">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <span className="px-4 text-sm text-gray-500 bg-white">OR</span>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        {/* Email Magic Link Form */}
                        <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                                                         placeholder="Enter your email to continue"
                                    className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all ${
                                        email && emailValidation.isValid
                                            ? emailValidation.isEducational
                                                ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                                                : 'border-gray-300 focus:border-gray-500 focus:ring-gray-100'
                                            : 'border-gray-300 focus:border-gray-500 focus:ring-gray-100'
                                    }`}
                                    required
                                />
                                {email && emailValidation.isValid && emailValidation.isEducational && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                )}
                            </div>

                            {/* Educational Email Indicator */}
                            {email && emailValidation.isValid && emailValidation.isEducational && (
                                <div className="text-left p-3 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <CheckCircle className="w-4 h-4" />
                                                                                 <span className="text-sm font-medium">
                                             ✨ Student email verified
                                             {emailValidation.institution && ` • ${emailValidation.institution}`}
                                         </span>
                                     </div>
                                     <p className="text-xs text-green-600 mt-1">
                                         You'll get verified student status with exclusive access to academic resources.
                                     </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isPending || !emailValidation.isValid}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Sending link..." : "Continue with email"}
                            </button>
                        </form>
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default LoginPage;