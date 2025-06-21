// middleware/session.middleware.ts - Fixed version
import { Request, Response, NextFunction } from 'express';
import { UserSession } from '../../models/UserSession';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';

// Create new session
export const createSession = async (userId: string, req: Request): Promise<string> => {
    const sessionId = randomBytes(32).toString('hex');
    
    // Limit concurrent sessions (max 5 per user)
    const activeSessions = await UserSession.countDocuments({ 
        userId: new mongoose.Types.ObjectId(userId), // ← Fix: Convert string to ObjectId
        isActive: true 
    });

    if (activeSessions >= 5) {
        // Deactivate oldest session
        const oldestSession = await UserSession.findOne({ 
            userId: new mongoose.Types.ObjectId(userId), // ← Fix: Convert string to ObjectId
            isActive: true 
        }).sort({ lastActivity: 1 });
        
        if (oldestSession) {
            oldestSession.isActive = false;
            await oldestSession.save();
        }
    }

    // Create new session
    await UserSession.create({
        userId: new mongoose.Types.ObjectId(userId), // ← Fix: Convert string to ObjectId
        sessionId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'Unknown'
    });

    return sessionId;
};

// Validate session middleware
export const validateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.headers['x-session-id'] as string;
        
        if (!sessionId) {
            return next(); // Let auth middleware handle missing session
        }

        const session = await UserSession.findOne({ 
            sessionId, 
            isActive: true 
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Invalid session',
                type: 'SESSION_INVALID'
            });
        }

        // Update last activity
        session.lastActivity = new Date();
        await session.save();

        // ✅ Fix: Convert Mongoose document to plain object với correct types
        req.sessionInfo = {
            userId: session.userId.toString(), // Convert ObjectId to string
            sessionId: session.sessionId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            isActive: session.isActive,
            lastActivity: session.lastActivity
        };
        
        next();
    } catch (error) {
        console.error('Session validation error:', error);
        next(); // Continue without session info
    }
};


// 🎯 Mục đích: Fix TypeScript validation errors
// ✅ validateSession() - Check session exists
// ✅ createSession() - Create new session  
// ✅ Handle ObjectId conversion issues