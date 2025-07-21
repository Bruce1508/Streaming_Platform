import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        console.log('🔥 Frontend: send-magic-link route called');
        
        const { email, callbackUrl, baseUrl } = await request.json();
        
        console.log('📧 Frontend: Request data received:', {
            email,
            callbackUrl,
            baseUrl,
            env_api_url: process.env.NEXT_PUBLIC_API_URL
        });

        // Forward the request to our backend
        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/send-magic-link`;
        console.log('🌐 Frontend: Calling backend URL:', backendUrl);
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                callbackUrl,
                baseUrl
            }),
        });

        console.log('📨 Frontend: Backend response status:', response.status);
        
        const data = await response.json();
        console.log('📋 Frontend: Backend response data:', data);

        if (!response.ok) {
            console.log('❌ Frontend: Backend returned error:', data);
            return NextResponse.json(
                { success: false, message: data.message || 'Failed to send magic link' },
                { status: response.status }
            );
        }

        console.log('✅ Frontend: Successfully forwarded to backend');
        return NextResponse.json(data);
    } catch (error) {
        console.error('💥 Frontend: Send magic link error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 