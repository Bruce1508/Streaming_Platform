import { Request, Response } from 'express';
import { getUserActiveSessions, deactivateSession, deactivateAllUserSessions } from '../utils/session.utils';
import { AuthRequest } from '../middleware/auth.middleware';

// Get user's active sessions
export const getActiveSessions = async (req: AuthRequest, res: Response): Promise <any> => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const sessions = await getUserActiveSessions(req.user._id.toString());
        
        res.json({
            success: true,
            data: {
                sessions: sessions.map((session: any) => ({
                    sessionId: session.sessionId,
                    ipAddress: session.ipAddress,
                    userAgent: session.userAgent,
                    deviceType: session.deviceType,
                    lastActivity: session.lastActivity,
                    createdAt: session.createdAt,
                    isCurrent: session.sessionId === req.sessionInfo?.sessionId
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get sessions'
        });
    }
};

// Logout specific session
export const logoutSession = async (req: AuthRequest, res: Response): Promise <any> => {
    try {
        const { sessionId } = req.params;
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const success = await deactivateSession(sessionId);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            message: 'Session logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to logout session'
        });
    }
};

// Logout all devices except current
export const logoutAllDevices = async (req: AuthRequest, res: Response): Promise <any> => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const currentSessionId = req.sessionInfo?.sessionId;
        const loggedOutCount = await deactivateAllUserSessions(
            req.user._id.toString(), 
            currentSessionId
        );

        res.json({
            success: true,
            message: `Logged out ${loggedOutCount} devices successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to logout all devices'
        });
    }
};