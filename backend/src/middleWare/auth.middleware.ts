// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// Extend Request interface
export interface AuthRequest extends Request {
    user?: IUser;
}

/**
 * @desc    Authenticate user and attach to request
 * @access  Protected routes
 */
export const protectRoute = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    console.log("🔐 Auth header:", authHeader);

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
    } 
    // Alternative: Check for token in cookies
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        console.log("❌ No token provided");
        throw new ApiError(401, "Access denied. No token provided");
    }

    console.log("🔑 Token length:", token.length);
    console.log("🔑 Token preview:", token.substring(0, 20) + "...");

    if (!process.env.JWT_SECRET_KEY) {
        console.error("❌ JWT_SECRET_KEY not configured");
        throw new ApiError(500, "Server configuration error");
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { 
            userId: string;
            id?: string; // Support both formats
        };
        
        console.log("✅ Token decoded:", decoded);

        // Get user ID (support both userId and id)
        const userId = decoded.userId || decoded.id;
        if (!userId) {
            throw new ApiError(401, "Invalid token format");
        }

        // Find user and exclude password
        const user = await User.findById(userId).select("-password");
        if (!user) {
            console.log("❌ User not found for ID:", userId);
            throw new ApiError(401, "Invalid token - user not found");
        }

        // Check if user account is active
        if (!user.isActive) {
            console.log("❌ User account deactivated:", userId);
            throw new ApiError(401, "Account has been deactivated");
        }

        console.log("✅ User authenticated:", {
            id: user._id,
            email: user.email,
            role: user.role
        });

        // Attach user to request
        req.user = user;
        next();

    } catch (error: any) {
        console.log("❌ Token verification failed:", error.message);
        
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token");
        } else if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token has expired");
        } else if (error instanceof ApiError) {
            throw error; // Re-throw ApiError
        } else {
            throw new ApiError(401, "Token authentication failed");
        }
    }
});

/**
 * @desc    Authorize user roles
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
 * @desc    Check if user owns resource or is admin
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

/**
 * @desc    Optional authentication - doesn't throw error if no token
 * @access  Public routes that can benefit from user context
 */
export const optionalAuth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // Continue without authentication
    }

    try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };
        const user = await User.findById(decoded.userId).select("-password");
        
        if (user && user.isActive) {
            req.user = user;
        }
    } catch (error) {
        console.log("Optional auth failed:", error);
        // Don't throw error, just continue without user
    }

    next();
});

// Legacy alias for backward compatibility
export const authenticate = protectRoute;

// Export commonly used combinations
export const requireStudent = [protectRoute, authorize(['student'])];
export const requireProfessor = [protectRoute, authorize(['professor', 'admin'])];
export const requireAdmin = [protectRoute, authorize(['admin'])];