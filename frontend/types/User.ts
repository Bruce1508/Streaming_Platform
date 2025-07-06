export interface User {
    _id: string;
    fullName: string;
    username?: string;
    avatar?: string;
    profilePic?: string;
    nativeLanguage: string;
    learningLanguage: string;
    location?: string;
    email: string;
}

export interface FilterOptions {
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
}

