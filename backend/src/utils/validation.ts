import mongoose from 'mongoose';

// ✅ Common validation utilities
export class ValidationUtils {
    
    // Check if string is valid ObjectId
    static isValidObjectId(id: string): boolean {
        return mongoose.Types.ObjectId.isValid(id);
    }

    // Sanitize string input
    static sanitizeString(input: string): string {
        return input.trim().replace(/[<>]/g, ''); // Basic XSS protection
    }

    // Validate email format
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    static isValidPassword(password: string): boolean {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    // Validate file size (in bytes)
    static isValidFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean { // 10MB default
        return size > 0 && size <= maxSize;
    }

    // Validate file type
    static isValidFileType(fileType: string, allowedTypes: string[]): boolean {
        return allowedTypes.includes(fileType.toLowerCase());
    }

    // Validate rating value
    static isValidRating(rating: number): boolean {
        return Number.isInteger(rating) && rating >= 1 && rating <= 5;
    }

    // Validate pagination params
    static validatePagination(page?: string, limit?: string) {
        const pageNum = parseInt(page || '1');
        const limitNum = parseInt(limit || '12');
        
        return {
            page: Math.max(1, pageNum),
            limit: Math.min(Math.max(1, limitNum), 100) // Max 100 items per page
        };
    }

    // Validate and process tags
    static processTags(tags?: string): string[] {
        if (!tags) return [];
        
        return tags
            .split(',')
            .map(tag => this.sanitizeString(tag.toLowerCase()))
            .filter(tag => tag.length > 0 && tag.length <= 50) // Max 50 chars per tag
            .slice(0, 10); // Max 10 tags
    }
}

// ✅ Validation error class
export class ValidationError extends Error {
    public statusCode: number;
    public field?: string;

    constructor(message: string, statusCode: number = 400, field?: string) {
        super(message);
        this.statusCode = statusCode;
        this.field = field;
        this.name = 'ValidationError';
    }
}

// ✅ Validation result interface
export interface ValidationResult {
    isValid: boolean;
    errors: Array<{
        field: string;
        message: string;
    }>;
    sanitizedData?: any;
}