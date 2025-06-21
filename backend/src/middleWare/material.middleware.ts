// backend/src/middleware/material.middleware.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// ✅ Academic-focused categories only
const VALID_CATEGORIES = [
    'lecture-notes', 'assignment', 'lab-report', 'project',
    'midterm-exam', 'final-exam', 'quiz', 'presentation',
    'tutorial', 'reference', 'textbook', 'cheat-sheet', 'solution', 'other'
];

// ✅ Academic difficulty levels
const VALID_DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

// ✅ Valid sort options
const VALID_SORT_OPTIONS = ['newest', 'oldest', 'popular', 'rating', 'title', 'relevance'];

// ✅ Allowed file types for academic materials
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'text/plain', // .txt
    'image/jpeg',
    'image/png',
    'image/gif'
];

// ===== VALIDATION HELPERS =====
const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

const isValidRating = (rating: number): boolean => {
    return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

const sanitizeString = (str: string): string => {
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
};

const processTags = (tags: any): string[] => {
    if (!tags) return [];
    if (typeof tags === 'string') {
        return tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
    }
    if (Array.isArray(tags)) {
        return tags.map(tag => String(tag).trim().toLowerCase()).filter(tag => tag.length > 0);
    }
    return [];
};

const validatePagination = (page?: string, limit?: string) => {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '12');
    
    return {
        page: Math.max(1, isNaN(pageNum) ? 1 : pageNum),
        limit: Math.max(1, Math.min(50, isNaN(limitNum) ? 12 : limitNum))
    };
};

// ===== MIDDLEWARE FUNCTIONS =====

// ✅ Validate ObjectId parameter
export const validateObjectId = (paramName: string = 'id') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const id = req.params[paramName];
        
        if (!id) {
            res.status(400).json({
                success: false,
                message: `${paramName} parameter is required`
            });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({
                success: false,
                message: `Invalid ${paramName} format`
            });
            return;
        }

        next();
    };
};

// ✅ Validate study material creation
export const validateCreateMaterial = (req: Request, res: Response, next: NextFunction): void => {
    const { 
        title, 
        description, 
        category, 
        academic,
        metadata,
        attachments 
    } = req.body;
    
    const errors: Array<{ field: string; message: string }> = [];

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
    } else if (title.trim().length > 200) {
        errors.push({ field: 'title', message: 'Title must not exceed 200 characters' });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push({ field: 'description', message: 'Description is required and must be a non-empty string' });
    } else if (description.trim().length > 1000) {
        errors.push({ field: 'description', message: 'Description must not exceed 1000 characters' });
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
        errors.push({ 
            field: 'category', 
            message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` 
        });
    }

    // Validate academic context (required)
    if (!academic || typeof academic !== 'object') {
        errors.push({ field: 'academic', message: 'Academic context is required' });
    } else {
        if (!academic.school || !isValidObjectId(academic.school)) {
            errors.push({ field: 'academic.school', message: 'Valid school ID is required' });
        }
        if (!academic.program || !isValidObjectId(academic.program)) {
            errors.push({ field: 'academic.program', message: 'Valid program ID is required' });
        }
        if (!academic.course || !isValidObjectId(academic.course)) {
            errors.push({ field: 'academic.course', message: 'Valid course ID is required' });
        }
        if (!academic.semester || !academic.semester.term || !academic.semester.year) {
            errors.push({ field: 'academic.semester', message: 'Semester term and year are required' });
        }
    }

    // Validate metadata
    if (metadata) {
        if (metadata.difficulty && !VALID_DIFFICULTY_LEVELS.includes(metadata.difficulty)) {
            errors.push({ 
                field: 'metadata.difficulty', 
                message: `Difficulty must be one of: ${VALID_DIFFICULTY_LEVELS.join(', ')}` 
            });
        }
        if (metadata.completionTime && (typeof metadata.completionTime !== 'number' || metadata.completionTime < 1 || metadata.completionTime > 480)) {
            errors.push({ field: 'metadata.completionTime', message: 'Completion time must be between 1 and 480 minutes' });
        }
    }

    // Validate attachments if provided
    if (attachments && Array.isArray(attachments)) {
        attachments.forEach((attachment: any, index: number) => {
            if (!attachment.filename) {
                errors.push({ field: `attachments[${index}].filename`, message: 'Filename is required' });
            }
            if (!attachment.mimeType || !ALLOWED_FILE_TYPES.includes(attachment.mimeType)) {
                errors.push({ 
                    field: `attachments[${index}].mimeType`, 
                    message: 'Invalid file type. Allowed types: PDF, Word, PowerPoint, Images, Text files' 
                });
            }
            if (!attachment.size || attachment.size > 50 * 1024 * 1024) { // 50MB
                errors.push({ field: `attachments[${index}].size`, message: 'File size must not exceed 50MB' });
            }
        });
    }

    // Return errors if any
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }

    // Sanitize and process data
    req.body.title = sanitizeString(title);
    req.body.description = sanitizeString(description);
    req.body.category = category.toLowerCase();
    
    if (metadata && metadata.difficulty) {
        req.body.metadata.difficulty = metadata.difficulty.toLowerCase();
    }

    next();
};

// ✅ Validate study material update
export const validateUpdateMaterial = (req: Request, res: Response, next: NextFunction): void => {
    const { title, description, category, metadata } = req.body;
    
    const errors: Array<{ field: string; message: string }> = [];

    // Validate optional fields (only if provided)
    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
            errors.push({ field: 'title', message: 'Title must be a non-empty string' });
        } else if (title.trim().length > 200) {
            errors.push({ field: 'title', message: 'Title must not exceed 200 characters' });
        }
    }

    if (description !== undefined) {
        if (typeof description !== 'string' || description.trim().length === 0) {
            errors.push({ field: 'description', message: 'Description must be a non-empty string' });
        } else if (description.trim().length > 1000) {
            errors.push({ field: 'description', message: 'Description must not exceed 1000 characters' });
        }
    }

    if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
        errors.push({ 
            field: 'category', 
            message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` 
        });
    }

    if (metadata && metadata.difficulty !== undefined && !VALID_DIFFICULTY_LEVELS.includes(metadata.difficulty)) {
        errors.push({ 
            field: 'metadata.difficulty', 
            message: `Difficulty must be one of: ${VALID_DIFFICULTY_LEVELS.join(', ')}` 
        });
    }

    // Return errors if any
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }

    // Sanitize data if provided
    if (title) req.body.title = sanitizeString(title);
    if (description) req.body.description = sanitizeString(description);
    if (category) req.body.category = category.toLowerCase();
    if (metadata && metadata.difficulty) req.body.metadata.difficulty = metadata.difficulty.toLowerCase();

    next();
};

// ✅ Validate rating input
export const validateRating = (req: Request, res: Response, next: NextFunction): void => {
    const { rating } = req.body;

    if (!rating) {
        res.status(400).json({
            success: false,
            message: 'Rating is required'
        });
        return;
    }

    const ratingNum = parseInt(rating);
    if (!isValidRating(ratingNum)) {
        res.status(400).json({
            success: false,
            message: 'Rating must be an integer between 1 and 5'
        });
        return;
    }

    req.body.rating = ratingNum;
    next();
};

// ✅ Validate comment input
export const validateComment = (req: Request, res: Response, next: NextFunction): void => {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({
            success: false,
            message: 'Comment content is required and must be a non-empty string'
        });
        return;
    }

    if (content.trim().length > 500) {
        res.status(400).json({
            success: false,
            message: 'Comment must not exceed 500 characters'
        });
        return;
    }

    req.body.content = sanitizeString(content);
    next();
};

// ✅ Validate query parameters
export const validateQueryParams = (req: Request, res: Response, next: NextFunction): void => {
    const { page, limit, category, difficulty, sort, school, program, course } = req.query;

    // Validate pagination
    const pagination = validatePagination(page as string, limit as string);
    req.query.page = pagination.page.toString();
    req.query.limit = pagination.limit.toString();

    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes(category as string)) {
        res.status(400).json({
            success: false,
            message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
        });
        return;
    }

    // Validate difficulty if provided
    if (difficulty && !VALID_DIFFICULTY_LEVELS.includes(difficulty as string)) {
        res.status(400).json({
            success: false,
            message: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTY_LEVELS.join(', ')}`
        });
        return;
    }

    // Validate sort parameter
    if (sort && !VALID_SORT_OPTIONS.includes(sort as string)) {
        res.status(400).json({
            success: false,
            message: `Invalid sort parameter. Must be one of: ${VALID_SORT_OPTIONS.join(', ')}`
        });
        return;
    }

    // Validate ObjectIds if provided
    if (school && !isValidObjectId(school as string)) {
        res.status(400).json({
            success: false,
            message: 'Invalid school ID format'
        });
        return;
    }

    if (program && !isValidObjectId(program as string)) {
        res.status(400).json({
            success: false,
            message: 'Invalid program ID format'
        });
        return;
    }

    if (course && !isValidObjectId(course as string)) {
        res.status(400).json({
            success: false,
            message: 'Invalid course ID format'
        });
        return;
    }

    next();
};