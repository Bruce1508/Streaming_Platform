"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { GraduationCap, CheckCircle, Loader2 } from 'lucide-react';

export default function CreateSessionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Creating your session...');

    useEffect(() => {
        const createSession = async () => {
            try {
                const encodedData = searchParams.get('data');
                const callbackUrl = searchParams.get('callbackUrl') || '/';

                if (!encodedData) {
                    throw new Error('Invalid session data');
                }

                // Decode session data
                const sessionData = JSON.parse(Buffer.from(encodedData, 'base64').toString());
                
                // Validate timestamp (expire after 5 minutes)
                if (Date.now() - sessionData.timestamp > 5 * 60 * 1000) {
                    throw new Error('Session link expired');
                }

                const { user, token } = sessionData;

                console.log('🎓 Creating session for verified student:', user.email);

                // ✅ Create NextAuth session for magic link user
                try {
                    console.log('🔄 Creating session for magic link user...');
                    
                    // Use credentials provider to create NextAuth session
                    const result = await signIn('magic-link', {
                        redirect: false,
                        email: user.email,
                        userData: JSON.stringify(user),
                        accessToken: token
                    });

                    if (result?.error) {
                        console.error('❌ NextAuth session creation failed:', result.error);
                        throw new Error('Failed to create session');
                    }

                    console.log('✅ Magic link session created successfully');
                } catch (sessionError) {
                    console.error('❌ Session creation error:', sessionError);
                    // Fallback: set localStorage for temporary access
                    localStorage.setItem('temp_user_data', JSON.stringify({
                        user,
                        token,
                        verificationStatus: user.verificationStatus,
                        isVerified: user.isVerified,
                        institutionInfo: user.institutionInfo
                    }));
                }

                setStatus('success');
                setMessage(`Welcome back, ${user.fullName}! 🎓`);

                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    router.push(callbackUrl);
                }, 2000);

            } catch (error: any) {
                console.error('❌ Session creation error:', error);
                setStatus('error');
                setMessage(error.message || 'Failed to create session');
                
                // Redirect to sign-in after error
                setTimeout(() => {
                    router.push('/sign-in?error=session_creation_failed');
                }, 3000);
            }
        };

        createSession();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        {status === 'loading' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
                        {status === 'success' && <CheckCircle className="w-8 h-8 text-white" />}
                        {status === 'error' && <GraduationCap className="w-8 h-8 text-white" />}
                    </div>

                    {/* Message */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {status === 'loading' && 'Setting up your account...'}
                        {status === 'success' && 'Welcome back! 🎓'}
                        {status === 'error' && 'Something went wrong'}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>

                    {/* Status indicator */}
                    {status === 'loading' && (
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Please wait...</span>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-green-600 text-sm">
                            Redirecting to your dashboard...
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-red-600 text-sm">
                            Redirecting to sign-in page...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 