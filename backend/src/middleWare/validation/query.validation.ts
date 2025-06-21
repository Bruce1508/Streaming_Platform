// middleware/validation/query.validation.ts
import { query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../../utils/ApiError';

// Validate general query parameters
export const validateQueryParams = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
    
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be 1-100 characters'),
    
    query('sortBy')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Sort field must be valid'),
    
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),

    handleValidationErrors
];

// Validate material query parameters
export const validateMaterialQuery = [
    query('category')
        .optional()
        .isIn(['notes', 'assignments', 'exams', 'projects', 'resources'])
        .withMessage('Invalid material category'),
    
    query('type')
        .optional()
        .isIn(['pdf', 'doc', 'ppt', 'image', 'video', 'other'])
        .withMessage('Invalid material type'),
    
    query('status')
        .optional()
        .isIn(['pending', 'approved', 'rejected'])
        .withMessage('Invalid material status'),
    
    query('courseId')
        .optional()
        .isMongoId()
        .withMessage('Invalid course ID'),
    
    query('programId')
        .optional()
        .isMongoId()
        .withMessage('Invalid program ID'),

    ...validateQueryParams
];

// Validate user query parameters
export const validateUserQuery = [
    query('role')
        .optional()
        .isIn(['student', 'instructor', 'admin'])
        .withMessage('Invalid user role'),
    
    query('status')
        .optional()
        .isIn(['active', 'inactive', 'suspended'])
        .withMessage('Invalid user status'),
    
    query('program')
        .optional()
        .isMongoId()
        .withMessage('Invalid program ID'),
    
    query('year')
        .optional()
        .isInt({ min: 1, max: 6 })
        .withMessage('Academic year must be between 1 and 6'),

    ...validateQueryParams
];

// Validate course query parameters
export const validateCourseQuery = [
    query('programId')
        .optional()
        .isMongoId()
        .withMessage('Invalid program ID'),
    
    query('semester')
        .optional()
        .isIn(['Fall', 'Spring', 'Summer', 'Winter'])
        .withMessage('Invalid semester'),
    
    query('year')
        .optional()
        .isInt({ min: 2020, max: 2035 })
        .withMessage('Year must be between 2020 and 2035'),
    
    query('instructor')
        .optional()
        .isMongoId()
        .withMessage('Invalid instructor ID'),

    ...validateQueryParams
];

// Handle validation errors
function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ApiError(400, errorMessages.join(', '));
    }
    
    next();
}