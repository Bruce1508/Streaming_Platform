'use client';

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { StreamChat } from 'stream-chat'
import { useSession } from 'next-auth/react';
import { getStreamToken } from '@/lib/api';
import toast from 'react-hot-toast';
import ChatLoader from '@/components/ui/ChatLoader';
import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import CallButton from '@/components/ui/CallButton';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
console.log('🔧 Environment check:', {
    STREAM_API_KEY: STREAM_API_KEY,
    hasApiKey: !!STREAM_API_KEY,
    allEnvVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
});

const ChatPage = () => {
    const params = useParams();
    const targetUserId = params.id as string;

    const [chatClient, setChatClient] = useState<StreamChat | null>(null);
    const [channel, setChannel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tokenData, setTokenData] = useState<any>(null);

    const { data: session } = useSession();
    const authUser = session?.user;

    useEffect(() => {
        const fetchToken = async () => {
            if (!authUser) return;

            try {
                console.log('🔑 Fetching Stream token...');
                const response = await getStreamToken();
                setTokenData(response);
                console.log('✅ Stream token received');
            } catch (error) {
                console.error('❌ Error fetching token:', error);
                toast.error('Failed to get chat token');
            }
        };

        fetchToken();
    }, [authUser]);

    // Initialize chat client and channel
    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser || !STREAM_API_KEY) {
                console.log('⏳ Waiting for dependencies...', {
                    hasToken: !!tokenData?.token,
                    hasAuthUser: !!authUser,
                    hasApiKey: !!STREAM_API_KEY
                });
                return;
            }

            try {
                console.log("🚀 Initializing stream chat client...");

                // Create Stream client
                const client = StreamChat.getInstance(STREAM_API_KEY);

                // Connect user
                await client.connectUser(
                    {
                        id: authUser.id,
                        name: authUser.name ?? 'Anonymous User',
                        image: authUser.image ?? undefined,
                    },
                    tokenData.token
                );

                console.log('👤 User connected to Stream');

                // Create channel ID (consistent regardless of who starts chat)
                const channelId = [authUser.id, targetUserId].sort().join("-");
                console.log('💬 Channel ID:', channelId);

                // Create/get channel
                const currChannel = client.channel("messaging", channelId, {
                    members: [authUser.id, targetUserId],
                });

                await currChannel.watch();
                console.log('👀 Channel watching started');

                setChatClient(client);
                setChannel(currChannel);
            } catch (error) {
                console.error("❌ Error initializing chat:", error);
                toast.error("Could not connect to chat. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        initChat();

        // Cleanup function
        return () => {
            if (chatClient) {
                console.log('🧹 Cleaning up chat client...');
                chatClient.disconnectUser();
            }
        };
    }, [tokenData, authUser, targetUserId, chatClient]);

    const handleVideoCall = () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;

            // Send message in chat
            channel.sendMessage({
                text: `🎥 I've started a video call. Join me here: ${callUrl}`,
            });

            // Immediately join the call
            window.open(callUrl, '_blank');

            toast.success("Video call started!");
        }
    };

    // Loading state
    if (loading || !chatClient || !channel) {
        return <ChatLoader />;
    }

    // Error state
    if (!STREAM_API_KEY) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Configuration Error</h2>
                    <p className="text-base-content opacity-70">
                        Stream API key is not configured
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)]"> {/* Adjust height for navbar */}
            <Chat client={chatClient}>
                <Channel channel={channel}>
                    <div className="w-full relative h-full">
                        <CallButton handleVideoCall={handleVideoCall} />
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput focus />
                        </Window>
                    </div>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
}

export default ChatPage