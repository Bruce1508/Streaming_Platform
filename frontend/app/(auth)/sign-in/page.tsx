"use client";

import { useState } from "react";
import { GraduationCap, Mail, ChevronDown, CheckCircle, AlertCircle, Users } from "lucide-react";
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

    // Enhanced educational email validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        // Educational domains with more comprehensive list
        const eduDomains = [
            // Colleges
            'senecacollege.ca', 'senecapolytechnic.ca', 'myseneca.ca',
            'georgebrown.ca', 'student.georgebrown.ca',
            'humber.ca', 'student.humber.ca',
            'centennialcollege.ca', 'student.centennialcollege.ca',
            'sheridancollege.ca', 'student.sheridancollege.ca',
            
            // Universities
            'torontomu.ca', 'ryerson.ca',
            'yorku.ca', 'student.yorku.ca',
            'utoronto.ca', 'mail.utoronto.ca', 'student.utoronto.ca',
            'queensu.ca', 'student.queensu.ca',
            'umanitoba.ca', 'student.umanitoba.ca',
            'uwaterloo.ca', 'student.uwaterloo.ca',
            'mcmaster.ca', 'student.mcmaster.ca',
            
            // Generic educational domains
            '.edu', '.ac.ca', 'student.', '.student.'
        ];
        
        const normalizedEmail = email.toLowerCase();
        const isEducational = eduDomains.some(domain => 
            normalizedEmail.includes(domain.toLowerCase())
        );

        let institution = '';
        if (isEducational) {
            if (normalizedEmail.includes('seneca')) institution = 'Seneca College';
            else if (normalizedEmail.includes('georgebrown')) institution = 'George Brown College';
            else if (normalizedEmail.includes('humber')) institution = 'Humber College';
            else if (normalizedEmail.includes('centennial')) institution = 'Centennial College';
            else if (normalizedEmail.includes('sheridan')) institution = 'Sheridan College';
            else if (normalizedEmail.includes('torontomu') || normalizedEmail.includes('ryerson')) institution = 'Toronto Metropolitan University';
            else if (normalizedEmail.includes('yorku')) institution = 'York University';
            else if (normalizedEmail.includes('utoronto')) institution = 'University of Toronto';
            else if (normalizedEmail.includes('queensu')) institution = "Queen's University";
            else if (normalizedEmail.includes('umanitoba')) institution = 'University of Manitoba';
            else if (normalizedEmail.includes('uwaterloo')) institution = 'University of Waterloo';
            else if (normalizedEmail.includes('mcmaster')) institution = 'McMaster University';
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
            await signIn("google", { callbackUrl: "/" });
        } catch (error: any) {
            toast.error("Google sign-in failed.");
            setOauthLoading(null);
        }
    };

    const handleMagicLinkSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('🔥 Frontend: Magic link sign-in triggered');
        console.log('📧 Frontend: Email validation state:', emailValidation);
        console.log('📝 Frontend: Email value:', email);
        
        if (!emailValidation.isValid) {
            console.log('❌ Frontend: Email validation failed');
            toast.error("Please enter a valid email address");
            return;
        }

        // ✅ NEW: Only allow magic link for student emails
        if (!emailValidation.isEducational) {
            console.log('❌ Frontend: Non-educational email attempted magic link');
            toast.error("Magic link is only available for student emails. Please use Google sign-in instead.");
            return;
        }

        setIsPending(true);
        console.log('🚀 Frontend: Starting magic link request...');

        try {
            // ✅ UPDATED: Use our custom magic link API instead of NextAuth
            const apiUrl = '/api/auth/send-magic-link';
            console.log('🌐 Frontend: Calling API:', apiUrl);
            
            const requestBody = {
                email: email,
                callbackUrl: '/dashboard',
                baseUrl: window.location.origin
            };
            console.log('📤 Frontend: Request body:', requestBody);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            console.log('📨 Frontend: Response received:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            const data = await response.json();
            console.log('📋 Frontend: Response data:', data);

            if (!response.ok || !data.success) {
                console.log('❌ Frontend: Magic link request failed:', data);
                throw new Error(data.message || 'Failed to send magic link');
            }

            // Show success message
            console.log('✅ Frontend: Magic link sent successfully');
            toast.success("Magic link sent! Check your email inbox.");
            
            // Redirect to verify request page
            // router.push('/auth/verify-request?email=' + encodeURIComponent(email));
            
        } catch (error: any) {
            console.error('💥 Frontend: Magic link error:', error);
            toast.error(error.message || "Failed to send magic link. Please try again.");
        } finally {
            setIsPending(false);
            console.log('🏁 Frontend: Magic link request completed');
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
                        {/* ✅ NEW: Authentication Method Explanation */}
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">Choose your sign-in method:</h3>
                            <div className="space-y-2 text-xs text-blue-700">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    <span><strong>Students:</strong> Use student email for verified status 🎓</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span><strong>Everyone else:</strong> Sign in with Google</span>
                                </div>
                            </div>
                        </div>

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

                        {/* ✅ UPDATED: Student Email Section */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <GraduationCap className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Student Email Sign-in</span>
                            </div>
                            
                            {/* Email Magic Link Form */}
                            <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Enter your student email (e.g., name@senecacollege.ca)"
                                        className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 transition-all ${
                                            email && emailValidation.isValid
                                                ? emailValidation.isEducational
                                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                                                    : 'border-orange-300 focus:border-orange-500 focus:ring-orange-100'
                                                : 'border-gray-300 focus:border-gray-500 focus:ring-gray-100'
                                        }`}
                                        required
                                    />
                                    {email && emailValidation.isValid && emailValidation.isEducational && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </div>
                                    )}
                                    {email && emailValidation.isValid && !emailValidation.isEducational && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <AlertCircle className="w-5 h-5 text-orange-500" />
                                        </div>
                                    )}
                                </div>

                                {/* ✅ UPDATED: Email Status Indicators */}
                                {email && emailValidation.isValid && emailValidation.isEducational && (
                                    <div className="text-left p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                ✨ Student email detected
                                                {emailValidation.institution && ` • ${emailValidation.institution}`}
                                            </span>
                                        </div>
                                        <p className="text-xs text-green-600 mt-1">
                                            You'll get verified student status 🎓 with exclusive access to academic resources.
                                        </p>
                                    </div>
                                )}

                                {email && emailValidation.isValid && !emailValidation.isEducational && (
                                    <div className="text-left p-3 bg-orange-50 border border-orange-200 rounded-xl">
                                        <div className="flex items-center gap-2 text-orange-700">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Not a student email</span>
                                        </div>
                                        <p className="text-xs text-orange-600 mt-1">
                                            Magic link is only for student emails. Please use Google sign-in above or enter your student email.
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending || !emailValidation.isValid || !emailValidation.isEducational}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? "Sending verification link..." : 
                                     emailValidation.isEducational ? "Send student verification link" : 
                                     "Enter student email to continue"}
                                </button>
                            </form>
                        </div>

                        {/* ✅ NEW: Help Text */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                                Don't have a student email? <span className="font-medium">Use Google sign-in above.</span><br/>
                                Need help? <Link href="/help" className="text-blue-600 hover:underline">Contact support</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;