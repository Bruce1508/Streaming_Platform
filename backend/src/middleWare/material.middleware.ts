import { Request, Response, NextFunction } from 'express';
import { ValidationUtils, ValidationError, ValidationResult } from '../utils/validation';

// ✅ Allowed file types for study materials
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'text/plain', // .txt
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime' // .mov
];

// ✅ Valid categories
const VALID_CATEGORIES = [
    'mathematics',
    'science',
    'technology',
    'engineering',
    'language',
    'history',
    'geography',
    'arts',
    'music',
    'literature',
    'philosophy',
    'psychology',
    'business',
    'economics',
    'health',
    'sports',
    'other'
];

// ✅ Valid languages
const VALID_LANGUAGES = [
    'english',
    'vietnamese',
    'chinese',
    'japanese',
    'korean',
    'french',
    'german',
    'spanish',
    'other'
];

// ✅ Valid levels
const VALID_LEVELS = [
    'beginner',
    'intermediate',
    'advanced',
    'expert'
];

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

        if (!ValidationUtils.isValidObjectId(id)) {
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
    const { title, description, category, language, level, tags, fileUrl, fileType, fileSize } = req.body;
    
    const errors: Array<{ field: string; message: string }> = [];

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
    } else if (title.trim().length > 200) {
        errors.push({ field: 'title', message: 'Title must not exceed 200 characters' });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push({ field: 'description', message: 'Description is required and must be a non-empty string' });
    } else if (description.trim().length > 2000) {
        errors.push({ field: 'description', message: 'Description must not exceed 2000 characters' });
    }

    if (!category || !VALID_CATEGORIES.includes(category.toLowerCase())) {
        errors.push({ 
            field: 'category', 
            message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` 
        });
    }

    if (!language || !VALID_LANGUAGES.includes(language.toLowerCase())) {
        errors.push({ 
            field: 'language', 
            message: `Language must be one of: ${VALID_LANGUAGES.join(', ')}` 
        });
    }

    if (!level || !VALID_LEVELS.includes(level.toLowerCase())) {
        errors.push({ 
            field: 'level', 
            message: `Level must be one of: ${VALID_LEVELS.join(', ')}` 
        });
    }

    // Validate file if provided
    if (fileUrl) {
        if (!fileType) {
            errors.push({ field: 'fileType', message: 'File type is required when file URL is provided' });
        } else if (!ValidationUtils.isValidFileType(fileType, ALLOWED_FILE_TYPES)) {
            errors.push({ 
                field: 'fileType', 
                message: 'Invalid file type. Allowed types: PDF, Word, PowerPoint, Images, Videos, Text files' 
            });
        }

        if (!fileSize || typeof fileSize !== 'number') {
            errors.push({ field: 'fileSize', message: 'File size is required when file URL is provided' });
        } else if (!ValidationUtils.isValidFileSize(fileSize)) {
            errors.push({ field: 'fileSize', message: 'File size must not exceed 10MB' });
        }
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
    req.body.title = ValidationUtils.sanitizeString(title);
    req.body.description = ValidationUtils.sanitizeString(description);
    req.body.category = category.toLowerCase();
    req.body.language = language.toLowerCase();
    req.body.level = level.toLowerCase();
    req.body.tags = ValidationUtils.processTags(tags);

    next();
};

// ✅ Validate study material update
export const validateUpdateMaterial = (req: Request, res: Response, next: NextFunction): void => {
    const { title, description, category, language, level, tags, fileType, fileSize } = req.body;
    
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
        } else if (description.trim().length > 2000) {
            errors.push({ field: 'description', message: 'Description must not exceed 2000 characters' });
        }
    }

    if (category !== undefined && !VALID_CATEGORIES.includes(category.toLowerCase())) {
        errors.push({ 
            field: 'category', 
            message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` 
        });
    }

    if (language !== undefined && !VALID_LANGUAGES.includes(language.toLowerCase())) {
        errors.push({ 
            field: 'language', 
            message: `Language must be one of: ${VALID_LANGUAGES.join(', ')}` 
        });
    }

    if (level !== undefined && !VALID_LEVELS.includes(level.toLowerCase())) {
        errors.push({ 
            field: 'level', 
            message: `Level must be one of: ${VALID_LEVELS.join(', ')}` 
        });
    }

    // Validate file type if provided
    if (fileType !== undefined && fileType !== null) {
        if (!ValidationUtils.isValidFileType(fileType, ALLOWED_FILE_TYPES)) {
            errors.push({ 
                field: 'fileType', 
                message: 'Invalid file type. Allowed types: PDF, Word, PowerPoint, Images, Videos, Text files' 
            });
        }
    }

    // Validate file size if provided
    if (fileSize !== undefined && fileSize !== null) {
        if (typeof fileSize !== 'number' || !ValidationUtils.isValidFileSize(fileSize)) {
            errors.push({ field: 'fileSize', message: 'File size must be a valid number not exceeding 10MB' });
        }
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
    if (title) req.body.title = ValidationUtils.sanitizeString(title);
    if (description) req.body.description = ValidationUtils.sanitizeString(description);
    if (category) req.body.category = category.toLowerCase();
    if (language) req.body.language = language.toLowerCase();
    if (level) req.body.level = level.toLowerCase();
    if (tags) req.body.tags = ValidationUtils.processTags(tags);

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
    if (!ValidationUtils.isValidRating(ratingNum)) {
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

    if (content.trim().length > 1000) {
        res.status(400).json({
            success: false,
            message: 'Comment must not exceed 1000 characters'
        });
        return;
    }

    req.body.content = ValidationUtils.sanitizeString(content);
    next();
};

// ✅ Validate query parameters
export const validateQueryParams = (req: Request, res: Response, next: NextFunction): void => {
    const { page, limit, category, language, level, sort } = req.query;

    // Validate pagination
    const pagination = ValidationUtils.validatePagination(page as string, limit as string);
    req.query.page = pagination.page.toString();
    req.query.limit = pagination.limit.toString();

    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes((category as string).toLowerCase())) {
        res.status(400).json({
            success: false,
            message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
        });
        return;
    }

    // Validate language if provided
    if (language && !VALID_LANGUAGES.includes((language as string).toLowerCase())) {
        res.status(400).json({
            success: false,
            message: `Invalid language. Must be one of: ${VALID_LANGUAGES.join(', ')}`
        });
        return;
    }

    // Validate level if provided
    if (level && !VALID_LEVELS.includes((level as string).toLowerCase())) {
        res.status(400).json({
            success: false,
            message: `Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`
        });
        return;
    }

    // Validate sort parameter
    const validSorts = ['newest', 'oldest', 'popular', 'rating', 'title'];
    if (sort && !validSorts.includes(sort as string)) {
        res.status(400).json({
            success: false,
            message: `Invalid sort parameter. Must be one of: ${validSorts.join(', ')}`
        });
        return;
    }

    next();
};