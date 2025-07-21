import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        console.log('🔥 Frontend: email callback route called');
        
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        console.log('📧 Frontend: Callback params received:', {
            token: token ? `${token.substring(0, 10)}...` : 'null',
            email,
            fullUrl: request.url
        });

        if (!token || !email) {
            console.log('❌ Frontend: Missing token or email in callback');
            return NextResponse.redirect(new URL('/auth/signin?error=invalid_link', request.url));
        }

        // Verify magic link with backend
        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/magic-link-verify`;
        console.log('🌐 Frontend: Calling backend verification URL:', backendUrl);
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                token: token
            })
        });

        console.log('📨 Frontend: Backend verification response status:', response.status);
        
        const data = await response.json();
        console.log('📋 Frontend: Backend verification response data:', data);

        if (!response.ok || !data.success) {
            console.log('❌ Frontend: Backend verification failed:', data);
            return NextResponse.redirect(new URL('/auth/signin?error=verification_failed', request.url));
        }

        console.log('✅ Frontend: Magic link verified successfully');
        
        // Create session data for the create-session page
        const sessionData = {
            user: data.user,
            token: data.token || data.sessionToken, // ✅ Use token from backend
            verified: true,
            timestamp: Date.now() // ✅ Add timestamp for expiry
        };

        // Encode session data
        const encodedSessionData = btoa(JSON.stringify(sessionData));
        console.log('🔄 Frontend: Redirecting to create-session with encoded data');

        // Redirect to create-session page with encoded data
        return NextResponse.redirect(
            new URL(`/auth/create-session?data=${encodedSessionData}`, request.url)
        );

    } catch (error) {
        console.error('💥 Frontend: Email callback error:', error);
        return NextResponse.redirect(new URL('/auth/signin?error=callback_error', request.url));
    }
} 