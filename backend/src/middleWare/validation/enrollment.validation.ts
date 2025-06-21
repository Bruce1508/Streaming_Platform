// middleware/validation/enrollment.validation.ts
import { body, query, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../../utils/ApiError';

// Validate enrollment creation
export const validateEnrollmentCreate = [
    body('courseId')
        .notEmpty()
        .withMessage('Course ID is required')
        .isMongoId()
        .withMessage('Invalid course ID format'),
    
    body('studentId')
        .optional()
        .isMongoId()
        .withMessage('Invalid student ID format'),
    
    body('enrollmentDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid enrollment date'),
    
    body('status')
        .optional()
        .isIn(['enrolled', 'completed', 'dropped', 'pending'])
        .withMessage('Invalid enrollment status'),

    handleValidationErrors
];

// Validate bulk enrollment
export const validateBulkEnrollment = [
    body('courseId')
        .notEmpty()
        .withMessage('Course ID is required')
        .isMongoId()
        .withMessage('Invalid course ID format'),
    
    body('studentIds')
        .isArray({ min: 1 })
        .withMessage('Student IDs array is required and must not be empty'),
    
    body('studentIds.*')
        .isMongoId()
        .withMessage('Invalid student ID format'),

    handleValidationErrors
];

// Validate enrollment update
export const validateEnrollmentUpdate = [
    body('status')
        .optional()
        .isIn(['enrolled', 'completed', 'dropped', 'pending'])
        .withMessage('Invalid enrollment status'),
    
    body('completionDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid completion date'),
    
    body('grade')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Grade must be between 0 and 100'),

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