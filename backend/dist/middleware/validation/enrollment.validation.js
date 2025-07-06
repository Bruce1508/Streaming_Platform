"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnrollmentUpdate = exports.validateBulkEnrollment = exports.validateEnrollmentCreate = void 0;
// middleware/validation/enrollment.validation.ts
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const ApiError_1 = require("../../utils/ApiError");
// Validate enrollment creation
exports.validateEnrollmentCreate = [
    (0, express_validator_1.body)('courseId')
        .notEmpty()
        .withMessage('Course ID is required')
        .isMongoId()
        .withMessage('Invalid course ID format'),
    (0, express_validator_1.body)('studentId')
        .optional()
        .isMongoId()
        .withMessage('Invalid student ID format'),
    (0, express_validator_1.body)('enrollmentDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid enrollment date'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['enrolled', 'completed', 'dropped', 'pending'])
        .withMessage('Invalid enrollment status'),
    handleValidationErrors
];
// Validate bulk enrollment
exports.validateBulkEnrollment = [
    (0, express_validator_1.body)('courseId')
        .notEmpty()
        .withMessage('Course ID is required')
        .isMongoId()
        .withMessage('Invalid course ID format'),
    (0, express_validator_1.body)('studentIds')
        .isArray({ min: 1 })
        .withMessage('Student IDs array is required and must not be empty'),
    (0, express_validator_1.body)('studentIds.*')
        .isMongoId()
        .withMessage('Invalid student ID format'),
    handleValidationErrors
];
// Validate enrollment update
exports.validateEnrollmentUpdate = [
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['enrolled', 'completed', 'dropped', 'pending'])
        .withMessage('Invalid enrollment status'),
    (0, express_validator_1.body)('completionDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid completion date'),
    (0, express_validator_1.body)('grade')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Grade must be between 0 and 100'),
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
//# sourceMappingURL=enrollment.validation.js.map