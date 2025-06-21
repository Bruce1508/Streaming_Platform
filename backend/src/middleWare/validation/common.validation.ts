// middleware/validation/common.validation.ts
import { query, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { ApiError } from '../../utils/ApiError';

// Validate pagination parameters
export const validatePagination = [
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

    handleValidationErrors
];

// Validate search parameters
export const validateSearch = [
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be 1-100 characters')
        .escape(),

    handleValidationErrors
];

// Validate sort parameters
export const validateSort = [
    query('sortBy')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Sort field must be 1-50 characters'),
    
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),

    handleValidationErrors
];

// Validate MongoDB ObjectId
export const validateObjectId = (paramName: string = 'id') => [
    param(paramName)
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid ${paramName} format`);
            }
            return true;
        }),

    handleValidationErrors
];

// Validate multiple ObjectIds
export const validateObjectIds = (fieldName: string) => [
    query(fieldName)
        .optional()
        .custom((value) => {
            const ids = Array.isArray(value) ? value : [value];
            
            for (const id of ids) {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    throw new Error(`Invalid ${fieldName} format`);
                }
            }
            return true;
        }),

    handleValidationErrors
];

// Validate date range
export const validateDateRange = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((endDate, { req }) => {
            if (req.query?.startDate && endDate) {
                const start = new Date(req.query.startDate as string);
                const end = new Date(endDate);
                
                if (end <= start) {
                    throw new Error('End date must be after start date');
                }
            }
            return true;
        }),

    handleValidationErrors
];

// Validate status values
export const validateStatus = (allowedStatuses: string[]) => [
    query('status')
        .optional()
        .isIn(allowedStatuses)
        .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),

    handleValidationErrors
];

// Validate category
export const validateCategory = (allowedCategories: string[]) => [
    query('category')
        .optional()
        .isIn(allowedCategories)
        .withMessage(`Category must be one of: ${allowedCategories.join(', ')}`),

    handleValidationErrors
];

// Validate numeric range
export const validateNumericRange = (fieldName: string, min: number, max: number) => [
    query(fieldName)
        .optional()
        .isInt({ min, max })
        .withMessage(`${fieldName} must be between ${min} and ${max}`)
        .toInt(),

    handleValidationErrors
];

// Validate file type
export const validateFileType = (allowedTypes: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.file) {
            if (!allowedTypes.includes(req.file.mimetype)) {
                throw new ApiError(400, `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
            }
        }
        next();
    };
};

// Validate array length
export const validateArrayLength = (fieldName: string, min: number, max: number) => [
    query(fieldName)
        .optional()
        .isArray({ min, max })
        .withMessage(`${fieldName} must be an array with ${min}-${max} items`),

    handleValidationErrors
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

// Export validation result handler for custom use
export { handleValidationErrors };