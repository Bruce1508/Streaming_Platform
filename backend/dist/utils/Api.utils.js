"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApiKey = exports.logApiRequest = exports.buildMongoQuery = exports.extractSearchFilter = exports.extractSortOptions = exports.extractPagination = exports.createPaginatedResponse = void 0;
const ApiResponse_1 = require("./ApiResponse");
const logger_utils_1 = require("./logger.utils");
// Create paginated response
const createPaginatedResponse = (data, total, page, limit, message = 'Data retrieved successfully') => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    return new ApiResponse_1.ApiResponse(200, {
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
exports.createPaginatedResponse = createPaginatedResponse;
// Extract pagination from request
const extractPagination = (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.extractPagination = extractPagination;
// Extract sort options from request
const extractSortOptions = (req, defaultSort = { createdAt: -1 }) => {
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder;
    if (!sortBy)
        return defaultSort;
    const order = sortOrder === 'desc' ? -1 : 1;
    return { [sortBy]: order };
};
exports.extractSortOptions = extractSortOptions;
// Extract search filter
const extractSearchFilter = (req, searchFields) => {
    const search = req.query.search;
    if (!search || !searchFields.length)
        return {};
    return {
        $or: searchFields.map(field => ({
            [field]: { $regex: search, $options: 'i' }
        }))
    };
};
exports.extractSearchFilter = extractSearchFilter;
// Build MongoDB query from request
const buildMongoQuery = (req, allowedFilters = []) => {
    const query = {};
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
            query.createdAt.$gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
            query.createdAt.$lte = new Date(req.query.endDate);
        }
    }
    return query;
};
exports.buildMongoQuery = buildMongoQuery;
// Log API request
const logApiRequest = (req) => {
    var _a;
    logger_utils_1.logger.info('API Request:', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous'
    });
};
exports.logApiRequest = logApiRequest;
// Generate API key
const generateApiKey = () => {
    return `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
exports.generateApiKey = generateApiKey;
//# sourceMappingURL=Api.utils.js.map