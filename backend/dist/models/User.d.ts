import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    fullName: string;
    email: string;
    password?: string;
    bio: string;
    profilePic: string;
    location: string;
    website: string;
    isOnboarded: boolean;
    friends: mongoose.Types.ObjectId[] | IUser[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    authProvider: "local" | "google" | "github" | "facebook";
    providerId?: string;
    savedMaterials: mongoose.Types.ObjectId[];
    uploadedMaterials: mongoose.Types.ObjectId[];
    studyStats: IStudyStats;
    role: 'student' | 'professor' | 'admin' | 'guest';
    academic?: {
        studentId?: string;
        school?: mongoose.Types.ObjectId;
        program?: mongoose.Types.ObjectId;
        currentSemester?: number;
        enrollmentYear?: number;
        completedCourses: string[];
        status: 'active' | 'graduated' | 'suspended';
    };
    preferences: {
        theme: 'light' | 'dark' | 'system';
        notifications: {
            email: boolean;
            push: boolean;
            newMaterials: boolean;
            courseUpdates: boolean;
        };
        privacy: {
            showProfile: boolean;
            showActivity: boolean;
        };
    };
    activity: {
        loginCount: number;
        uploadCount: number;
        downloadCount: number;
        contributionScore: number;
    };
    isActive: boolean;
    isVerified: boolean;
    verificationStatus: 'unverified' | 'email-verified' | 'edu-verified' | 'manual-verified' | 'non-student';
    verificationMethod: 'none' | 'email-link' | 'edu-domain' | 'edu-pattern' | 'admin-manual' | 'oauth-pending' | 'magic-link';
    hasTemporaryPassword: boolean;
    institutionInfo: {
        name: string;
        domain: string;
        type: 'university' | 'college' | 'polytechnic' | 'institute' | '';
    };
    matchPassword(enteredPassword: string): Promise<boolean>;
    saveMaterial(materialId: mongoose.Types.ObjectId): Promise<IUser>;
    unsaveMaterial(materialId: mongoose.Types.ObjectId): Promise<IUser>;
    generateAuthToken(): string;
    updateLastLogin(): Promise<IUser>;
    incrementUploadCount(): Promise<IUser>;
    incrementDownloadCount(): Promise<IUser>;
    contributionLevel?: string;
    academicInfo?: any;
}
export interface IStudyStats {
    materialsViewed: number;
    materialsSaved: number;
    materialsCreated: number;
    ratingsGiven: number;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map