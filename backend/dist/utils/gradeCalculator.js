"use strict";
// utils/gradeCalculator.ts - Grade calculation utilities for 0-100 point system
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGradeColor = exports.calculateGradeDistribution = exports.calculateAverageRating = exports.getGradeFromScore = void 0;
/**
 * Convert a 0-100 score to letter grade
 * @param score - Score from 0 to 100
 * @returns Letter grade (A+, A, B+, B, C+, C, D, F)
 */
const getGradeFromScore = (score) => {
    if (score >= 90)
        return 'A+';
    if (score >= 80)
        return 'A';
    if (score >= 75)
        return 'B+';
    if (score >= 70)
        return 'B';
    if (score >= 65)
        return 'C+';
    if (score >= 60)
        return 'C';
    if (score >= 50)
        return 'D';
    return 'F';
};
exports.getGradeFromScore = getGradeFromScore;
/**
 * Calculate average rating from multiple criteria
 * @param ratings - Object containing multiple rating scores
 * @returns Average score (0-100)
 */
const calculateAverageRating = (ratings) => {
    const { instructorRating, contentQualityRating, practicalValueRating } = ratings;
    return Math.round((instructorRating + contentQualityRating + practicalValueRating) / 3);
};
exports.calculateAverageRating = calculateAverageRating;
/**
 * Get grade distribution from an array of reviews
 * @param reviews - Array of reviews with ratings
 * @returns Object with count for each grade
 */
const calculateGradeDistribution = (reviews) => {
    const distribution = {
        'A+': 0, 'A': 0, 'B+': 0, 'B': 0,
        'C+': 0, 'C': 0, 'D': 0, 'F': 0
    };
    reviews.forEach(review => {
        const avgScore = (0, exports.calculateAverageRating)(review.ratings);
        const grade = (0, exports.getGradeFromScore)(avgScore);
        distribution[grade]++;
    });
    return distribution;
};
exports.calculateGradeDistribution = calculateGradeDistribution;
/**
 * Get color class for grade display
 * @param grade - Letter grade
 * @returns CSS color class
 */
const getGradeColor = (grade) => {
    switch (grade) {
        case 'A+': return 'text-green-600';
        case 'A': return 'text-green-500';
        case 'B+': return 'text-blue-600';
        case 'B': return 'text-blue-500';
        case 'C+': return 'text-yellow-600';
        case 'C': return 'text-yellow-500';
        case 'D': return 'text-orange-500';
        case 'F': return 'text-red-500';
        default: return 'text-gray-500';
    }
};
exports.getGradeColor = getGradeColor;
//# sourceMappingURL=gradeCalculator.js.map