import { Request, Response } from 'express';
/**
 * @desc    Get all schools with filtering support for onBoarding
 * @route   GET /api/schools
 * @access  Public
 */
export declare const getSchools: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get single school by ID or code
 * @route   GET /api/schools/:identifier
 * @access  Public
 */
export declare const getSchoolById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get schools by province (for onBoarding dropdown)
 * @route   GET /api/schools/province/:province
 * @access  Public
 */
export declare const getSchoolsByProvince: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get available provinces list
 * @route   GET /api/schools/provinces
 * @access  Public
 */
export declare const getProvinces: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Seed schools from schoolData.ts (Admin only)
 * @route   POST /api/schools/seed
 * @access  Admin
 */
export declare const seedSchools: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Create new school (Admin only)
 * @route   POST /api/schools
 * @access  Admin
 */
export declare const createSchool: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update school (Admin only)
 * @route   PUT /api/schools/:id
 * @access  Admin
 */
export declare const updateSchool: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete school (Admin only)
 * @route   DELETE /api/schools/:id
 * @access  Admin
 */
export declare const deleteSchool: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=school.controllers.d.ts.map