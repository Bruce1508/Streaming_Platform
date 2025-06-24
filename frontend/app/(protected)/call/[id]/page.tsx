'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getStreamToken } from "@/lib/api";
import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    StreamTheme,
    CallingState,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import PageLoader from "@/components/ui/PageLoader";

// Import Stream Video CSS
import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function CallPage() {
    const params = useParams();
    const callId = params.id as string;
    const router = useRouter();

    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<any>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [tokenData, setTokenData] = useState<any>(null);

    const { data: session, status } = useSession();
    const authUser = session?.user;

    // Fetch Stream token
    useEffect(() => {
        if (!authUser || !STREAM_API_KEY) return;

        const fetchToken = async () => {
            try {
                console.log('🔑 Fetching Stream token for video call...');
                const response = await getStreamToken();
                setTokenData(response);
                console.log('✅ Stream token received for video');
            } catch (error) {
                console.error('❌ Error fetching video token:', error);
                toast.error('Failed to get video token');
                setIsConnecting(false);
            }
        };

        fetchToken();
    }, [authUser]);

    // Initialize video call
    useEffect(() => {
        const initCall = async () => {
            if (!tokenData?.token || !authUser || !callId || !STREAM_API_KEY) {
                console.log('⏳ Waiting for video call dependencies...', {
                    hasToken: !!tokenData?.token,
                    hasAuthUser: !!authUser,
                    hasCallId: !!callId,
                    hasApiKey: !!STREAM_API_KEY
                });
                return;
            }

            try {
                console.log("🎥 Initializing Stream video client...");

                const user = {
                    id: authUser.id,
                    name: authUser.name ?? 'Anonymous User',
                    image: authUser.image ?? undefined,
                };

                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token,
                });

                console.log('📞 Creating call instance:', callId);
                const callInstance = videoClient.call("default", callId);

                console.log('🔄 Joining call...');
                await callInstance.join({ create: true });

                console.log('✅ Joined call successfully');
                toast.success('Connected to video call!');

                setClient(videoClient);
                setCall(callInstance);
            } catch (error) {
                console.error("❌ Error joining call:", error);
                toast.error("Could not join the call. Please try again.");

                // Redirect back after error
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } finally {
                setIsConnecting(false);
            }
        };

        initCall();

        // Cleanup function
        return () => {
            if (call) {
                console.log('🧹 Leaving call...');
                call.leave();
            }
            if (client) {
                console.log('🧹 Disconnecting video client...');
                client.disconnectUser();
            }
        };
    }, [tokenData, authUser, callId, router]);

    // Loading states
    if (status === 'loading' || isConnecting) {
        return <PageLoader />;
    }

    // Error state
    if (!STREAM_API_KEY) {
        return (
            <div className="h-screen flex items-center justify-center bg-base-100">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Configuration Error</h2>
                    <p className="text-base-content opacity-70 mb-4">
                        Stream API key is not configured for video calls
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="btn btn-primary"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    // Call interface
    return (
        <div className="h-screen w-screen bg-black relative overflow-hidden">
            {client && call ? (
                <StreamVideo client={client}>
                    <StreamCall call={call}>
                        <CallContent />
                    </StreamCall>
                </StreamVideo>
            ) : (
                <div className="h-full flex items-center justify-center text-white">
                    <div className="text-center">
                        <div className="loading loading-spinner loading-lg mb-4"></div>
                        <p className="text-lg">Could not initialize call</p>
                        <p className="text-sm opacity-70 mb-4">Please refresh or try again later</p>
                        <button
                            onClick={() => router.push('/')}
                            className="btn btn-outline btn-sm"
                        >
                            Go Back Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Call Content Component
const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const router = useRouter();

    // Handle call end
    useEffect(() => {
        if (callingState === CallingState.LEFT) {
            console.log('📞 Call ended, redirecting home...');
            toast.success('Call ended');
            router.push('/');
        }
    }, [callingState, router]);

    if (callingState === CallingState.LEFT) {
        return (
            <div className="h-screen flex items-center justify-center bg-base-100">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Call Ended</h2>
                    <p className="text-base-content opacity-70 mb-4">
                        Redirecting you back...
                    </p>
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <StreamTheme className="h-full">
            <div className="relative h-full">
                <SpeakerLayout />
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <CallControls />
                </div>
            </div>
        </StreamTheme>
    );
};