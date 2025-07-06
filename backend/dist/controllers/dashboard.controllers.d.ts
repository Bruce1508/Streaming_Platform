import { Request, Response } from 'express';
/**
 * @desc    Get comprehensive dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Admin/Professor
 */
export declare const getDashboard: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get user analytics
 * @route   GET /api/dashboard/users
 * @access  Admin only
 */
export declare const getUserAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get material analytics
 * @route   GET /api/dashboard/materials
 * @access  Admin/Professor
 */
export declare const getMaterialAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get course analytics
 * @route   GET /api/dashboard/courses
 * @access  Admin/Professor
 */
export declare const getCourseAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get personal activity dashboard (for any user)
 * @route   GET /api/dashboard/my-activity
 * @access  Authenticated users
 */
export declare const getMyActivity: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get trending content
 * @route   GET /api/dashboard/trending
 * @access  Public
 */
export declare const getTrendingContent: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get system health metrics
 * @route   GET /api/dashboard/health
 * @access  Admin only
 */
export declare const getSystemHealth: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=dashboard.controllers.d.ts.map