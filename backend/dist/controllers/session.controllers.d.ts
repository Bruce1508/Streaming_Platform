import { Request, Response } from 'express';
/**
 * @desc    Get user's active sessions
 * @route   GET /api/sessions
 * @access  Private
 */
export declare const getActiveSessions: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Logout specific session
 * @route   DELETE /api/sessions/:sessionId
 * @access  Private
 */
export declare const logoutSession: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Logout all devices except current
 * @route   DELETE /api/sessions
 * @access  Private
 */
export declare const logoutAllDevices: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=session.controllers.d.ts.map