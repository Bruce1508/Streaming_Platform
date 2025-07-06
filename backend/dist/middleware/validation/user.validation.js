"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStatusChange = exports.validateRoleChange = exports.validateUserId = exports.validateUserQuery = exports.validateUserProfile = exports.validateUserUpdate = void 0;
// middleware/validation/user.validation.ts
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const ApiError_1 = require("../../utils/ApiError");
// Validate user profile update
exports.validateUserUpdate = [
    (0, express_validator_1.body)('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone(['en-US', 'vi-VN'])
        .withMessage('Please provide a valid phone number'),
    (0, express_validator_1.body)('dateOfBirth')
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
    (0, express_validator_1.body)('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Location must not exceed 100 characters'),
    (0, express_validator_1.body)('website')
        .optional()
        .isURL()
        .withMessage('Please provide a valid website URL'),
    (0, express_validator_1.body)('socialLinks.linkedin')
        .optional()
        .isURL()
        .withMessage('Please provide a valid LinkedIn URL'),
    (0, express_validator_1.body)('socialLinks.github')
        .optional()
        .isURL()
        .withMessage('Please provide a valid GitHub URL'),
    (0, express_validator_1.body)('socialLinks.twitter')
        .optional()
        .isURL()
        .withMessage('Please provide a valid Twitter URL'),
    handleValidationErrors
];
// Validate user profile completeness
exports.validateUserProfile = [
    (0, express_validator_1.body)('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be 2-50 characters'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be 2-50 characters'),
    (0, express_validator_1.body)('programId')
        .notEmpty()
        .withMessage('Program selection is required')
        .isMongoId()
        .withMessage('Invalid program ID'),
    (0, express_validator_1.body)('year')
        .isInt({ min: 1, max: 6 })
        .withMessage('Academic year must be between 1 and 6'),
    (0, express_validator_1.body)('dateOfBirth')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    handleValidationErrors
];
// Validate user query parameters
exports.validateUserQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be 1-100 characters'),
    (0, express_validator_1.query)('role')
        .optional()
        .isIn(['student', 'instructor', 'admin'])
        .withMessage('Invalid role'),
    (0, express_validator_1.query)('program')
        .optional()
        .isMongoId()
        .withMessage('Invalid program ID'),
    (0, express_validator_1.query)('year')
        .optional()
        .isInt({ min: 1, max: 6 })
        .withMessage('Year must be between 1 and 6'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['active', 'inactive', 'suspended'])
        .withMessage('Invalid status'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['firstName', 'lastName', 'email', 'createdAt', 'lastLogin'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
    handleValidationErrors
];
// Validate user ID parameter
exports.validateUserId = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    handleValidationErrors
];
// Validate role change
exports.validateRoleChange = [
    (0, express_validator_1.body)('role')
        .isIn(['student', 'instructor', 'admin'])
        .withMessage('Invalid role'),
    (0, express_validator_1.body)('reason')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Reason must not exceed 200 characters'),
    handleValidationErrors
];
// Validate user status change
exports.validateStatusChange = [
    (0, express_validator_1.body)('status')
        .isIn(['active', 'inactive', 'suspended'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('reason')
        .if((0, express_validator_1.body)('status').equals('suspended'))
        .notEmpty()
        .withMessage('Reason is required when suspending user')
        .isLength({ max: 200 })
        .withMessage('Reason must not exceed 200 characters'),
    handleValidationErrors
];
// Handle validation errors
function handleValidationErrors(req, res, next) {
    const errors = (0, express_validator_2.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ApiError_1.ApiError(400, errorMessages.join(', '));
    }
    next();
}
//# sourceMappingURL=user.validation.js.map