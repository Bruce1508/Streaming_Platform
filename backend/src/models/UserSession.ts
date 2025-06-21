// models/UserSession.ts - Enhanced version
import mongoose, { Document, Schema } from 'mongoose';

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
    // 🆕 Enhanced fields
    deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    loginMethod?: 'password' | 'oauth';
    
    // Instance methods
    updateActivity(): Promise<void>;
    deactivate(): Promise<void>;
}

const userSessionSchema = new Schema<IUserSession>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    lastActivity: {
        type: Date,
        default: Date.now,
        index: true
    },
    location: {
        country: String,
        city: String,
        timezone: String
    },
    deviceType: {
        type: String,
        enum: ['mobile', 'tablet', 'desktop', 'unknown'],
        default: 'unknown'
    },
    loginMethod: {
        type: String,
        enum: ['password', 'oauth'],
        default: 'password'
    }
}, {
    timestamps: true
});

// 🆕 Compound indexes for better performance
userSessionSchema.index({ userId: 1, isActive: 1 });
userSessionSchema.index({ userId: 1, lastActivity: -1 });
userSessionSchema.index({ sessionId: 1, isActive: 1 });

// TTL index - sessions expire after 30 days of inactivity
userSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// 🆕 Instance methods
userSessionSchema.methods.updateActivity = async function(): Promise<void> {
    this.lastActivity = new Date();
    await this.save();
};

userSessionSchema.methods.deactivate = async function(): Promise<void> {
    this.isActive = false;
    await this.save();
};

// 🆕 Static methods
userSessionSchema.statics.findActiveSessions = function(userId: string) {
    return this.find({ 
        userId: new mongoose.Types.ObjectId(userId), 
        isActive: true 
    }).sort({ lastActivity: -1 });
};

userSessionSchema.statics.deactivateOldestSession = async function(userId: string) {
    const oldestSession = await this.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true
    }).sort({ lastActivity: 1 });
    
    if (oldestSession) {
        await oldestSession.deactivate();
    }
    return oldestSession;
};

export const UserSession = mongoose.model<IUserSession>('UserSession', userSessionSchema);