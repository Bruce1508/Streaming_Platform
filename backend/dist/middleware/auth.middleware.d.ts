import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
export interface AuthRequest extends Request {
    user?: IUser;
    tokenMetadata?: any;
}
/**
 * @desc    Enhanced authentication with token pair support
 * @access  Protected routes
 */
export declare const protectRoute: (req: Request, res: Response, next: NextFunction) => void;
/**
 * @desc    Enhanced optional authentication with token pair support
 * @access  Public routes that can benefit from user context
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
/**
 * @desc    Authorize user roles (unchanged)
 * @param   roles - Array of allowed roles
 * @access  Protected routes with role restriction
 */
export declare const authorize: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
/**
 * @desc    Check if user owns resource or is admin (unchanged)
 * @param   getUserId - Function to extract user ID from request
 * @access  Protected routes with ownership check
 */
export declare const authorizeOwnerOrAdmin: (getUserId: (req: Request) => string) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireFreshToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireStudent: ((req: AuthRequest, res: Response, next: NextFunction) => void)[];
export declare const requireProfessor: ((req: AuthRequest, res: Response, next: NextFunction) => void)[];
export declare const requireAdmin: ((req: AuthRequest, res: Response, next: NextFunction) => void)[];
export declare const requireFreshAdmin: ((req: AuthRequest, res: Response, next: NextFunction) => void)[];
//# sourceMappingURL=auth.middleware.d.ts.map