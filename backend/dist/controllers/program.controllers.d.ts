import { Request, Response } from 'express';
/**
 * @desc    Get all programs with filtering support for onBoarding
 * @route   GET /api/programs
 * @access  Public
 */
export declare const getPrograms: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get programs by school (for onBoarding dropdown)
 * @route   GET /api/programs/school/:schoolId
 * @access  Public
 */
export declare const getProgramsBySchool: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get single program by ID or code
 * @route   GET /api/programs/:identifier
 * @access  Public
 */
export declare const getProgramById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get available program levels
 * @route   GET /api/programs/levels
 * @access  Public
 */
export declare const getProgramLevels: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Search programs for onBoarding autocomplete
 * @route   GET /api/programs/search
 * @access  Public
 */
export declare const searchPrograms: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Create new program (Admin only)
 * @route   POST /api/programs
 * @access  Admin
 */
export declare const createProgram: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update program (Admin only)
 * @route   PUT /api/programs/:id
 * @access  Admin
 */
export declare const updateProgram: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete program (Admin only)
 * @route   DELETE /api/programs/:id
 * @access  Admin
 */
export declare const deleteProgram: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Bulk import programs from scraped data
 * @route   POST /api/programs/bulk-import
 * @access  Admin only
 */
export declare const bulkImportPrograms: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=program.controllers.d.ts.map