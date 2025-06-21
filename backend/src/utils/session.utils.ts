// utils/session.utils.ts - Session helper functions
import { randomBytes } from 'crypto';
import { UserSession } from '../models/UserSession';
import { Request } from 'express';

export interface SessionData {
    userId: string;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    loginMethod?: 'password' | 'oauth';
}

// Generate unique session ID
export const generateSessionId = (): string => {
    return randomBytes(32).toString('hex');
};

// Detect device type from user agent
export const detectDeviceType = (userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' => {
    const ua = userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
        return 'mobile';
    } else if (/tablet|ipad|kindle|silk/i.test(ua)) {
        return 'tablet';
    } else if (/chrome|firefox|safari|edge|opera/i.test(ua)) {
        return 'desktop';
    }
    
    return 'unknown';
};

// Create new session
export const createUserSession = async (
    userId: string, 
    req: Request, 
    loginMethod: 'password' | 'oauth' = 'password'
): Promise<string> => {
    const sessionId = generateSessionId();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    
    // Check current active sessions
    const activeSessions = await UserSession.countDocuments({ 
        userId, 
        isActive: true 
    });

    // Limit to 5 concurrent sessions
    if (activeSessions >= 5) {
        // Deactivate oldest session
        await (UserSession as any).deactivateOldestSession(userId);
    }

    // Create new session
    await UserSession.create({
        userId,
        sessionId,
        ipAddress: req.ip,
        userAgent,
        deviceType: detectDeviceType(userAgent),
        loginMethod,
        isActive: true,
        lastActivity: new Date()
    });

    return sessionId;
};

// Validate session
export const validateUserSession = async (sessionId: string): Promise<boolean> => {
    const session = await UserSession.findOne({ 
        sessionId, 
        isActive: true 
    });
    
    if (!session) {
        return false;
    }

    // Update activity
    await session.updateActivity();
    return true;
};

// Get user's active sessions
export const getUserActiveSessions = async (userId: string) => {
    return await (UserSession as any).findActiveSessions(userId);
};

// Deactivate session
export const deactivateSession = async (sessionId: string): Promise<boolean> => {
    const session = await UserSession.findOne({ sessionId });
    if (!session) {
        return false;
    }
    
    await session.deactivate();
    return true;
};

// Deactivate all user sessions except current
export const deactivateAllUserSessions = async (userId: string, exceptSessionId?: string): Promise<number> => {
    const filter: any = { 
        userId, 
        isActive: true 
    };
    
    if (exceptSessionId) {
        filter.sessionId = { $ne: exceptSessionId };
    }

    const result = await UserSession.updateMany(
        filter,
        { isActive: false }
    );

    return result.modifiedCount;
};