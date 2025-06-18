export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    user?: T;
    token?: string;
}

export interface User {
    _id: string;
    fullName: string;
    username?: string;
    avatar?: string;
    nativeLanguage: string;
    learningLanguage: string;
    location?: string;
    email: string;
}

export interface SignupData {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface OnboardingData {
    fullName: string;
    bio: string;
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
    profilePic: string;
}