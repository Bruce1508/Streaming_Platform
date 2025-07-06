"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArrayLength = exports.validateFileType = exports.validateNumericRange = exports.validateCategory = exports.validateStatus = exports.validateDateRange = exports.validateObjectIds = exports.validateObjectId = exports.validateSort = exports.validateSearch = exports.validatePagination = void 0;
exports.handleValidationErrors = handleValidationErrors;
// middleware/validation/common.validation.ts
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("../../utils/ApiError");
// Validate pagination parameters
exports.validatePagination = [
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
    handleValidationErrors
];
// Validate search parameters
exports.validateSearch = [
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be 1-100 characters')
        .escape(),
    handleValidationErrors
];
// Validate sort parameters
exports.validateSort = [
    (0, express_validator_1.query)('sortBy')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Sort field must be 1-50 characters'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
    handleValidationErrors
];
// Validate MongoDB ObjectId
const validateObjectId = (paramName = 'id') => [
    (0, express_validator_1.param)(paramName)
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error(`Invalid ${paramName} format`);
        }
        return true;
    }),
    handleValidationErrors
];
exports.validateObjectId = validateObjectId;
// Validate multiple ObjectIds
const validateObjectIds = (fieldName) => [
    (0, express_validator_1.query)(fieldName)
        .optional()
        .custom((value) => {
        const ids = Array.isArray(value) ? value : [value];
        for (const id of ids) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid ${fieldName} format`);
            }
        }
        return true;
    }),
    handleValidationErrors
];
exports.validateObjectIds = validateObjectIds;
// Validate date range
exports.validateDateRange = [
    (0, express_validator_1.query)('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    (0, express_validator_1.query)('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((endDate, { req }) => {
        var _a;
        if (((_a = req.query) === null || _a === void 0 ? void 0 : _a.startDate) && endDate) {
            const start = new Date(req.query.startDate);
            const end = new Date(endDate);
            if (end <= start) {
                throw new Error('End date must be after start date');
            }
        }
        return true;
    }),
    handleValidationErrors
];
// Validate status values
const validateStatus = (allowedStatuses) => [
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(allowedStatuses)
        .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
    handleValidationErrors
];
exports.validateStatus = validateStatus;
// Validate category
const validateCategory = (allowedCategories) => [
    (0, express_validator_1.query)('category')
        .optional()
        .isIn(allowedCategories)
        .withMessage(`Category must be one of: ${allowedCategories.join(', ')}`),
    handleValidationErrors
];
exports.validateCategory = validateCategory;
// Validate numeric range
const validateNumericRange = (fieldName, min, max) => [
    (0, express_validator_1.query)(fieldName)
        .optional()
        .isInt({ min, max })
        .withMessage(`${fieldName} must be between ${min} and ${max}`)
        .toInt(),
    handleValidationErrors
];
exports.validateNumericRange = validateNumericRange;
// Validate file type
const validateFileType = (allowedTypes) => {
    return (req, res, next) => {
        if (req.file) {
            if (!allowedTypes.includes(req.file.mimetype)) {
                throw new ApiError_1.ApiError(400, `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
            }
        }
        next();
    };
};
exports.validateFileType = validateFileType;
// Validate array length
const validateArrayLength = (fieldName, min, max) => [
    (0, express_validator_1.query)(fieldName)
        .optional()
        .isArray({ min, max })
        .withMessage(`${fieldName} must be an array with ${min}-${max} items`),
    handleValidationErrors
];
exports.validateArrayLength = validateArrayLength;
// Handle validation errors
function handleValidationErrors(req, res, next) {
    const errors = (0, express_validator_2.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ApiError_1.ApiError(400, errorMessages.join(', '));
    }
    next();
}
//# sourceMappingURL=common.validation.js.map