// lib/api.ts
import { axiosInstance } from "./axios";

// Định nghĩa các interfaces
interface SignupData {
    fullName: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface UserData {
    fullName?: string;
    bio?: string;
    nativeLanguage?: string;
    learningLanguage?: string;
    location?: string;
    profilePic?: string;
    [key: string]: any;
}

interface AuthResponse {
    success: boolean;
    message?: string;
    user?: {
        _id: string;
        fullName: string;
        email: string;
        profilePic: string;
        isOnboarded: boolean;
        [key: string]: any;
    };
    [key: string]: any;
}

// Authentication APIs
export const signup = async (signupData: SignupData): Promise<AuthResponse> => {
    try {
        console.log("Sending signup data:", signupData);
        const response = await axiosInstance.post("auth/sign-up", signupData);
        console.log("Signup response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Signup error:", error);
        console.error("Error response:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to sign up'
        };
    }
};

export const login = async (loginData: LoginData): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post("/auth/login", loginData);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to sign in'
        };
    }

};

export const logout = async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

export const getAuthUser = async (): Promise<AuthResponse | null> => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null;
    }
};

export const completeOnboarding = async (userData: UserData): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
};

// User and Friends APIs
export async function getUserFriends() {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
}

export async function getRecommendedUsers() {
    const response = await axiosInstance.get("/users");
    return response.data;
}

export async function getOutgoingFriendReqs() {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}

export async function sendFriendRequest(userId: string) {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export async function getFriendRequests() {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
}

export async function acceptFriendRequest(requestId: string) {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data;
}

// Chat APIs
export async function getStreamToken() {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
}