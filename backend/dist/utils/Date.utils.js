"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRange = exports.addDays = exports.isValidDate = exports.timeAgo = exports.formatDate = void 0;
// utils/date.utils.ts
const logger_utils_1 = require("./logger.utils");
// Format date to readable string
const formatDate = (date, format = 'short') => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        switch (format) {
            case 'short':
                return dateObj.toLocaleDateString();
            case 'long':
                return dateObj.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'iso':
                return dateObj.toISOString();
            default:
                return dateObj.toLocaleDateString();
        }
    }
    catch (error) {
        logger_utils_1.logger.error('Date formatting error:', error);
        return 'Invalid Date';
    }
};
exports.formatDate = formatDate;
// Calculate time ago
const timeAgo = (date) => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        if (years > 0)
            return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0)
            return `${months} month${months > 1 ? 's' : ''} ago`;
        if (weeks > 0)
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        if (days > 0)
            return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0)
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0)
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }
    catch (error) {
        logger_utils_1.logger.error('Time ago calculation error:', error);
        return 'Unknown';
    }
};
exports.timeAgo = timeAgo;
// Check if date is valid
const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
// Add days to date
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
exports.addDays = addDays;
// Get date range
const getDateRange = (period) => {
    const now = new Date();
    const start = new Date();
    switch (period) {
        case '1d':
            start.setDate(now.getDate() - 1);
            break;
        case '7d':
            start.setDate(now.getDate() - 7);
            break;
        case '30d':
            start.setDate(now.getDate() - 30);
            break;
        case '1y':
            start.setFullYear(now.getFullYear() - 1);
            break;
        default:
            start.setDate(now.getDate() - 7);
    }
    return { start, end: now };
};
exports.getDateRange = getDateRange;
//# sourceMappingURL=Date.utils.js.map