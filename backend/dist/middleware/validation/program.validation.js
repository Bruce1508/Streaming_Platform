"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProgramCreate = exports.validateProgramQuery = void 0;
const express_validator_1 = require("express-validator");
const common_validation_1 = require("./common.validation");
// ===== PROGRAM QUERY VALIDATION =====
exports.validateProgramQuery = [
    (0, express_validator_1.query)('school')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('School name must be 1-200 characters'),
    (0, express_validator_1.query)('level')
        .optional()
        .isIn([
        'Certificate',
        'Diploma',
        'Advanced Diploma',
        'Bachelor',
        'Graduate Certificate',
        'Honours Bachelor Degree',
        'Honours Bachelor',
        'Seneca Certificate of Standing',
        'Certificate of Apprenticeship, Ontario College Certificate'
    ])
        .withMessage('Level must be one of the supported program levels'),
    (0, express_validator_1.query)('credential')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Credential must be 1-200 characters'),
    (0, express_validator_1.query)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
        .toBoolean(),
    common_validation_1.handleValidationErrors
];
// ===== PROGRAM CREATE/UPDATE VALIDATION =====
exports.validateProgramCreate = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Program name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Program name must be 2-100 characters'),
    (0, express_validator_1.body)('code')
        .trim()
        .notEmpty()
        .withMessage('Program code is required')
        .isLength({ min: 2, max: 10 })
        .withMessage('Program code must be 2-10 characters')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('Program code can only contain uppercase letters and numbers'),
    (0, express_validator_1.body)('school')
        .notEmpty()
        .withMessage('School is required')
        .isMongoId()
        .withMessage('School must be a valid ObjectId'),
    (0, express_validator_1.body)('level')
        .notEmpty()
        .withMessage('Program level is required')
        .isIn(['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Graduate Certificate'])
        .withMessage('Level must be Certificate, Diploma, Advanced Diploma, Bachelor, or Graduate Certificate'),
    (0, express_validator_1.body)('duration')
        .notEmpty()
        .withMessage('Duration is required'),
    (0, express_validator_1.body)('duration.semesters')
        .isInt({ min: 1, max: 12 })
        .withMessage('Duration semesters must be between 1 and 12')
        .toInt(),
    (0, express_validator_1.body)('duration.years')
        .isFloat({ min: 0.5, max: 6 })
        .withMessage('Duration years must be between 0.5 and 6')
        .toFloat(),
    (0, express_validator_1.body)('totalCredits')
        .isInt({ min: 10, max: 200 })
        .withMessage('Total credits must be between 10 and 200')
        .toInt(),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    (0, express_validator_1.body)('requirements.academic')
        .optional()
        .isArray()
        .withMessage('Academic requirements must be an array'),
    (0, express_validator_1.body)('requirements.english')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('English requirement cannot exceed 200 characters'),
    (0, express_validator_1.body)('requirements.other')
        .optional()
        .isArray()
        .withMessage('Other requirements must be an array'),
    (0, express_validator_1.body)('careerOutcomes')
        .optional()
        .isArray()
        .withMessage('Career outcomes must be an array'),
    (0, express_validator_1.body)('tuition.domestic')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Domestic tuition must be a positive number')
        .toFloat(),
    (0, express_validator_1.body)('tuition.international')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('International tuition must be a positive number')
        .toFloat(),
    (0, express_validator_1.body)('tuition.currency')
        .optional()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be 3 characters (e.g., CAD)')
        .toUpperCase(),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
        .toBoolean(),
    common_validation_1.handleValidationErrors
];
//# sourceMappingURL=program.validation.js.map