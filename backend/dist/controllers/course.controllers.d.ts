import { Request, Response } from 'express';
/**
 * @desc    Bulk import program courses from scraped data
 * @route   POST /api/courses/program-courses/bulk-import
 * @access  Admin only
 */
export declare const bulkImportProgramCourses: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all program courses with filtering
 * @route   GET /api/courses/program-courses
 * @access  Public
 */
export declare const getProgramCourses: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get program courses by program ID
 * @route   GET /api/courses/program-courses/:programId
 * @access  Public
 */
export declare const getProgramCoursesByProgramId: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Search courses across all programs
 * @route   GET /api/courses/program-courses/search
 * @access  Public
 */
export declare const searchCoursesAcrossPrograms: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get program courses statistics
 * @route   GET /api/courses/program-courses/stats
 * @access  Public
 */
export declare const getProgramCoursesStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=course.controllers.d.ts.map