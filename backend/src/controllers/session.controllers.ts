import { Request, Response } from 'express';
import { getUserActiveSessions, deactivateSession, deactivateAllUserSessions } from '../utils/session.utils';
import { AuthRequest } from '../middleware/auth.middleware';
import { logApiRequest } from '../utils/Api.utils';
import { logger } from '../utils/logger.utils';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

// ===== SESSION MANAGEMENT =====

/**
 * @desc    Get user's active sessions
 * @route   GET /api/sessions
 * @access  Private
 */
export const getActiveSessions = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    if (!req.user) {
        logger.warn('Session access denied: User not authenticated', {
            ip: req.ip
        });
        throw new ApiError(401, 'Authentication required');
    }

    const sessions = await getUserActiveSessions(req.user._id.toString());
    
    logger.info('User sessions retrieved', {
        userId: req.user._id,
        sessionCount: sessions.length,
        ip: req.ip
    });

    const formattedSessions = sessions.map((session: any) => ({
        sessionId: session.sessionId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        deviceType: session.deviceType,
        lastActivity: session.lastActivity,
        createdAt: session.createdAt,
        isCurrent: session.sessionId === req.sessionInfo?.sessionId
    }));

    return res.status(200).json(
        new ApiResponse(200, { sessions: formattedSessions }, 'Sessions retrieved successfully')
    );
});

/**
 * @desc    Logout specific session
 * @route   DELETE /api/sessions/:sessionId
 * @access  Private
 */
export const logoutSession = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { sessionId } = req.params;
    
    if (!req.user) {
        logger.warn('Session logout denied: User not authenticated', {
            sessionId,
            ip: req.ip
        });
        throw new ApiError(401, 'Authentication required');
    }

    const success = await deactivateSession(sessionId);
    
    if (!success) {
        logger.warn('Session logout failed: Session not found', {
            userId: req.user._id,
            sessionId,
            ip: req.ip
        });
        throw new ApiError(404, 'Session not found');
    }

    logger.info('Session logged out successfully', {
        userId: req.user._id,
        sessionId,
        ip: req.ip
    });

    return res.status(200).json(
        new ApiResponse(200, null, 'Session logged out successfully')
    );
});

/**
 * @desc    Logout all devices except current
 * @route   DELETE /api/sessions
 * @access  Private
 */
export const logoutAllDevices = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    if (!req.user) {
        logger.warn('Bulk session logout denied: User not authenticated', {
            ip: req.ip
        });
        throw new ApiError(401, 'Authentication required');
    }

    const currentSessionId = req.sessionInfo?.sessionId;
    const loggedOutCount = await deactivateAllUserSessions(
        req.user._id.toString(), 
        currentSessionId
    );

    logger.info('Bulk session logout completed', {
        userId: req.user._id,
        loggedOutCount,
        currentSessionId,
        ip: req.ip
    });

    return res.status(200).json(
        new ApiResponse(200, { loggedOutCount }, `Logged out ${loggedOutCount} devices successfully`)
    );
});