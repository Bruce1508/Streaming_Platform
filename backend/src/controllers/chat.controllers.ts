import { Response, Request } from "express";
import { generateStreamToken } from "../lib/stream";
import { logApiRequest } from '../utils/Api.utils';
import { logger } from '../utils/logger.utils';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

// ===== INTERFACE DEFINITIONS =====
interface AuthenticatedRequest extends Request {
    user?: any;
}

// ===== STREAM TOKEN GENERATION =====
export const getStreamToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const user = req.user;
    
    if (!user || !user._id) {
        logger.warn('Stream token request failed: User not authenticated', {
            userId: user?._id,
            ip: req.ip
        });
        throw new ApiError(401, "User not authenticated");
    }

    const userId = user._id.toString();
    logger.info('Generating stream token', {
        userId,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    
    const token = generateStreamToken(userId);
    
    if (!token) {
        logger.error('Failed to generate stream token', {
            userId,
            ip: req.ip
        });
        throw new ApiError(500, "Failed to generate token");
    }

    logger.info('Stream token generated successfully', {
        userId,
        ip: req.ip
    });

    return res.status(200).json(
        new ApiResponse(200, { token }, 'Stream token generated successfully')
    );
});