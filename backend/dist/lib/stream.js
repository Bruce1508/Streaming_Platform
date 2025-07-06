"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStreamToken = exports.upsertStreamUser = void 0;
const stream_chat_1 = require("stream-chat");
require("dotenv/config");
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
const streamClient = stream_chat_1.StreamChat.getInstance(apiKey, apiSecret);
const upsertStreamUser = (user_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!user_data.id) {
            throw new Error("User ID is required");
        }
        console.log('👤 Upserting Stream user:', user_data.id);
        yield streamClient.upsertUsers([user_data]);
        return user_data;
    }
    catch (error) {
        console.error("❌ Error upserting Stream user:", error);
        return undefined;
    }
});
exports.upsertStreamUser = upsertStreamUser;
const generateStreamToken = (userId) => {
    try {
        console.log('🔑 Generating Stream token for:', userId);
        if (!userId) {
            throw new Error("User ID is required");
        }
        const token = streamClient.createToken(userId);
        console.log('✅ Token generated successfully');
        return token;
    }
    catch (error) {
        console.error("❌ Error generating Stream token:", error);
        return undefined;
    }
};
exports.generateStreamToken = generateStreamToken;
//# sourceMappingURL=stream.js.map