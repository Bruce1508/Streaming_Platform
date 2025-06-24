import { body } from 'express-validator';
import { handleValidationErrors } from './common.validation';

// ===== ONBOARDING COMPLETE VALIDATION =====

export const validateOnboardingComplete = [
    body('schoolId')
        .notEmpty()
        .withMessage('School is required')
        .isMongoId()
        .withMessage('School must be a valid ObjectId'),
    
    body('programId')
        .notEmpty()
        .withMessage('Program is required')
        .isMongoId()
        .withMessage('Program must be a valid ObjectId'),
    
    body('currentSemester')
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage('Current semester must be between 1 and 8')
        .toInt(),
    
    body('enrollmentYear')
        .optional()
        .isInt({ min: 2020, max: new Date().getFullYear() + 1 })
        .withMessage('Enrollment year must be between 2020 and next year')
        .toInt(),
    
    body('studentId')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Student ID must be 3-20 characters')
        .matches(/^[A-Z0-9]+$/i)
        .withMessage('Student ID can only contain letters and numbers'),

    handleValidationErrors
];

// ===== ACADEMIC UPDATE VALIDATION =====

export const validateAcademicUpdate = [
    body('schoolId')
        .optional()
        .isMongoId()
        .withMessage('School must be a valid ObjectId'),
    
    body('programId')
        .optional()
        .isMongoId()
        .withMessage('Program must be a valid ObjectId'),
    
    body('currentSemester')
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage('Current semester must be between 1 and 8')
        .toInt(),
    
    body('studentId')
        .optional()
        .trim()
        .custom((value) => {
            // Allow empty string (to clear) or valid student ID
            if (value === '') return true;
            if (value && (value.length < 3 || value.length > 20)) {
                throw new Error('Student ID must be 3-20 characters');
            }
            if (value && !/^[A-Z0-9]+$/i.test(value)) {
                throw new Error('Student ID can only contain letters and numbers');
            }
            return true;
        }),

    // Custom validation to ensure at least one field is provided
    body()
        .custom((value, { req }) => {
            const { schoolId, programId, currentSemester, studentId } = req.body;
            
            if (!schoolId && !programId && currentSemester === undefined && studentId === undefined) {
                throw new Error('At least one field must be provided for update');
            }
            
            return true;
        }),

    handleValidationErrors
]; 