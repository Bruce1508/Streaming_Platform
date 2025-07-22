"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSecurityChain = exports.composeValidation = exports.validationHelpers = exports.authValidators = exports.securityMiddleware = void 0;
// src/middleware/validation/auth.validation.ts - ENHANCED VERSION
const joi_1 = __importDefault(require("joi"));
const logger_utils_1 = require("../../utils/logger.utils");
const Format_utils_1 = require("../../utils/Format.utils");
// ✅ ENHANCED EMAIL VALIDATION
const emailSchema = joi_1.default.string()
    .email()
    .required()
    .custom((value, helpers) => {
    const normalizedEmail = value.toLowerCase().trim();
    // Check for suspicious email patterns
    const suspiciousPatterns = [
        /^[^@]+@[^@]+\.(tk|ml|ga|cf)$/i, // Suspicious TLDs
        /^[^@]*\+.*@.*$/, // Plus addressing (might be suspicious)
        /^[^@]*\.{2,}[^@]*@.*$/ // Multiple consecutive dots
    ];
    if (suspiciousPatterns.some(pattern => pattern.test(normalizedEmail))) {
        logger_utils_1.logger.warn('Suspicious email pattern detected', { email: (0, Format_utils_1.maskEmail)(normalizedEmail) });
    }
    return normalizedEmail;
});
// ✅ ENHANCED NAME VALIDATION
const nameSchema = joi_1.default.string()
    .min(2)
    .max(100) // Increased from 50
    .pattern(new RegExp('^[a-zA-Z\\s\\-\\.\'àáäâèéëêìíïîòóöôùúüûñç]+$')) // Added international chars
    .required()
    .messages({
    'string.pattern.base': 'Name can only contain letters, spaces, hyphens, dots, apostrophes, and accented characters'
});
// ✅ PHONE VALIDATION
const phoneSchema = joi_1.default.string()
    .pattern(new RegExp('^[+]?[1-9]\\d{1,14}$')) // International format
    .optional()
    .messages({
    'string.pattern.base': 'Phone number must be in valid international format'
});
// ✅ URL VALIDATION
const urlSchema = joi_1.default.string()
    .uri({ scheme: ['http', 'https'] })
    .max(500)
    .allow('')
    .optional();
// ✅ ENHANCED ACADEMIC CONTEXT VALIDATION
const academicSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(new RegExp('^[A-Z0-9]{6,15}$'))
        .optional()
        .messages({
        'string.pattern.base': 'Student ID must be 6-15 characters containing only letters and numbers'
    }),
    school: joi_1.default.string().hex().length(24).optional(),
    program: joi_1.default.string().max(100).optional(),
    currentSemester: joi_1.default.number().min(1).max(12).optional(),
    enrollmentYear: joi_1.default.number()
        .min(2020)
        .max(new Date().getFullYear() + 2)
        .optional(),
    gpa: joi_1.default.number().min(0).max(4.0).optional(),
    credits: joi_1.default.number().min(0).optional()
});
// ✅ OAUTH PROVIDER VALIDATION
const oauthProviderSchema = joi_1.default.string()
    .valid('google', 'facebook', 'github', 'microsoft', 'apple')
    .required();
// ✅ TOKEN VALIDATION SCHEMAS
const tokenSchemas = {
    refreshToken: joi_1.default.string()
        .min(20)
        .max(500)
        .pattern(new RegExp('^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$')) // JWT format
        .optional()
        .messages({
        'string.pattern.base': 'Invalid token format'
    }),
    verificationToken: joi_1.default.string()
        .length(64)
        .pattern(new RegExp('^[a-f0-9]{64}$'))
        .required()
        .messages({
        'string.pattern.base': 'Invalid verification token format'
    })
};
// ✅ PAGINATION VALIDATION
const paginationSchema = joi_1.default.object({
    page: joi_1.default.number().min(1).default(1),
    limit: joi_1.default.number().min(1).max(100).default(20),
    sort: joi_1.default.string().valid('createdAt', '-createdAt', 'fullName', '-fullName', 'email', '-email').default('-createdAt'),
    search: joi_1.default.string().max(100).allow('').optional()
});
// ✅ ENHANCED VALIDATION SCHEMAS
const authSchemas = {
    // ✅ REMOVED: signUp, signIn schemas - now using magic link + OAuth
    oauth: joi_1.default.object({
        provider: oauthProviderSchema,
        email: emailSchema,
        fullName: nameSchema.optional(),
        profilePic: urlSchema,
        providerId: joi_1.default.string().max(100).required(),
        accessToken: joi_1.default.string().optional() // For some OAuth flows
    }),
    onBoarding: joi_1.default.object({
        fullName: nameSchema,
        bio: joi_1.default.string().max(500).allow('').optional(),
        location: joi_1.default.string().max(100).allow('').optional(),
        website: urlSchema,
        profilePic: urlSchema,
        phone: phoneSchema,
        academic: academicSchema.optional(),
        preferences: joi_1.default.object({
            notifications: joi_1.default.boolean().default(true),
            theme: joi_1.default.string().valid('light', 'dark', 'auto').default('auto'),
            language: joi_1.default.string().valid('en', 'vi', 'fr', 'es').default('en')
        }).optional()
    }),
    updateProfile: joi_1.default.object({
        fullName: nameSchema.optional(),
        bio: joi_1.default.string().max(500).allow('').optional(),
        location: joi_1.default.string().max(100).allow('').optional(),
        website: urlSchema,
        profilePic: urlSchema,
        phone: phoneSchema,
        preferences: joi_1.default.object({
            notifications: joi_1.default.boolean().optional(),
            theme: joi_1.default.string().valid('light', 'dark', 'auto').optional(),
            language: joi_1.default.string().valid('en', 'vi', 'fr', 'es').optional()
        }).optional()
    }),
    // ✅ TOKEN SCHEMAS
    refreshToken: joi_1.default.object({
        refreshToken: tokenSchemas.refreshToken
    }),
    sendMagicLink: joi_1.default.object({
        email: emailSchema,
        callbackUrl: joi_1.default.string().pattern(/^[\/\w\-\.]+$/).optional().messages({
            'string.pattern.base': 'Callback URL must be a valid path (e.g., /dashboard, /profile)'
        }),
        baseUrl: joi_1.default.string().uri().optional()
    }),
    verifyMagicLink: joi_1.default.object({
        email: emailSchema,
        token: joi_1.default.string().required().messages({
            'any.required': 'Magic link token is required',
            'string.empty': 'Magic link token cannot be empty'
        })
    }),
    completeProfile: joi_1.default.object({
        fullName: nameSchema,
        bio: joi_1.default.string().max(500).allow('').optional(),
        location: joi_1.default.string().max(100).allow('').optional(),
        website: urlSchema,
        profilePic: urlSchema,
        phone: phoneSchema,
        academic: academicSchema.optional(),
        preferences: joi_1.default.object({
            notifications: joi_1.default.boolean().default(true),
            theme: joi_1.default.string().valid('light', 'dark', 'auto').default('auto'),
            language: joi_1.default.string().valid('en', 'vi', 'fr', 'es').default('en')
        }).optional()
    }),
    // ✅ ADMIN SCHEMAS
    getUsersList: paginationSchema.keys({
        role: joi_1.default.string().valid('student', 'teacher', 'admin', 'guest').optional(),
        isActive: joi_1.default.boolean().optional(),
        isVerified: joi_1.default.boolean().optional(),
        authProvider: joi_1.default.string().valid('local', 'google', 'facebook', 'github').optional()
    }),
    updateUserStatus: joi_1.default.object({
        isActive: joi_1.default.boolean().optional(),
        status: joi_1.default.string().valid('active', 'suspended', 'pending', 'banned').optional(),
        reason: joi_1.default.string().max(500).when('status', {
            is: joi_1.default.string().valid('suspended', 'banned'),
            then: joi_1.default.required(),
            otherwise: joi_1.default.optional()
        })
    }),
    // ✅ PARAMS VALIDATION
    userParams: joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().messages({
            'string.hex': 'Invalid user ID format',
            'string.length': 'Invalid user ID length'
        })
    }),
    verificationParams: joi_1.default.object({
        token: tokenSchemas.verificationToken
    })
};
// ✅ ENHANCED VALIDATION MIDDLEWARE FACTORY
const createValidator = (schema, source = 'body') => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                const errorMessages = error.details.map(detail => {
                    var _a;
                    return ({
                        field: detail.path.join('.'),
                        message: detail.message,
                        value: (_a = detail.context) === null || _a === void 0 ? void 0 : _a.value
                    });
                });
                console.log('❌ Backend: Validation FAILED:', {
                    endpoint: req.path,
                    method: req.method,
                    errors: errorMessages,
                    originalData: dataToValidate
                });
                logger_utils_1.logger.warn('Validation failed', {
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
            if (source === 'body')
                req.body = value;
            else if (source === 'query')
                req.query = value;
            else
                req.params = value;
            next();
        }
        catch (err) {
            console.error('💥 Backend: Validation middleware error:', err);
            logger_utils_1.logger.error('Validation middleware error:', err);
            return res.status(500).json({
                success: false,
                message: 'Validation error',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    });
};
// ✅ ENHANCED SECURITY MIDDLEWARE
exports.securityMiddleware = {
    // Enhanced XSS prevention
    sanitizeInput: (req, res, next) => {
        const sanitizeString = (str) => {
            if (typeof str !== 'string')
                return str;
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
        const sanitizeObject = (obj) => {
            if (typeof obj === 'string') {
                return sanitizeString(obj);
            }
            if (Array.isArray(obj)) {
                return obj.map(item => sanitizeObject(item));
            }
            if (typeof obj === 'object' && obj !== null) {
                const sanitized = {};
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
        }
        catch (error) {
            // If query is read-only, skip sanitization
            console.warn('Cannot sanitize req.query - read-only');
        }
        // Safely sanitize params
        try {
            req.params = sanitizeObject(req.params);
        }
        catch (error) {
            console.warn('Cannot sanitize req.params - read-only');
        }
        next();
    },
    // ✅ NEW - SQL Injection prevention for MongoDB
    preventNoSQLInjection: (req, res, next) => {
        const checkForInjection = (obj) => {
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
            logger_utils_1.logger.warn('Potential NoSQL injection attempt detected', {
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
    validateContentType: (req, res, next) => {
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
exports.authValidators = {
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
exports.validationHelpers = {
    // Check if email domain is educational
    isEducationalEmail: (email) => {
        const eduDomains = ['.edu', '.ac.', '.university', '.college'];
        return eduDomains.some(domain => email.toLowerCase().includes(domain));
    },
    // Generate validation error response
    createValidationError: (field, message) => ({
        success: false,
        message: 'Validation failed',
        errors: [{ field, message }]
    }),
    // Sanitize filename for uploads
    sanitizeFilename: (filename) => {
        return filename
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 100);
    }
};
// ✅ NEW - MIDDLEWARE COMPOSITION HELPER
const composeValidation = (...middlewares) => {
    return (req, res, next) => {
        let index = 0;
        const runNext = (err) => {
            if (err)
                return next(err);
            if (index >= middlewares.length) {
                return next();
            }
            const middleware = middlewares[index++];
            middleware(req, res, runNext);
        };
        runNext();
    };
};
exports.composeValidation = composeValidation;
// ✅ EXPORT DEFAULT MIDDLEWARE CHAIN
exports.defaultSecurityChain = [
    exports.securityMiddleware.validateContentType,
    exports.securityMiddleware.sanitizeInput,
    exports.securityMiddleware.preventNoSQLInjection
];
//# sourceMappingURL=auth.validation.js.map