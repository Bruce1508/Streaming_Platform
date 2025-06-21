// utils/search.utils.ts
import { logger } from './logger.utils';

// Build search query for MongoDB
export const buildSearchQuery = (searchTerm: string, searchFields: string[]) => {
    if (!searchTerm || !searchFields.length) return {};
    
    const searchRegex = new RegExp(searchTerm, 'i');
    
    return {
        $or: searchFields.map(field => ({
            [field]: searchRegex
        }))
    };
};

// Build advanced search query
export const buildAdvancedSearchQuery = (filters: any) => {
    const query: any = {};
    
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

// Highlight search terms in text
export const highlightSearchTerms = (text: string, searchTerm: string, className: string = 'highlight'): string => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, `<span class="${className}">$1</span>`);
};

// Extract search suggestions
export const extractSearchSuggestions = (documents: any[], searchField: string, limit: number = 10): string[] => {
    const suggestions = new Set<string>();
    
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

// Calculate search relevance score
export const calculateRelevanceScore = (document: any, searchTerm: string, weightedFields: { [key: string]: number }): number => {
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

// Search materials with advanced filtering
export const searchMaterials = async (Model: any, filters: any) => {
    try {
        const query = buildAdvancedSearchQuery(filters);
        
        const materials = await Model.find(query)
            .populate('courseId', 'name code')
            .populate('uploadedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(filters.limit || 20);
        
        return materials;
    } catch (error) {
        logger.error('Material search error:', error);
        return [];
    }
};

// Search users with role filtering
export const searchUsers = async (Model: any, filters: any) => {
    try {
        const query: any = {};
        
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
        
        const users = await Model.find(query)
            .select('-password -refreshTokens')
            .populate('profile.programId', 'name')
            .sort({ firstName: 1 })
            .limit(filters.limit || 20);
        
        return users;
    } catch (error) {
        logger.error('User search error:', error);
        return [];
    }
};

// Search courses with enrollment info
export const searchCourses = async (Model: any, filters: any) => {
    try {
        const query: any = {};
        
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
        
        const courses = await Model.find(query)
            .populate('programId', 'name')
            .populate('instructor', 'firstName lastName')
            .sort({ name: 1 })
            .limit(filters.limit || 20);
        
        return courses;
    } catch (error) {
        logger.error('Course search error:', error);
        return [];
    }
};