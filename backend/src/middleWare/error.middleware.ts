// middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

// Global error handler
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = err;

    // If it's not our custom ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, [], error.stack);
    }

    // Log error for debugging
    console.error(`[ERROR] ${new Date().toISOString()}:`, {
        message: error.message,
        statusCode: error.statusCode,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });

    // Send error response
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: error.stack,
            path: req.path,
            method: req.method 
        })
    });
};

// 404 handler for undefined routes
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`);
    next(error);
};

// Async error catcher (alternative to asyncHandler)
export const catchAsync = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Validation error handler
export const handleValidationError = (err: any) => {
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error: any) => ({
            field: error.path,
            message: error.message
        }));
        return new ApiError(400, 'Validation Error', errors);
    }
    return err;
};

// MongoDB duplicate key error handler
export const handleDuplicateKeyError = (err: any) => {
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        return new ApiError(409, message);
    }
    return err;
};

// JWT error handler
export const handleJWTError = (err: any) => {
    if (err.name === 'JsonWebTokenError') {
        return new ApiError(401, 'Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
        return new ApiError(401, 'Token expired');
    }
    return err;
};

// Comprehensive error processor
export const processError = (err: any) => {
    let error = err;
    
    // Handle different types of errors
    error = handleValidationError(error);
    error = handleDuplicateKeyError(error);
    error = handleJWTError(error);
    
    return error;
};