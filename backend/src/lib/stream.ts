import { StreamChat, User } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

//Instance này sẽ được dùng để tương tác với API của Stream Chat
const streamClient = StreamChat.getInstance(apiKey!, apiSecret!);

//tạo mới hoặc cập nhật thông tin người dùng trong system
export const upsertStreamUser = async (user_data: User): Promise<User | undefined> => {
    try {
        // Đảm bảo userData có trường id - bắt buốc
        if (!user_data.id) {
            throw new Error("User ID is required");
        }
        //Phương thức upsertUsers (số nhiều) nhận một mảng, trong khi upsertUser (số ít) nhận một đối tượng user.
        await streamClient.upsertUsers([user_data]);
        return user_data;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
        return undefined;
    }
};

//tạo token xác thực cho người dùng để họ có thể kết nối với streamChat từ phía client
export const generateStreamToken = (userId: string): string | undefined => {
    try {
        return streamClient.createToken(userId);
    } catch (error) {
        console.error("Error generating Stream token:", error);
        return undefined;
    }
};
