"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAcademicUpdate = exports.validateOnboardingComplete = void 0;
const express_validator_1 = require("express-validator");
const common_validation_1 = require("./common.validation");
// ===== ONBOARDING COMPLETE VALIDATION =====
exports.validateOnboardingComplete = [
    (0, express_validator_1.body)('schoolId')
        .notEmpty()
        .withMessage('School is required')
        .isMongoId()
        .withMessage('School must be a valid ObjectId'),
    (0, express_validator_1.body)('programId')
        .notEmpty()
        .withMessage('Program is required')
        .isMongoId()
        .withMessage('Program must be a valid ObjectId'),
    (0, express_validator_1.body)('currentSemester')
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage('Current semester must be between 1 and 8')
        .toInt(),
    (0, express_validator_1.body)('enrollmentYear')
        .optional()
        .isInt({ min: 2020, max: new Date().getFullYear() + 1 })
        .withMessage('Enrollment year must be between 2020 and next year')
        .toInt(),
    (0, express_validator_1.body)('studentId')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Student ID must be 3-20 characters')
        .matches(/^[A-Z0-9]+$/i)
        .withMessage('Student ID can only contain letters and numbers'),
    common_validation_1.handleValidationErrors
];
// ===== ACADEMIC UPDATE VALIDATION =====
exports.validateAcademicUpdate = [
    (0, express_validator_1.body)('schoolId')
        .optional()
        .isMongoId()
        .withMessage('School must be a valid ObjectId'),
    (0, express_validator_1.body)('programId')
        .optional()
        .isMongoId()
        .withMessage('Program must be a valid ObjectId'),
    (0, express_validator_1.body)('currentSemester')
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage('Current semester must be between 1 and 8')
        .toInt(),
    (0, express_validator_1.body)('studentId')
        .optional()
        .trim()
        .custom((value) => {
        // Allow empty string (to clear) or valid student ID
        if (value === '')
            return true;
        if (value && (value.length < 3 || value.length > 20)) {
            throw new Error('Student ID must be 3-20 characters');
        }
        if (value && !/^[A-Z0-9]+$/i.test(value)) {
            throw new Error('Student ID can only contain letters and numbers');
        }
        return true;
    }),
    // Custom validation to ensure at least one field is provided
    (0, express_validator_1.body)()
        .custom((value, { req }) => {
        const { schoolId, programId, currentSemester, studentId } = req.body;
        if (!schoolId && !programId && currentSemester === undefined && studentId === undefined) {
            throw new Error('At least one field must be provided for update');
        }
        return true;
    }),
    common_validation_1.handleValidationErrors
];
//# sourceMappingURL=onboarding.validation.js.map