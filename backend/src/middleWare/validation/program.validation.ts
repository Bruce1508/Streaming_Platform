import { body, query } from 'express-validator';
import { handleValidationErrors } from './common.validation';

// ===== PROGRAM QUERY VALIDATION =====

export const validateProgramQuery = [
    query('school')
        .optional()
        .custom((value) => {
            // Accept both ObjectId and school code
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(value);
            const isCode = /^[A-Z0-9]{2,10}$/.test(value);
            
            if (!isObjectId && !isCode) {
                throw new Error('School must be a valid ObjectId or school code');
            }
            return true;
        }),
    
    query('level')
        .optional()
        .isIn(['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Graduate Certificate'])
        .withMessage('Level must be Certificate, Diploma, Advanced Diploma, Bachelor, or Graduate Certificate'),
    
    query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
        .toBoolean(),

    handleValidationErrors
];

// ===== PROGRAM CREATE/UPDATE VALIDATION =====

export const validateProgramCreate = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Program name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Program name must be 2-100 characters'),
    
    body('code')
        .trim()
        .notEmpty()
        .withMessage('Program code is required')
        .isLength({ min: 2, max: 10 })
        .withMessage('Program code must be 2-10 characters')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('Program code can only contain uppercase letters and numbers'),
    
    body('school')
        .notEmpty()
        .withMessage('School is required')
        .isMongoId()
        .withMessage('School must be a valid ObjectId'),
    
    body('level')
        .notEmpty()
        .withMessage('Program level is required')
        .isIn(['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Graduate Certificate'])
        .withMessage('Level must be Certificate, Diploma, Advanced Diploma, Bachelor, or Graduate Certificate'),
    
    body('duration')
        .notEmpty()
        .withMessage('Duration is required'),
    
    body('duration.semesters')
        .isInt({ min: 1, max: 12 })
        .withMessage('Duration semesters must be between 1 and 12')
        .toInt(),
    
    body('duration.years')
        .isFloat({ min: 0.5, max: 6 })
        .withMessage('Duration years must be between 0.5 and 6')
        .toFloat(),
    
    body('totalCredits')
        .isInt({ min: 10, max: 200 })
        .withMessage('Total credits must be between 10 and 200')
        .toInt(),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    
    body('requirements.academic')
        .optional()
        .isArray()
        .withMessage('Academic requirements must be an array'),
    
    body('requirements.english')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('English requirement cannot exceed 200 characters'),
    
    body('requirements.other')
        .optional()
        .isArray()
        .withMessage('Other requirements must be an array'),
    
    body('careerOutcomes')
        .optional()
        .isArray()
        .withMessage('Career outcomes must be an array'),
    
    body('tuition.domestic')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Domestic tuition must be a positive number')
        .toFloat(),
    
    body('tuition.international')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('International tuition must be a positive number')
        .toFloat(),
    
    body('tuition.currency')
        .optional()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be 3 characters (e.g., CAD)')
        .toUpperCase(),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
        .toBoolean(),

    handleValidationErrors
]; 