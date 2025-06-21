// src/middleware/validation/auth.validation.ts - Version đơn giản
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Password strength validation
const passwordSchema = Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters'
    });

// Email validation
const emailSchema = Joi.string()
    .email()
    .required()
    .custom((value) => {
        return value.toLowerCase();
    });

// Name validation
const nameSchema = Joi.string()
    .min(2)
    .max(50)
    .pattern(new RegExp('^[a-zA-Z\\s\\-\\.\']+$'))
    .required()
    .messages({
        'string.pattern.base': 'Name can only contain letters, spaces, hyphens, dots, and apostrophes'
    });

// Academic context validation
const academicSchema = Joi.object({
    studentId: Joi.string().pattern(new RegExp('^[A-Z0-9]{8,15}$')).optional(),
    school: Joi.string().hex().length(24).optional(),
    program: Joi.string().hex().length(24).optional(),
    currentSemester: Joi.number().min(1).max(8).optional(),
    enrollmentYear: Joi.number().min(2020).max(new Date().getFullYear() + 1).optional()
});

// Validation schemas
const authSchemas = {
    signUp: Joi.object({
        email: emailSchema,
        password: passwordSchema,
        fullName: nameSchema,
        role: Joi.string().valid('student', 'professor', 'admin', 'guest').default('student'),
        academic: academicSchema.optional()
    }),

    signIn: Joi.object({
        email: emailSchema,
        password: Joi.string().required()
    }),

    onBoarding: Joi.object({
        fullName: nameSchema,
        bio: Joi.string().max(500).allow('').optional(),
        location: Joi.string().max(100).allow('').optional(),
        website: Joi.string().uri().allow('').optional(),
        profilePic: Joi.string().uri().allow('').optional(),
    })
};

// Validation middleware factory
const createValidator = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
                convert: true
            });

            if (error) {
                const errorMessages = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }));

                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errorMessages
                });
            }

            req.body = value;
            next();
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: 'Validation error',
                error: err.message
            });
        }
    };
};

// Export validators
export const authValidators = {
    validateSignUp: createValidator(authSchemas.signUp),
    validateSignIn: createValidator(authSchemas.signIn),
    validateOnBoarding: createValidator(authSchemas.onBoarding)
};

// ✅ Simplified security middleware - chỉ sanitization
export const securityMiddleware = {
    // Sanitize input to prevent XSS
    sanitizeInput: (req: Request, res: Response, next: NextFunction) => {
        const sanitizeString = (str: string): string => {
            return str
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
        };

        const sanitizeObject = (obj: any): any => {
            if (typeof obj === 'string') {
                return sanitizeString(obj);
            }
            if (typeof obj === 'object' && obj !== null) {
                const sanitized: any = {};
                for (const key in obj) {
                    sanitized[key] = sanitizeObject(obj[key]);
                }
                return sanitized;
            }
            return obj;
        };

        req.body = sanitizeObject(req.body);
        next();
    }
};



// 🎯 Vai trò: INPUT VALIDATION & SECURITY
// ✅ Validate request data (email, password format)
// ✅ Sanitize inputs (XSS prevention)
// ✅ Check password strength
// ✅ Data format validation

// 📍 Sử dụng: BEFORE processing request