export interface FriendRequest {
    _id: string;
    sender: User;
    recipient: User;
    status: string;
    createdAt: string;
}

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

export interface Friend {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    lastSeen?: Date;
    isOnline?: boolean;
}
