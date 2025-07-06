"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCourseQuery = exports.validateUserQuery = exports.validateMaterialQuery = exports.validateQueryParams = void 0;
// middleware/validation/query.validation.ts
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const ApiError_1 = require("../../utils/ApiError");
// Validate general query parameters
exports.validateQueryParams = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be 1-100 characters'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Sort field must be valid'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
    handleValidationErrors
];
// Validate material query parameters
exports.validateMaterialQuery = [
    (0, express_validator_1.query)('category')
        .optional()
        .isIn(['notes', 'assignments', 'exams', 'projects', 'resources'])
        .withMessage('Invalid material category'),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(['pdf', 'doc', 'ppt', 'image', 'video', 'other'])
        .withMessage('Invalid material type'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['pending', 'approved', 'rejected'])
        .withMessage('Invalid material status'),
    (0, express_validator_1.query)('courseId')
        .optional()
        .isMongoId()
        .withMessage('Invalid course ID'),
    (0, express_validator_1.query)('programId')
        .optional()
        .isMongoId()
        .withMessage('Invalid program ID'),
    ...exports.validateQueryParams
];
// Validate user query parameters
exports.validateUserQuery = [
    (0, express_validator_1.query)('role')
        .optional()
        .isIn(['student', 'instructor', 'admin'])
        .withMessage('Invalid user role'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['active', 'inactive', 'suspended'])
        .withMessage('Invalid user status'),
    (0, express_validator_1.query)('program')
        .optional()
        .isMongoId()
        .withMessage('Invalid program ID'),
    (0, express_validator_1.query)('year')
        .optional()
        .isInt({ min: 1, max: 6 })
        .withMessage('Academic year must be between 1 and 6'),
    ...exports.validateQueryParams
];
// Validate course query parameters
exports.validateCourseQuery = [
    (0, express_validator_1.query)('programId')
        .optional()
        .isMongoId()
        .withMessage('Invalid program ID'),
    (0, express_validator_1.query)('semester')
        .optional()
        .isIn(['Fall', 'Spring', 'Summer', 'Winter'])
        .withMessage('Invalid semester'),
    (0, express_validator_1.query)('year')
        .optional()
        .isInt({ min: 2020, max: 2035 })
        .withMessage('Year must be between 2020 and 2035'),
    (0, express_validator_1.query)('instructor')
        .optional()
        .isMongoId()
        .withMessage('Invalid instructor ID'),
    ...exports.validateQueryParams
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
//# sourceMappingURL=query.validation.js.map