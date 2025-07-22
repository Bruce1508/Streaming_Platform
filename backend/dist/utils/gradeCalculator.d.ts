/**
 * Convert a 0-100 score to letter grade
 * @param score - Score from 0 to 100
 * @returns Letter grade (A+, A, B+, B, C+, C, D, F)
 */
export declare const getGradeFromScore: (score: number) => string;
/**
 * Calculate average rating from multiple criteria
 * @param ratings - Object containing multiple rating scores
 * @returns Average score (0-100)
 */
export declare const calculateAverageRating: (ratings: {
    instructorRating: number;
    contentQualityRating: number;
    practicalValueRating: number;
}) => number;
/**
 * Get grade distribution from an array of reviews
 * @param reviews - Array of reviews with ratings
 * @returns Object with count for each grade
 */
export declare const calculateGradeDistribution: (reviews: Array<{
    ratings: {
        instructorRating: number;
        contentQualityRating: number;
        practicalValueRating: number;
    };
}>) => {
    "A+": number;
    "A": number;
    "B+": number;
    "B": number;
    "C+": number;
    "C": number;
    "D": number;
    "F": number;
};
/**
 * Get color class for grade display
 * @param grade - Letter grade
 * @returns CSS color class
 */
export declare const getGradeColor: (grade: string) => string;
//# sourceMappingURL=gradeCalculator.d.ts.map