"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchoolCreate = exports.validateSchoolQuery = void 0;
const express_validator_1 = require("express-validator");
const common_validation_1 = require("./common.validation");
// ===== SCHOOL QUERY VALIDATION =====
exports.validateSchoolQuery = [
    (0, express_validator_1.query)('province')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Province must be 2-50 characters'),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(['University', 'College', 'Institute', 'Seminary', 'Cégep'])
        .withMessage('Type must be University, College, Institute, Seminary, or Cégep'),
    (0, express_validator_1.query)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
        .toBoolean(),
    common_validation_1.handleValidationErrors
];
// ===== SCHOOL CREATE/UPDATE VALIDATION =====
exports.validateSchoolCreate = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('School name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('School name must be 2-100 characters'),
    (0, express_validator_1.body)('code')
        .trim()
        .notEmpty()
        .withMessage('School code is required')
        .isLength({ min: 2, max: 10 })
        .withMessage('School code must be 2-10 characters')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('School code can only contain uppercase letters and numbers'),
    (0, express_validator_1.body)('type')
        .notEmpty()
        .withMessage('School type is required')
        .isIn(['University', 'College', 'Institute', 'Seminary', 'Cégep'])
        .withMessage('Type must be University, College, Institute, Seminary, or Cégep'),
    (0, express_validator_1.body)('province')
        .trim()
        .notEmpty()
        .withMessage('Province is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Province must be 2-50 characters'),
    (0, express_validator_1.body)('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('Website must be a valid URL'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    (0, express_validator_1.body)('established')
        .optional()
        .isInt({ min: 1800, max: new Date().getFullYear() })
        .withMessage('Established year must be between 1800 and current year')
        .toInt(),
    (0, express_validator_1.body)('color')
        .optional()
        .trim()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Color must be a valid hex color'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
        .toBoolean(),
    common_validation_1.handleValidationErrors
];
//# sourceMappingURL=school.validation.js.map