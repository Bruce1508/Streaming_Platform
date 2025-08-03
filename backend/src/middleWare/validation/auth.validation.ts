// src/middleware/validation/auth.validation.ts - ENHANCED VERSION
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger.utils';
import { maskEmail } from '../../utils/Format.utils';



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

// ✅ ENHANCED NAME VALIDATION - Support Vietnamese and international characters
const nameSchema = Joi.string()
    .min(2)
    .max(100)  // Increased from 50
    .pattern(new RegExp('^[a-zA-ZÀ-ỹ\\s\\-\\.\']+$'))  // Support Vietnamese and international chars
    .required()
    .messages({
        'string.pattern.base': 'Name can only contain letters, spaces, hyphens, dots, apostrophes, and accented characters (including Vietnamese)'
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
    // ✅ REMOVED: signUp, signIn schemas - now using magic link + OAuth

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

    // ✅ TOKEN SCHEMAS
    refreshToken: Joi.object({
        refreshToken: tokenSchemas.refreshToken
    }),

    sendMagicLink: Joi.object({
        email: emailSchema,
        callbackUrl: Joi.string().pattern(/^[\/\w\-\.]+$/).optional().messages({
            'string.pattern.base': 'Callback URL must be a valid path (e.g., /dashboard, /profile)'
        }),
        baseUrl: Joi.string().uri().optional()
    }),

    verifyMagicLink: Joi.object({
        email: emailSchema,
        token: Joi.string().required().messages({
            'any.required': 'Magic link token is required',
            'string.empty': 'Magic link token cannot be empty'
        })
    }),

    completeProfile: Joi.object({
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
            console.log(`🔥 Backend: Validation middleware called for ${req.method} ${req.path}`);
            
            const dataToValidate = source === 'body' ? req.body : 
                                 source === 'query' ? req.query : 
                                 req.params;

            console.log('📋 Backend: Data to validate:', {
                source,
                data: dataToValidate,
                contentType: req.headers['content-type']
            });

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

                console.log('❌ Backend: Validation FAILED:', {
                    endpoint: req.path,
                    method: req.method,
                    errors: errorMessages,
                    originalData: dataToValidate
                });

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

            console.log('✅ Backend: Validation PASSED:', {
                endpoint: req.path,
                validatedData: value
            });

            // Update the request object with validated data
            if (source === 'body') req.body = value;
            else if (source === 'query') req.query = value;
            else req.params = value;

            next();
        } catch (err: any) {
            console.error('💥 Backend: Validation middleware error:', err);
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
        
        // Safely sanitize query (check if writable)
        try {
            const sanitizedQuery = sanitizeObject(req.query);
            Object.keys(req.query).forEach(key => {
                delete req.query[key];
            });
            Object.assign(req.query, sanitizedQuery);
        } catch (error) {
            // If query is read-only, skip sanitization
            console.warn('Cannot sanitize req.query - read-only');
        }
        
        // Safely sanitize params
        try {
            req.params = sanitizeObject(req.params);
        } catch (error) {
            console.warn('Cannot sanitize req.params - read-only');
        }
        
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
    // ✅ REMOVED: validateSignUp, validateSignIn - now using magic link + OAuth
    validateOAuth: createValidator(authSchemas.oauth),
    
    // Magic Link
    validateSendMagicLink: createValidator(authSchemas.sendMagicLink),
    validateVerifyMagicLink: createValidator(authSchemas.verifyMagicLink),
    
    // Profile management
    validateOnBoarding: createValidator(authSchemas.onBoarding),
    validateCompleteProfile: createValidator(authSchemas.completeProfile),
    

    
    // Admin functions
    validateGetUsersList: createValidator(authSchemas.getUsersList, 'query'),
    validateUpdateUserStatus: createValidator(authSchemas.updateUserStatus),
    
    // Params validation
    validateUserParams: createValidator(authSchemas.userParams, 'params'),
    validateVerificationToken: createValidator(authSchemas.verificationParams, 'params'),
    
    // Pagination
    validatePagination: createValidator(paginationSchema, 'query')
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