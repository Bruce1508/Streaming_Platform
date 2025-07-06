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
exports.courseSchemas = exports.courseValidators = exports.validatePrerequisites = exports.validateCourseId = void 0;
// middleware/validation/course.validation.ts
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
// Course code validation (IPC144, CSN121, etc.)
const courseCodeSchema = joi_1.default.string()
    .pattern(/^[A-Z]{3}[0-9]{3}$/)
    .required()
    .messages({
    'string.pattern.base': 'Course code must follow format: 3 letters + 3 numbers (e.g., IPC144)'
});
// Academic hours validation
const hoursSchema = joi_1.default.object({
    lecture: joi_1.default.number().min(0).max(10).default(0),
    lab: joi_1.default.number().min(0).max(10).default(0),
    tutorial: joi_1.default.number().min(0).max(10).default(0),
    total: joi_1.default.number().min(1).max(15).required()
});
// Program reference validation
const programRefSchema = joi_1.default.object({
    program: joi_1.default.string().hex().length(24).required(),
    semester: joi_1.default.number().min(1).max(8).required(),
    isCore: joi_1.default.boolean().default(true),
    isElective: joi_1.default.boolean().default(false)
});
// Textbook validation
const textbookSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).max(200).required(),
    author: joi_1.default.string().min(1).max(100).required(),
    isbn: joi_1.default.string().pattern(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/).optional(),
    required: joi_1.default.boolean().default(true)
});
// Professor validation
const professorSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().optional(),
    rating: joi_1.default.number().min(1).max(5).optional()
});
// Main course validation schemas
const courseSchemas = {
    create: joi_1.default.object({
        code: courseCodeSchema,
        name: joi_1.default.string().min(3).max(150).required(),
        description: joi_1.default.string().min(10).max(2000).required(),
        credits: joi_1.default.number().min(0.5).max(6).required(),
        hours: hoursSchema.required(),
        prerequisites: joi_1.default.array().items(courseCodeSchema.optional()).default([]),
        corequisites: joi_1.default.array().items(courseCodeSchema.optional()).default([]),
        programs: joi_1.default.array().items(programRefSchema).min(1).required(),
        school: joi_1.default.string().hex().length(24).required(),
        department: joi_1.default.string().max(100).optional(),
        level: joi_1.default.string().valid('1', '2', '3', '4', 'graduate', 'undergraduate').required(),
        delivery: joi_1.default.array().items(joi_1.default.string().valid('in-person', 'online', 'hybrid', 'blended')).min(1).default(['in-person']),
        language: joi_1.default.string().valid('english', 'french', 'bilingual').default('english'),
        difficulty: joi_1.default.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
        tags: joi_1.default.array().items(joi_1.default.string().max(30)).default([]),
        learningOutcomes: joi_1.default.array().items(joi_1.default.string().max(200)).default([]),
        assessmentMethods: joi_1.default.array().items(joi_1.default.string().max(100)).default([]),
        textbooks: joi_1.default.array().items(textbookSchema).default([]),
        professors: joi_1.default.array().items(professorSchema).default([]),
        isActive: joi_1.default.boolean().default(true)
    }),
    update: joi_1.default.object({
        name: joi_1.default.string().min(3).max(150).optional(),
        description: joi_1.default.string().min(10).max(2000).optional(),
        credits: joi_1.default.number().min(0.5).max(6).optional(),
        hours: hoursSchema.optional(),
        prerequisites: joi_1.default.array().items(courseCodeSchema.optional()).optional(),
        corequisites: joi_1.default.array().items(courseCodeSchema.optional()).optional(),
        programs: joi_1.default.array().items(programRefSchema).min(1).optional(),
        department: joi_1.default.string().max(100).optional(),
        level: joi_1.default.string().valid('1', '2', '3', '4', 'graduate', 'undergraduate').optional(),
        delivery: joi_1.default.array().items(joi_1.default.string().valid('in-person', 'online', 'hybrid', 'blended')).min(1).optional(),
        language: joi_1.default.string().valid('english', 'french', 'bilingual').optional(),
        difficulty: joi_1.default.string().valid('beginner', 'intermediate', 'advanced').optional(),
        tags: joi_1.default.array().items(joi_1.default.string().max(30)).optional(),
        learningOutcomes: joi_1.default.array().items(joi_1.default.string().max(200)).optional(),
        assessmentMethods: joi_1.default.array().items(joi_1.default.string().max(100)).optional(),
        textbooks: joi_1.default.array().items(textbookSchema).optional(),
        professors: joi_1.default.array().items(professorSchema).optional(),
        isActive: joi_1.default.boolean().optional()
    }),
    query: joi_1.default.object({
        page: joi_1.default.number().min(1).max(1000).default(1),
        limit: joi_1.default.number().min(1).max(100).default(20),
        search: joi_1.default.string().max(100).optional(),
        program: joi_1.default.string().hex().length(24).optional(),
        school: joi_1.default.string().hex().length(24).optional(),
        level: joi_1.default.string().valid('1', '2', '3', '4', 'graduate', 'undergraduate').optional(),
        difficulty: joi_1.default.string().valid('beginner', 'intermediate', 'advanced').optional(),
        language: joi_1.default.string().valid('english', 'french', 'bilingual').optional(),
        delivery: joi_1.default.string().valid('in-person', 'online', 'hybrid', 'blended').optional(),
        sortBy: joi_1.default.string().valid('name', 'code', 'credits', 'level', 'createdAt').default('name'),
        sortOrder: joi_1.default.string().valid('asc', 'desc').default('asc')
    }),
    enrollment: joi_1.default.object({
        semester: joi_1.default.number().min(1).max(8).optional(),
        year: joi_1.default.number().min(2020).max(new Date().getFullYear() + 2).optional(),
        term: joi_1.default.string().valid('fall', 'winter', 'summer').optional()
    })
};
exports.courseSchemas = courseSchemas;
// Validation middleware factory
const createCourseValidator = (schema, source = 'body') => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dataToValidate = source === 'body' ? req.body : req.query;
            const { error, value } = schema.validate(dataToValidate, {
                abortEarly: false,
                stripUnknown: true,
                convert: true
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
                return res.status(400).json({
                    success: false,
                    message: 'Course validation failed',
                    errors: errorMessages
                });
            }
            // Update the request with validated data
            if (source === 'body') {
                req.body = value;
            }
            else {
                req.query = value;
            }
            next();
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Validation error',
                error: err.message
            });
        }
    });
};
// ObjectId validation middleware
const validateCourseId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid course ID format'
        });
    }
    next();
};
exports.validateCourseId = validateCourseId;
// Prerequisites validation middleware
const validatePrerequisites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prerequisites } = req.body;
        if (prerequisites && prerequisites.length > 0) {
            // Check if all prerequisites are valid course codes
            const invalidCodes = prerequisites.filter((code) => !/^[A-Z]{3}[0-9]{3}$/.test(code));
            if (invalidCodes.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid prerequisite course codes: ${invalidCodes.join(', ')}`
                });
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.validatePrerequisites = validatePrerequisites;
// Export validators
exports.courseValidators = {
    validateCreateCourse: createCourseValidator(courseSchemas.create),
    validateUpdateCourse: createCourseValidator(courseSchemas.update),
    validateCourseQuery: createCourseValidator(courseSchemas.query, 'query'),
    validateEnrollment: createCourseValidator(courseSchemas.enrollment),
    validateCourseId: exports.validateCourseId,
    validatePrerequisites: exports.validatePrerequisites
};
//# sourceMappingURL=course.validation.js.map