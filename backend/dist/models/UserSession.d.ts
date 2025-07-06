import mongoose, { Document } from 'mongoose';
interface IUserSession extends Document {
    userId: mongoose.Types.ObjectId;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    isActive: boolean;
    lastActivity: Date;
    createdAt: Date;
    expiresAt: Date;
    location?: {
        country?: string;
        city?: string;
        timezone?: string;
    };
    deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    loginMethod?: 'password' | 'oauth';
    updateActivity(): Promise<void>;
    deactivate(): Promise<void>;
}
export declare const UserSession: mongoose.Model<IUserSession, {}, {}, {}, mongoose.Document<unknown, {}, IUserSession, {}> & IUserSession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=UserSession.d.ts.map