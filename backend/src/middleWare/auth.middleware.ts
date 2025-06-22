// middleware/auth.middleware.ts - ENHANCED VERSION
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { 
    validateAccessToken, 
    shouldRefreshToken, 
    isTokenBlacklisted,
    getTokenMetadata 
} from "../utils/jwt.enhanced";
import { getCachedUser } from "../utils/Cache.utils";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET_VALUE = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
if (!JWT_SECRET_VALUE) {
    console.error("❌ JWT Secret not configured");
    throw new ApiError(500, "Server configuration error");
}

// Extend Request interface
export interface AuthRequest extends Request {
    user?: IUser;
    tokenMetadata?: any; // For debugging/monitoring
}

/**
 * @desc    Enhanced authentication with token pair support
 * @access  Protected routes
 */
export const protectRoute = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    // 🔍 EXTRACT TOKEN - Support both new and legacy formats
    const authHeader = req.headers.authorization;
    console.log("🔐 Auth header:", authHeader ? `Bearer ${authHeader.substring(7, 27)}...` : 'None');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    } 
    // Check new cookie names first, then fallback to legacy
    else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken; // New token pair system
    }
    else if (req.cookies?.token) {
        token = req.cookies.token; // Legacy single token support
    }

    if (!token) {
        console.log("❌ No token provided");
        throw new ApiError(401, "Access denied. No token provided");
    }

    console.log("🔑 Token length:", token.length);
    console.log("🔑 Token preview:", token.substring(0, 20) + "...");

    // 🔍 GET TOKEN METADATA for monitoring
    const tokenMetadata = getTokenMetadata(token);
    req.tokenMetadata = tokenMetadata;

    try {
        let decoded;

        // 🆕 NEW: Try enhanced token validation first
        if (tokenMetadata?.type === 'access') {
            console.log("🔄 Using enhanced access token validation");
            decoded = await validateAccessToken(token);
            
            if (!decoded) {
                throw new ApiError(401, "Invalid or blacklisted access token");
            }

            // ✅ NEW: Check if token needs refresh notification
            if (shouldRefreshToken(token)) {
                res.setHeader('X-Token-Refresh-Needed', 'true');
                console.log("⚠️ Token refresh recommended");
            }
        } 
        // 🔄 FALLBACK: Legacy token validation for backward compatibility
        else {
            console.log("🔄 Using legacy token validation");
            
            // Check blacklist for legacy tokens too
            if (await isTokenBlacklisted(token)) {
                throw new ApiError(401, "Token has been revoked");
            }

            const jwtDecoded = jwt.verify(token, JWT_SECRET_VALUE) as { 
                userId?: string;
                id?: string;
                sessionId?: string;
            };
            
            // Convert to standard format
            decoded = {
                userId: jwtDecoded.userId || jwtDecoded.id,
                sessionId: jwtDecoded.sessionId,
                type: 'legacy'
            };
        }

        console.log("✅ Token decoded:", {
            userId: decoded.userId,
            sessionId: decoded.sessionId,
            type: decoded.type || 'legacy'
        });

        // Validate user ID
        if (!decoded.userId) {
            throw new ApiError(401, "Invalid token format");
        }

        // 🔍 FIND USER - Try cache first
        let user = await getCachedUser(decoded.userId);
        
        if (!user) {
            user = await User.findById(decoded.userId).select("-password");
            if (!user) {
                console.log("❌ User not found for ID:", decoded.userId);
                throw new ApiError(401, "Invalid token - user not found");
            }
        }

        // ✅ CHECK USER STATUS
        if (!user.isActive) {
            console.log("❌ User account deactivated:", decoded.userId);
            throw new ApiError(401, "Account has been deactivated");
        }

        console.log("✅ User authenticated:", {
            id: user._id,
            email: user.email,
            role: user.role,
            tokenType: decoded.type || 'legacy'
        });

        // 📝 ATTACH TO REQUEST
        req.user = user;
        next();

    } catch (error: any) {
        console.log("❌ Token verification failed:", error.message);
        
        // Enhanced error handling
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token format");
        } else if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token has expired. Please refresh or login again.");
        } else if (error instanceof ApiError) {
            throw error;
        } else {
            throw new ApiError(401, "Token authentication failed");
        }
    }
});

/**
 * @desc    Enhanced optional authentication with token pair support
 * @access  Public routes that can benefit from user context
 */
export const optionalAuth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }
    
    if (!token) {
        return next(); // Continue without authentication
    }

    try {
        // Check if token is blacklisted
        if (await isTokenBlacklisted(token)) {
            console.log("Optional auth: Token is blacklisted");
            return next();
        }

        const tokenMetadata = getTokenMetadata(token);
        let decoded;

        // Try enhanced validation first
        if (tokenMetadata?.type === 'access') {
            decoded = await validateAccessToken(token);
        } else {
            // Legacy token validation
            const jwtDecoded = jwt.verify(token, JWT_SECRET_VALUE) as { userId?: string; id?: string };
            decoded = { userId: jwtDecoded.userId || jwtDecoded.id };
        }

        if (decoded?.userId) {
            // ✅ Try cache first
            let user = await getCachedUser(decoded.userId);
            
            if (!user) {
                user = await User.findById(decoded.userId).select("-password");
            }
            
            if (user && user.isActive) {
                req.user = user;
                req.tokenMetadata = tokenMetadata;
            }
        }
    } catch (error) {
        console.log("Optional auth failed:", error);
        // Continue without user - don't throw error
    }

    next();
});

/**
 * @desc    Authorize user roles (unchanged)
 * @param   roles - Array of allowed roles
 * @access  Protected routes with role restriction
 */
export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        if (!roles.includes(req.user.role)) {
            console.log(`❌ Access denied. User role: ${req.user.role}, Required: ${roles.join(', ')}`);
            throw new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`);
        }

        console.log(`✅ Role authorized: ${req.user.role}`);
        next();
    };
};

/**
 * @desc    Check if user owns resource or is admin (unchanged)
 * @param   getUserId - Function to extract user ID from request
 * @access  Protected routes with ownership check
 */
export const authorizeOwnerOrAdmin = (getUserId: (req: Request) => string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        const resourceUserId = getUserId(req);
        const isOwner = req.user._id.toString() === resourceUserId;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            throw new ApiError(403, "Access denied. You can only access your own resources");
        }

        next();
    };
};

// 🆕 NEW: Require fresh token (for sensitive operations)
export const requireFreshToken = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const tokenMetadata = req.tokenMetadata;
    
    if (!tokenMetadata) {
        throw new ApiError(401, "Token metadata required");
    }

    // Check if token was issued in last 5 minutes
    const tokenAge = Date.now() - (tokenMetadata.issuedAt?.getTime() || 0);
    const fiveMinutes = 5 * 60 * 1000;

    if (tokenAge > fiveMinutes) {
        throw new ApiError(401, "Fresh token required for this operation. Please refresh your token.");
    }

    next();
});

// Legacy alias for backward compatibility
export const authenticate = protectRoute;

// Export commonly used combinations
export const requireStudent = [protectRoute, authorize(['student'])];
export const requireProfessor = [protectRoute, authorize(['professor', 'admin'])];
export const requireAdmin = [protectRoute, authorize(['admin'])];
export const requireFreshAdmin = [protectRoute, authorize(['admin']), requireFreshToken];