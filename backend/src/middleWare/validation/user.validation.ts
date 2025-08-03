// middleware/validation/user.validation.ts
import { body, query, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../../utils/ApiError';

// Validate user profile update
export const validateUserUpdate = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
        .withMessage('First name can only contain letters and spaces (including Vietnamese characters)'),
    
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be 2-50 characters')
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
        .withMessage('Last name can only contain letters and spaces (including Vietnamese characters)'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('phone')
        .optional()
        .isMobilePhone(['en-US', 'vi-VN'])
        .withMessage('Please provide a valid phone number'),
    
    body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid date')
        .custom((value) => {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 13 || age > 120) {
                throw new Error('Age must be between 13 and 120 years');
            }
            return true;
        }),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),
    
    body('location')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Location must not exceed 100 characters'),
    
    body('website')
        .optional()
        .isURL()
        .withMessage('Please provide a valid website URL'),
    
    body('socialLinks.linkedin')
        .optional()
        .isURL()
        .withMessage('Please provide a valid LinkedIn URL'),
    
    body('socialLinks.github')
        .optional()
        .isURL()
        .withMessage('Please provide a valid GitHub URL'),
    
    body('socialLinks.twitter')
        .optional()
        .isURL()
        .withMessage('Please provide a valid Twitter URL'),

    handleValidationErrors
];

// Validate user profile completeness
export const validateUserProfile = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
        .withMessage('First name can only contain letters and spaces (including Vietnamese characters)'),
    
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be 2-50 characters')
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
        .withMessage('Last name can only contain letters and spaces (including Vietnamese characters)'),
    
    body('programId')
        .notEmpty()
        .withMessage('Program selection is required')
        .isMongoId()
        .withMessage('Invalid program ID'),
    
    body('year')
        .isInt({ min: 1, max: 6 })
        .withMessage('Academic year must be between 1 and 6'),
    
    body('dateOfBirth')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),

    handleValidationErrors
];

// Validate user query parameters
export const validateUserQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be 1-100 characters'),
    
    query('role')
        .optional()
        .isIn(['student', 'instructor', 'admin'])
        .withMessage('Invalid role'),
    
    query('program')
        .optional()
        .isMongoId()
        .withMessage('Invalid program ID'),
    
    query('year')
        .optional()
        .isInt({ min: 1, max: 6 })
        .withMessage('Year must be between 1 and 6'),
    
    query('status')
        .optional()
        .isIn(['active', 'inactive', 'suspended'])
        .withMessage('Invalid status'),
    
    query('sortBy')
        .optional()
        .isIn(['firstName', 'lastName', 'email', 'createdAt', 'lastLogin'])
        .withMessage('Invalid sort field'),
    
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),

    handleValidationErrors
];

// Validate user ID parameter
export const validateUserId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    
    handleValidationErrors
];

// Validate role change
export const validateRoleChange = [
    body('role')
        .isIn(['student', 'instructor', 'admin'])
        .withMessage('Invalid role'),
    
    body('reason')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Reason must not exceed 200 characters'),

    handleValidationErrors
];

// Validate user status change
export const validateStatusChange = [
    body('status')
        .isIn(['active', 'inactive', 'suspended'])
        .withMessage('Invalid status'),
    
    body('reason')
        .if(body('status').equals('suspended'))
        .notEmpty()
        .withMessage('Reason is required when suspending user')
        .isLength({ max: 200 })
        .withMessage('Reason must not exceed 200 characters'),

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