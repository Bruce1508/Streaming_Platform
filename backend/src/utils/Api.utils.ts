// utils/api.utils.ts
import { Request } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiResponse } from './ApiResponse';
import { logger } from './logger.utils';

// Create paginated response
export const createPaginatedResponse = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Data retrieved successfully'
) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return new ApiResponse(200, {
        data,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null
        }
    }, message);
};

// Extract pagination from request
export const extractPagination = (req: Request) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

// Extract sort options from request
export const extractSortOptions = (req: Request, defaultSort: any = { createdAt: -1 }) => {
    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder as string;

    if (!sortBy) return defaultSort;

    const order = sortOrder === 'desc' ? -1 : 1;
    return { [sortBy]: order };
};

// Extract search filter
export const extractSearchFilter = (req: Request, searchFields: string[]) => {
    const search = req.query.search as string;
    
    if (!search || !searchFields.length) return {};

    return {
        $or: searchFields.map(field => ({
            [field]: { $regex: search, $options: 'i' }
        }))
    };
};

// Build MongoDB query from request
export const buildMongoQuery = (req: Request, allowedFilters: string[] = []) => {
    const query: any = {};

    // Extract allowed filters
    allowedFilters.forEach(filter => {
        if (req.query[filter]) {
            query[filter] = req.query[filter];
        }
    });

    // Handle date range
    if (req.query.startDate || req.query.endDate) {
        query.createdAt = {};
        if (req.query.startDate) {
            query.createdAt.$gte = new Date(req.query.startDate as string);
        }
        if (req.query.endDate) {
            query.createdAt.$lte = new Date(req.query.endDate as string);
        }
    }

    return query;
};

// Log API request
export const logApiRequest = (req: AuthRequest) => {
    logger.info('API Request:', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous'
    });
};

// Generate API key
export const generateApiKey = (): string => {
    return `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};