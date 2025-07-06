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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCourses = exports.searchUsers = exports.searchMaterials = exports.calculateRelevanceScore = exports.extractSearchSuggestions = exports.highlightSearchTerms = exports.buildAdvancedSearchQuery = exports.buildSearchQuery = void 0;
// utils/search.utils.ts
const logger_utils_1 = require("./logger.utils");
// Build search query for MongoDB
const buildSearchQuery = (searchTerm, searchFields) => {
    if (!searchTerm || !searchFields.length)
        return {};
    const searchRegex = new RegExp(searchTerm, 'i');
    return {
        $or: searchFields.map(field => ({
            [field]: searchRegex
        }))
    };
};
exports.buildSearchQuery = buildSearchQuery;
// Build advanced search query
const buildAdvancedSearchQuery = (filters) => {
    const query = {};
    // Text search
    if (filters.search) {
        query.$text = { $search: filters.search };
    }
    // Category filter
    if (filters.category) {
        query.category = filters.category;
    }
    // Status filter
    if (filters.status) {
        query.status = filters.status;
    }
    // Date range
    if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
            query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
            query.createdAt.$lte = new Date(filters.endDate);
        }
    }
    // Tags
    if (filters.tags && filters.tags.length) {
        query.tags = { $in: filters.tags };
    }
    return query;
};
exports.buildAdvancedSearchQuery = buildAdvancedSearchQuery;
// Highlight search terms in text
const highlightSearchTerms = (text, searchTerm, className = 'highlight') => {
    if (!searchTerm)
        return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, `<span class="${className}">$1</span>`);
};
exports.highlightSearchTerms = highlightSearchTerms;
// Extract search suggestions
const extractSearchSuggestions = (documents, searchField, limit = 10) => {
    const suggestions = new Set();
    documents.forEach(doc => {
        const value = doc[searchField];
        if (typeof value === 'string') {
            const words = value.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.length > 2) {
                    suggestions.add(word);
                }
            });
        }
    });
    return Array.from(suggestions).slice(0, limit);
};
exports.extractSearchSuggestions = extractSearchSuggestions;
// Calculate search relevance score
const calculateRelevanceScore = (document, searchTerm, weightedFields) => {
    let score = 0;
    const lowerSearchTerm = searchTerm.toLowerCase();
    Object.entries(weightedFields).forEach(([field, weight]) => {
        const fieldValue = document[field];
        if (typeof fieldValue === 'string') {
            const lowerFieldValue = fieldValue.toLowerCase();
            // Exact match
            if (lowerFieldValue === lowerSearchTerm) {
                score += weight * 10;
            }
            // Starts with
            else if (lowerFieldValue.startsWith(lowerSearchTerm)) {
                score += weight * 5;
            }
            // Contains
            else if (lowerFieldValue.includes(lowerSearchTerm)) {
                score += weight * 2;
            }
            // Word match
            else if (lowerFieldValue.split(/\s+/).some(word => word === lowerSearchTerm)) {
                score += weight * 3;
            }
        }
    });
    return score;
};
exports.calculateRelevanceScore = calculateRelevanceScore;
// Search materials with advanced filtering
const searchMaterials = (Model, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = (0, exports.buildAdvancedSearchQuery)(filters);
        const materials = yield Model.find(query)
            .populate('courseId', 'name code')
            .populate('uploadedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(filters.limit || 20);
        return materials;
    }
    catch (error) {
        logger_utils_1.logger.error('Material search error:', error);
        return [];
    }
});
exports.searchMaterials = searchMaterials;
// Search users with role filtering
const searchUsers = (Model, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {};
        if (filters.search) {
            query.$or = [
                { firstName: new RegExp(filters.search, 'i') },
                { lastName: new RegExp(filters.search, 'i') },
                { email: new RegExp(filters.search, 'i') }
            ];
        }
        if (filters.role) {
            query.role = filters.role;
        }
        if (filters.program) {
            query['profile.programId'] = filters.program;
        }
        const users = yield Model.find(query)
            .select('-password -refreshTokens')
            .populate('profile.programId', 'name')
            .sort({ firstName: 1 })
            .limit(filters.limit || 20);
        return users;
    }
    catch (error) {
        logger_utils_1.logger.error('User search error:', error);
        return [];
    }
});
exports.searchUsers = searchUsers;
// Search courses with enrollment info
const searchCourses = (Model, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {};
        if (filters.search) {
            query.$or = [
                { name: new RegExp(filters.search, 'i') },
                { code: new RegExp(filters.search, 'i') },
                { description: new RegExp(filters.search, 'i') }
            ];
        }
        if (filters.program) {
            query.programId = filters.program;
        }
        if (filters.semester) {
            query.semester = filters.semester;
        }
        if (filters.year) {
            query.year = filters.year;
        }
        const courses = yield Model.find(query)
            .populate('programId', 'name')
            .populate('instructor', 'firstName lastName')
            .sort({ name: 1 })
            .limit(filters.limit || 20);
        return courses;
    }
    catch (error) {
        logger_utils_1.logger.error('Course search error:', error);
        return [];
    }
});
exports.searchCourses = searchCourses;
//# sourceMappingURL=Search.utils.js.map