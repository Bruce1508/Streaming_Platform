"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatArray = exports.maskEmail = exports.formatAcademicYear = exports.formatGrade = exports.generateSlug = exports.formatDuration = exports.truncate = exports.titleCase = exports.capitalize = exports.formatPhoneNumber = exports.formatCurrency = exports.formatPercentage = exports.formatNumber = exports.formatFileSize = void 0;
// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
exports.formatFileSize = formatFileSize;
// Format number with commas
const formatNumber = (num) => {
    return num.toLocaleString();
};
exports.formatNumber = formatNumber;
// Format percentage
const formatPercentage = (value, total, decimals = 1) => {
    if (total === 0)
        return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimals)}%`;
};
exports.formatPercentage = formatPercentage;
// Format currency
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
// Format phone number
const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
};
exports.formatPhoneNumber = formatPhoneNumber;
// Capitalize first letter
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
exports.capitalize = capitalize;
// Title case
const titleCase = (str) => {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
exports.titleCase = titleCase;
// Truncate text
const truncate = (text, length, suffix = '...') => {
    if (text.length <= length)
        return text;
    return text.substring(0, length).trim() + suffix;
};
exports.truncate = truncate;
// Format duration (seconds to human readable)
const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }
    else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    else {
        return `${secs}s`;
    }
};
exports.formatDuration = formatDuration;
// Slug generation
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.generateSlug = generateSlug;
// Format grade
const formatGrade = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90)
        return 'A';
    if (percentage >= 80)
        return 'B';
    if (percentage >= 70)
        return 'C';
    if (percentage >= 60)
        return 'D';
    return 'F';
};
exports.formatGrade = formatGrade;
// Format academic year
const formatAcademicYear = (year) => {
    const yearNames = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Postgraduate'];
    return yearNames[year - 1] || `Year ${year}`;
};
exports.formatAcademicYear = formatAcademicYear;
// Mask sensitive data
const maskEmail = (email) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
};
exports.maskEmail = maskEmail;
// Format array to readable string
const formatArray = (arr, conjunction = 'and') => {
    if (arr.length === 0)
        return '';
    if (arr.length === 1)
        return arr[0];
    if (arr.length === 2)
        return `${arr[0]} ${conjunction} ${arr[1]}`;
    return `${arr.slice(0, -1).join(', ')}, ${conjunction} ${arr[arr.length - 1]}`;
};
exports.formatArray = formatArray;
//# sourceMappingURL=Format.utils.js.map