import { body, query } from 'express-validator';
import { handleValidationErrors } from './common.validation';

// ===== SCHOOL QUERY VALIDATION =====

export const validateSchoolQuery = [
    query('province')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Province must be 2-50 characters'),
    
    query('type')
        .optional()
        .isIn(['University', 'College', 'Institute', 'Seminary', 'Cégep'])
        .withMessage('Type must be University, College, Institute, Seminary, or Cégep'),
    
    query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
        .toBoolean(),

    handleValidationErrors
];

// ===== SCHOOL CREATE/UPDATE VALIDATION =====

export const validateSchoolCreate = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('School name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('School name must be 2-100 characters'),
    
    body('code')
        .trim()
        .notEmpty()
        .withMessage('School code is required')
        .isLength({ min: 2, max: 10 })
        .withMessage('School code must be 2-10 characters')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('School code can only contain uppercase letters and numbers'),
    
    body('type')
        .notEmpty()
        .withMessage('School type is required')
        .isIn(['University', 'College', 'Institute', 'Seminary', 'Cégep'])
        .withMessage('Type must be University, College, Institute, Seminary, or Cégep'),
    
    body('province')
        .trim()
        .notEmpty()
        .withMessage('Province is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Province must be 2-50 characters'),
    
    body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('Website must be a valid URL'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    
    body('established')
        .optional()
        .isInt({ min: 1800, max: new Date().getFullYear() })
        .withMessage('Established year must be between 1800 and current year')
        .toInt(),
    
    body('color')
        .optional()
        .trim()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Color must be a valid hex color'),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
        .toBoolean(),

    handleValidationErrors
]; 