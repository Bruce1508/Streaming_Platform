// middleware/validation/course.validation.ts
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Course code validation (IPC144, CSN121, etc.)
const courseCodeSchema = Joi.string()
    .pattern(/^[A-Z]{3}[0-9]{3}$/)
    .required()
    .messages({
        'string.pattern.base': 'Course code must follow format: 3 letters + 3 numbers (e.g., IPC144)'
    });

// Academic hours validation
const hoursSchema = Joi.object({
    lecture: Joi.number().min(0).max(10).default(0),
    lab: Joi.number().min(0).max(10).default(0),
    tutorial: Joi.number().min(0).max(10).default(0),
    total: Joi.number().min(1).max(15).required()
});

// Program reference validation
const programRefSchema = Joi.object({
    program: Joi.string().hex().length(24).required(),
    semester: Joi.number().min(1).max(8).required(),
    isCore: Joi.boolean().default(true),
    isElective: Joi.boolean().default(false)
});

// Textbook validation
const textbookSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    author: Joi.string().min(1).max(100).required(),
    isbn: Joi.string().pattern(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/).optional(),
    required: Joi.boolean().default(true)
});

// Professor validation
const professorSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().optional(),
    rating: Joi.number().min(1).max(5).optional()
});

// Main course validation schemas
const courseSchemas = {
    create: Joi.object({
        code: courseCodeSchema,
        name: Joi.string().min(3).max(150).required(),
        description: Joi.string().min(10).max(2000).required(),
        credits: Joi.number().min(0.5).max(6).required(),
        hours: hoursSchema.required(),
        prerequisites: Joi.array().items(courseCodeSchema.optional()).default([]),
        corequisites: Joi.array().items(courseCodeSchema.optional()).default([]),
        programs: Joi.array().items(programRefSchema).min(1).required(),
        school: Joi.string().hex().length(24).required(),
        department: Joi.string().max(100).optional(),
        level: Joi.string().valid('1', '2', '3', '4', 'graduate', 'undergraduate').required(),
        delivery: Joi.array().items(
            Joi.string().valid('in-person', 'online', 'hybrid', 'blended')
        ).min(1).default(['in-person']),
        language: Joi.string().valid('english', 'french', 'bilingual').default('english'),
        difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
        tags: Joi.array().items(Joi.string().max(30)).default([]),
        learningOutcomes: Joi.array().items(Joi.string().max(200)).default([]),
        assessmentMethods: Joi.array().items(Joi.string().max(100)).default([]),
        textbooks: Joi.array().items(textbookSchema).default([]),
        professors: Joi.array().items(professorSchema).default([]),
        isActive: Joi.boolean().default(true)
    }),

    update: Joi.object({
        name: Joi.string().min(3).max(150).optional(),
        description: Joi.string().min(10).max(2000).optional(),
        credits: Joi.number().min(0.5).max(6).optional(),
        hours: hoursSchema.optional(),
        prerequisites: Joi.array().items(courseCodeSchema.optional()).optional(),
        corequisites: Joi.array().items(courseCodeSchema.optional()).optional(),
        programs: Joi.array().items(programRefSchema).min(1).optional(),
        department: Joi.string().max(100).optional(),
        level: Joi.string().valid('1', '2', '3', '4', 'graduate', 'undergraduate').optional(),
        delivery: Joi.array().items(
            Joi.string().valid('in-person', 'online', 'hybrid', 'blended')
        ).min(1).optional(),
        language: Joi.string().valid('english', 'french', 'bilingual').optional(),
        difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
        tags: Joi.array().items(Joi.string().max(30)).optional(),
        learningOutcomes: Joi.array().items(Joi.string().max(200)).optional(),
        assessmentMethods: Joi.array().items(Joi.string().max(100)).optional(),
        textbooks: Joi.array().items(textbookSchema).optional(),
        professors: Joi.array().items(professorSchema).optional(),
        isActive: Joi.boolean().optional()
    }),

    query: Joi.object({
        page: Joi.number().min(1).max(1000).default(1),
        limit: Joi.number().min(1).max(100).default(20),
        search: Joi.string().max(100).optional(),
        program: Joi.string().hex().length(24).optional(),
        school: Joi.string().hex().length(24).optional(),
        level: Joi.string().valid('1', '2', '3', '4', 'graduate', 'undergraduate').optional(),
        difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
        language: Joi.string().valid('english', 'french', 'bilingual').optional(),
        delivery: Joi.string().valid('in-person', 'online', 'hybrid', 'blended').optional(),
        sortBy: Joi.string().valid('name', 'code', 'credits', 'level', 'createdAt').default('name'),
        sortOrder: Joi.string().valid('asc', 'desc').default('asc')
    }),

    enrollment: Joi.object({
        semester: Joi.number().min(1).max(8).optional(),
        year: Joi.number().min(2020).max(new Date().getFullYear() + 2).optional(),
        term: Joi.string().valid('fall', 'winter', 'summer').optional()
    })
};

// Validation middleware factory
const createCourseValidator = (schema: Joi.ObjectSchema, source: 'body' | 'query' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = source === 'body' ? req.body : req.query;
            
            const { error, value } = schema.validate(dataToValidate, {
                abortEarly: false,
                stripUnknown: true,
                convert: true
            });

            if (error) {
                const errorMessages = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    value: detail.context?.value
                }));

                return res.status(400).json({
                    success: false,
                    message: 'Course validation failed',
                    errors: errorMessages
                });
            }

            // Update the request with validated data
            if (source === 'body') {
                req.body = value;
            } else {
                req.query = value;
            }

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

// ObjectId validation middleware
export const validateCourseId = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid course ID format'
        });
    }
    
    next();
};

// Prerequisites validation middleware
export const validatePrerequisites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { prerequisites } = req.body;
        
        if (prerequisites && prerequisites.length > 0) {
            // Check if all prerequisites are valid course codes
            const invalidCodes = prerequisites.filter((code: string) => 
                !/^[A-Z]{3}[0-9]{3}$/.test(code)
            );
            
            if (invalidCodes.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid prerequisite course codes: ${invalidCodes.join(', ')}`
                });
            }
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

// Export validators
export const courseValidators = {
    validateCreateCourse: createCourseValidator(courseSchemas.create),
    validateUpdateCourse: createCourseValidator(courseSchemas.update),
    validateCourseQuery: createCourseValidator(courseSchemas.query, 'query'),
    validateEnrollment: createCourseValidator(courseSchemas.enrollment),
    validateCourseId,
    validatePrerequisites
};

// Export schemas for reuse
export { courseSchemas };