'use client';

import { GraduationCap, Mail, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyRequestPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [maskedEmail, setMaskedEmail] = useState('');

    useEffect(() => {
        if (email) {
            // Mask email for privacy
            const [name, domain] = email.split('@');
            const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
            setMaskedEmail(`${maskedName}@${domain}`);
        }
    }, [email]);

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
                        href="/sign-in" 
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Email Icon */}
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-serif text-gray-900 mb-4">
                            Check your email
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We sent a sign-in link to{' '}
                            <span className="font-medium text-gray-900">
                                {maskedEmail || 'your email'}
                            </span>
                        </p>
                    </div>

                    {/* Instructions Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 text-left">
                        <h2 className="font-semibold text-gray-900 mb-4">Next steps:</h2>
                        <ol className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">1</span>
                                <span>Check your email inbox (and spam folder)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">2</span>
                                <span>Click the "Sign In to StudyHub" button in the email</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">3</span>
                                <span>You'll be automatically signed in to your account</span>
                            </li>
                        </ol>
                    </div>

                    {/* Additional Actions */}
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Didn't receive the email? Check your spam folder or{' '}
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 underline">
                                request a new link
                            </Link>
                        </p>
                        
                        <div className="text-xs text-gray-400">
                            The sign-in link expires in 10 minutes for security
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 