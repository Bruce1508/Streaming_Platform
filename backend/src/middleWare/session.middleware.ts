// middleware/session.middleware.ts - Enhanced version
import { Request, Response, NextFunction } from 'express';
import { validateUserSession, createUserSession } from '../utils/session.utils';
import { UserSession } from '../models/UserSession';

// Add session creation to login flow
export const createSessionMiddleware = (loginMethod: 'password' | 'oauth' = 'password') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // This runs AFTER successful authentication
            if (res.locals.userId) {
                const sessionId = await createUserSession(
                    res.locals.userId, 
                    req, 
                    loginMethod
                );
                
                res.locals.sessionId = sessionId;
                console.log('✅ Session created:', { sessionId, userId: res.locals.userId });
            }
            
            next();
        } catch (error) {
            console.error('Session creation error:', error);
            // Don't fail the request, just log error
            next();
        }
    };
};

// Validate session middleware
export const validateSessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.headers['x-session-id'] as string;
        
        if (!sessionId) {
            return next(); // Skip validation if no session ID
        }

        // Get full session from database
        const session = await UserSession.findOne({ 
            sessionId, 
            isActive: true 
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired session',
                type: 'SESSION_INVALID'
            });
        }

        // Update last activity
        session.lastActivity = new Date();
        await session.save();

        // ✅ Set complete sessionInfo object
        req.sessionInfo = {
            userId: session.userId.toString(),
            sessionId: session.sessionId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            isActive: session.isActive,
            lastActivity: session.lastActivity
        };
        
        next();
        
    } catch (error) {
        console.error('Session validation error:', error);
        next(); // Fail open
    }
};

// Optional session validation (doesn't fail if no session)
export const optionalSessionValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.headers['x-session-id'] as string;
        
        if (!sessionId) {
            return next(); // No session, continue
        }

        // Get session from database
        const session = await UserSession.findOne({ 
            sessionId, 
            isActive: true 
        });
        
        if (session) {
            // Update activity
            session.lastActivity = new Date();
            await session.save();

            // ✅ Set complete sessionInfo object
            req.sessionInfo = {
                userId: session.userId.toString(),
                sessionId: session.sessionId,
                ipAddress: session.ipAddress,
                userAgent: session.userAgent,
                isActive: session.isActive,
                lastActivity: session.lastActivity
            };
        }
        
        next();
    } catch (error) {
        console.error('Optional session validation error:', error);
        next(); // Continue without session
    }
};