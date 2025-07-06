"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processError = exports.handleJWTError = exports.handleDuplicateKeyError = exports.handleValidationError = exports.catchAsync = exports.notFound = exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
// Global error handler
const errorHandler = (err, req, res, next) => {
    let error = err;
    // If it's not our custom ApiError, convert it
    if (!(error instanceof ApiError_1.ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError_1.ApiError(statusCode, message, [], error.stack);
    }
    // Log error for debugging
    console.error(`[ERROR] ${new Date().toISOString()}:`, Object.assign({ message: error.message, statusCode: error.statusCode, path: req.path, method: req.method, ip: req.ip, userAgent: req.get('User-Agent') }, (process.env.NODE_ENV === 'development' && { stack: error.stack })));
    // Send error response
    res.status(error.statusCode).json(Object.assign({ success: false, message: error.message }, (process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        path: req.path,
        method: req.method
    })));
};
exports.errorHandler = errorHandler;
// 404 handler for undefined routes
const notFound = (req, res, next) => {
    const error = new ApiError_1.ApiError(404, `Route ${req.method} ${req.originalUrl} not found`);
    next(error);
};
exports.notFound = notFound;
// Async error catcher (alternative to asyncHandler)
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
// Validation error handler
const handleValidationError = (err) => {
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error) => ({
            field: error.path,
            message: error.message
        }));
        return new ApiError_1.ApiError(400, 'Validation Error', errors);
    }
    return err;
};
exports.handleValidationError = handleValidationError;
// MongoDB duplicate key error handler
const handleDuplicateKeyError = (err) => {
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        return new ApiError_1.ApiError(409, message);
    }
    return err;
};
exports.handleDuplicateKeyError = handleDuplicateKeyError;
// JWT error handler
const handleJWTError = (err) => {
    if (err.name === 'JsonWebTokenError') {
        return new ApiError_1.ApiError(401, 'Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
        return new ApiError_1.ApiError(401, 'Token expired');
    }
    return err;
};
exports.handleJWTError = handleJWTError;
// Comprehensive error processor
const processError = (err) => {
    let error = err;
    // Handle different types of errors
    error = (0, exports.handleValidationError)(error);
    error = (0, exports.handleDuplicateKeyError)(error);
    error = (0, exports.handleJWTError)(error);
    return error;
};
exports.processError = processError;
//# sourceMappingURL=error.middleware.js.map