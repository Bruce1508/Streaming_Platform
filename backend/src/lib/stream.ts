import { StreamChat, User } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

console.log('🔧 Stream config:', {
    hasApiKey: !!apiKey,
    hasApiSecret: !!apiSecret
});

if (!apiKey || !apiSecret) {
    console.error("❌ Stream API key or Secret is missing");
    throw new Error("Stream configuration is incomplete");
}

const streamClient = StreamChat.getInstance(apiKey!, apiSecret!);

export const upsertStreamUser = async (user_data: User): Promise<User | undefined> => {
    try {
        if (!user_data.id) {
            throw new Error("User ID is required");
        }
        
        console.log('👤 Upserting Stream user:', user_data.id);
        await streamClient.upsertUsers([user_data]);
        return user_data;
    } catch (error) {
        console.error("❌ Error upserting Stream user:", error);
        return undefined;
    }
};

export const generateStreamToken = (userId: string): string | undefined => {
    try {
        console.log('🔑 Generating Stream token for:', userId);
        
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        const token = streamClient.createToken(userId);
        console.log('✅ Token generated successfully');
        return token;
    } catch (error) {
        console.error("❌ Error generating Stream token:", error);
        return undefined;
    }
};