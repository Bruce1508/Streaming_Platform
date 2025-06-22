// src/middleware/validation/auth.validation.ts - ENHANCED VERSION
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger.utils';
import { maskEmail } from '../../utils/Format.utils';

// ✅ ENHANCED PASSWORD VALIDATION - more flexible
const passwordSchema = Joi.string()
    .min(6)  // Reduced from 8 for better UX
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))  // Removed special char requirement
    .required()
    .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters'
    });

// ✅ STRONG PASSWORD VALIDATION - for admin/sensitive operations
const strongPasswordSchema = Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters'
    });

// ✅ ENHANCED EMAIL VALIDATION
const emailSchema = Joi.string()
    .email()
    .required()
    .custom((value, helpers) => {
        const normalizedEmail = value.toLowerCase().trim();
        
        // Check for suspicious email patterns
        const suspiciousPatterns = [
            /^[^@]+@[^@]+\.(tk|ml|ga|cf)$/i,  // Suspicious TLDs
            /^[^@]*\+.*@.*$/,                  // Plus addressing (might be suspicious)
            /^[^@]*\.{2,}[^@]*@.*$/           // Multiple consecutive dots
        ];
        
        if (suspiciousPatterns.some(pattern => pattern.test(normalizedEmail))) {
            logger.warn('Suspicious email pattern detected', { email: maskEmail(normalizedEmail) });
        }
        
        return normalizedEmail;
    });

// ✅ ENHANCED NAME VALIDATION
const nameSchema = Joi.string()
    .min(2)
    .max(100)  // Increased from 50
    .pattern(new RegExp('^[a-zA-Z\\s\\-\\.\'àáäâèéëêìíïîòóöôùúüûñç]+$'))  // Added international chars
    .required()
    .messages({
        'string.pattern.base': 'Name can only contain letters, spaces, hyphens, dots, apostrophes, and accented characters'
    });

// ✅ PHONE VALIDATION
const phoneSchema = Joi.string()
    .pattern(new RegExp('^[+]?[1-9]\\d{1,14}$'))  // International format
    .optional()
    .messages({
        'string.pattern.base': 'Phone number must be in valid international format'
    });

// ✅ URL VALIDATION
const urlSchema = Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .max(500)
    .allow('')
    .optional();

// ✅ ENHANCED ACADEMIC CONTEXT VALIDATION
const academicSchema = Joi.object({
    studentId: Joi.string()
        .pattern(new RegExp('^[A-Z0-9]{6,15}$'))
        .optional()
        .messages({
            'string.pattern.base': 'Student ID must be 6-15 characters containing only letters and numbers'
        }),
    school: Joi.string().hex().length(24).optional(),
    program: Joi.string().max(100).optional(),
    currentSemester: Joi.number().min(1).max(12).optional(),
    enrollmentYear: Joi.number()
        .min(2020)
        .max(new Date().getFullYear() + 2)
        .optional(),
    gpa: Joi.number().min(0).max(4.0).optional(),
    credits: Joi.number().min(0).optional()
});

// ✅ OAUTH PROVIDER VALIDATION
const oauthProviderSchema = Joi.string()
    .valid('google', 'facebook', 'github', 'microsoft', 'apple')
    .required();

// ✅ TOKEN VALIDATION SCHEMAS
const tokenSchemas = {
    refreshToken: Joi.string()
        .min(20)
        .max(500)
        .pattern(new RegExp('^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$'))  // JWT format
        .optional()
        .messages({
            'string.pattern.base': 'Invalid token format'
        }),
        
    resetToken: Joi.string()
        .length(64)  // Secure token length
        .pattern(new RegExp('^[a-f0-9]{64}$'))
        .required()
        .messages({
            'string.pattern.base': 'Invalid reset token format'
        }),
        
    verificationToken: Joi.string()
        .length(64)
        .pattern(new RegExp('^[a-f0-9]{64}$'))
        .required()
        .messages({
            'string.pattern.base': 'Invalid verification token format'
        })
};

// ✅ PAGINATION VALIDATION
const paginationSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20),
    sort: Joi.string().valid('createdAt', '-createdAt', 'fullName', '-fullName', 'email', '-email').default('-createdAt'),
    search: Joi.string().max(100).allow('').optional()
});

// ✅ ENHANCED VALIDATION SCHEMAS
const authSchemas = {
    signUp: Joi.object({
        email: emailSchema,
        password: passwordSchema,
        fullName: nameSchema,
        phone: phoneSchema,
        role: Joi.string().valid('student', 'teacher', 'admin', 'guest').default('student'),
        academic: academicSchema.optional(),
        terms: Joi.boolean().valid(true).required().messages({
            'any.only': 'You must accept the terms and conditions'
        }),
        newsletter: Joi.boolean().default(false)
    }),

    signIn: Joi.object({
        email: emailSchema,
        password: Joi.string().required(),
        rememberMe: Joi.boolean().default(false)
    }),

    oauth: Joi.object({
        provider: oauthProviderSchema,
        email: emailSchema,
        fullName: nameSchema.optional(),
        profilePic: urlSchema,
        providerId: Joi.string().max(100).required(),
        accessToken: Joi.string().optional()  // For some OAuth flows
    }),

    onBoarding: Joi.object({
        fullName: nameSchema,
        bio: Joi.string().max(500).allow('').optional(),
        location: Joi.string().max(100).allow('').optional(),
        website: urlSchema,
        profilePic: urlSchema,
        phone: phoneSchema,
        academic: academicSchema.optional(),
        preferences: Joi.object({
            notifications: Joi.boolean().default(true),
            theme: Joi.string().valid('light', 'dark', 'auto').default('auto'),
            language: Joi.string().valid('en', 'vi', 'fr', 'es').default('en')
        }).optional()
    }),

    updateProfile: Joi.object({
        fullName: nameSchema.optional(),
        bio: Joi.string().max(500).allow('').optional(),
        location: Joi.string().max(100).allow('').optional(),
        website: urlSchema,
        profilePic: urlSchema,
        phone: phoneSchema,
        preferences: Joi.object({
            notifications: Joi.boolean().optional(),
            theme: Joi.string().valid('light', 'dark', 'auto').optional(),
            language: Joi.string().valid('en', 'vi', 'fr', 'es').optional()
        }).optional()
    }),

    // ✅ NEW SCHEMAS
    forgotPassword: Joi.object({
        email: emailSchema
    }),

    resetPassword: Joi.object({
        token: tokenSchemas.resetToken,
        password: passwordSchema
    }),

    refreshToken: Joi.object({
        refreshToken: tokenSchemas.refreshToken
    }),

    changePassword: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: strongPasswordSchema  // Require strong password for changes
    }),

    // ✅ ADMIN SCHEMAS
    getUsersList: paginationSchema.keys({
        role: Joi.string().valid('student', 'teacher', 'admin', 'guest').optional(),
        isActive: Joi.boolean().optional(),
        isVerified: Joi.boolean().optional(),
        authProvider: Joi.string().valid('local', 'google', 'facebook', 'github').optional()
    }),

    updateUserStatus: Joi.object({
        isActive: Joi.boolean().optional(),
        status: Joi.string().valid('active', 'suspended', 'pending', 'banned').optional(),
        reason: Joi.string().max(500).when('status', {
            is: Joi.string().valid('suspended', 'banned'),
            then: Joi.required(),
            otherwise: Joi.optional()
        })
    }),

    // ✅ PARAMS VALIDATION
    userParams: Joi.object({
        id: Joi.string().hex().length(24).required().messages({
            'string.hex': 'Invalid user ID format',
            'string.length': 'Invalid user ID length'
        })
    }),

    verificationParams: Joi.object({
        token: tokenSchemas.verificationToken
    })
};

// ✅ ENHANCED VALIDATION MIDDLEWARE FACTORY
const createValidator = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = source === 'body' ? req.body : 
                                 source === 'query' ? req.query : 
                                 req.params;

            const { error, value } = schema.validate(dataToValidate, {
                abortEarly: false,
                stripUnknown: true,
                convert: true,
                allowUnknown: false
            });

            if (error) {
                const errorMessages = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    value: detail.context?.value
                }));

                logger.warn('Validation failed', {
                    endpoint: req.path,
                    method: req.method,
                    errors: errorMessages,
                    ip: req.ip
                });

                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errorMessages
                });
            }

            // Update the request object with validated data
            if (source === 'body') req.body = value;
            else if (source === 'query') req.query = value;
            else req.params = value;

            next();
        } catch (err: any) {
            logger.error('Validation middleware error:', err);
            return res.status(500).json({
                success: false,
                message: 'Validation error',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    };
};

// ✅ ENHANCED SECURITY MIDDLEWARE
export const securityMiddleware = {
    // Enhanced XSS prevention
    sanitizeInput: (req: Request, res: Response, next: NextFunction) => {
        const sanitizeString = (str: string): string => {
            if (typeof str !== 'string') return str;
            
            return str
                // Remove script tags
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                // Remove javascript: protocol
                .replace(/javascript:/gi, '')
                // Remove event handlers
                .replace(/on\w+\s*=/gi, '')
                // Remove data: protocol for images (except safe ones)
                .replace(/data:(?!image\/(png|jpg|jpeg|gif|webp|svg));/gi, '')
                // Remove vbscript: protocol
                .replace(/vbscript:/gi, '')
                // Remove expression() CSS
                .replace(/expression\s*\(/gi, '')
                // Trim whitespace
                .trim();
        };

        const sanitizeObject = (obj: any): any => {
            if (typeof obj === 'string') {
                return sanitizeString(obj);
            }
            if (Array.isArray(obj)) {
                return obj.map(item => sanitizeObject(item));
            }
            if (typeof obj === 'object' && obj !== null) {
                const sanitized: any = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        sanitized[key] = sanitizeObject(obj[key]);
                    }
                }
                return sanitized;
            }
            return obj;
        };

        // Sanitize body, query, and params
        req.body = sanitizeObject(req.body);
        req.query = sanitizeObject(req.query);
        req.params = sanitizeObject(req.params);
        
        next();
    },

    // ✅ NEW - SQL Injection prevention for MongoDB
    preventNoSQLInjection: (req: Request, res: Response, next: NextFunction) => {
        const checkForInjection = (obj: any): boolean => {
            if (typeof obj === 'string') {
                // Check for MongoDB operators
                return /^\$/.test(obj);
            }
            if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    if (key.startsWith('$') || checkForInjection(obj[key])) {
                        return true;
                    }
                }
            }
            return false;
        };

        if (checkForInjection(req.body) || checkForInjection(req.query)) {
            logger.warn('Potential NoSQL injection attempt detected', {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                body: req.body,
                query: req.query
            });
            
            return res.status(400).json({
                success: false,
                message: 'Invalid request format'
            });
        }

        next();
    },

    // ✅ NEW - Content-Type validation
    validateContentType: (req: Request, res: Response, next: NextFunction) => {
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const contentType = req.headers['content-type'];
            
            if (!contentType || !contentType.includes('application/json')) {
                return res.status(400).json({
                    success: false,
                    message: 'Content-Type must be application/json'
                });
            }
        }
        next();
    }
};

// ✅ EXPORT ENHANCED VALIDATORS
export const authValidators = {
    // Basic auth
    validateSignUp: createValidator(authSchemas.signUp),
    validateSignIn: createValidator(authSchemas.signIn),
    validateOAuth: createValidator(authSchemas.oauth),
    
    // Profile management
    validateOnBoarding: createValidator(authSchemas.onBoarding),
    validateUpdateProfile: createValidator(authSchemas.updateProfile),
    
    // Password management
    validateForgotPassword: createValidator(authSchemas.forgotPassword),
    validateResetPassword: createValidator(authSchemas.resetPassword),
    validateChangePassword: createValidator(authSchemas.changePassword),
    
    // Token management
    validateRefreshToken: createValidator(authSchemas.refreshToken),
    
    // Admin functions
    validateGetUsersList: createValidator(authSchemas.getUsersList, 'query'),
    validateUpdateUserStatus: createValidator(authSchemas.updateUserStatus),
    
    // Params validation
    validateUserParams: createValidator(authSchemas.userParams, 'params'),
    validateVerificationToken: createValidator(authSchemas.verificationParams, 'params'),
    
    // ✅ NEW - Combined validation for complex operations
    validateCompleteProfile: [
        createValidator(authSchemas.updateProfile),
        (req: Request, res: Response, next: NextFunction) => {
            // Additional business logic validation
            const { fullName, bio, academic } = req.body;
            
            if (academic?.role === 'student' && !academic?.studentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Student ID is required for student role'
                });
            }
            
            next();
        }
    ]
};

// ✅ NEW - VALIDATION HELPERS
export const validationHelpers = {
    // Check if email domain is educational
    isEducationalEmail: (email: string): boolean => {
        const eduDomains = ['.edu', '.ac.', '.university', '.college'];
        return eduDomains.some(domain => email.toLowerCase().includes(domain));
    },
    
    // Generate validation error response
    createValidationError: (field: string, message: string) => ({
        success: false,
        message: 'Validation failed',
        errors: [{ field, message }]
    }),
    
    // Sanitize filename for uploads
    sanitizeFilename: (filename: string): string => {
        return filename
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 100);
    }
};

// ✅ NEW - MIDDLEWARE COMPOSITION HELPER
export const composeValidation = (...middlewares: any[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let index = 0;
        
        const runNext = (err?: any) => {
            if (err) return next(err);
            
            if (index >= middlewares.length) {
                return next();
            }
            
            const middleware = middlewares[index++];
            middleware(req, res, runNext);
        };
        
        runNext();
    };
};

// ✅ EXPORT DEFAULT MIDDLEWARE CHAIN
export const defaultSecurityChain = [
    securityMiddleware.validateContentType,
    securityMiddleware.sanitizeInput,
    securityMiddleware.preventNoSQLInjection
];