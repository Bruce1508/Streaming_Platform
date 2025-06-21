// middleware/index.ts - UPDATED
// Export all middleware
export * from './auth.middleware';
export * from './error.middleware';        
export * from './rateLimiter';
export * from './session.middleware';
export * from './upload.middleware';
export * from './material.middleware';

// Export validation middleware
export * from './validation';

// Re-export commonly used middleware
export { 
    protectRoute, 
    optionalAuth, 
    authorize,
    requireStudent,
    requireProfessor,
    requireAdmin 
} from './auth.middleware';

export { 
    errorHandler, 
    notFound, 
    catchAsync 
} from './error.middleware';         

export { 
    createRateLimit, 
    authRateLimiters 
} from './rateLimiter';

export { 
    uploadSingle, 
    uploadMultiple 
} from './upload.middleware';