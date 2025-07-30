// utils/stats.utils.ts
import { logger } from './logger.utils';
import { cache, generateCacheKey } from './Cache.utils';

// Calculate basic statistics
export const calculateBasicStats = (numbers: number[]) => {
    if (!numbers.length) return null;

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / numbers.length;

    return {
        count: numbers.length,
        sum,
        mean: parseFloat(mean.toFixed(2)),
        median: sorted[Math.floor(sorted.length / 2)],
        min: sorted[0],
        max: sorted[sorted.length - 1],
        range: sorted[sorted.length - 1] - sorted[0]
    };
};

// Calculate percentage change
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return parseFloat(((newValue - oldValue) / oldValue * 100).toFixed(2));
};

// Get user statistics
export const getUserStats = async (UserModel: any, programId?: string) => {
    try {
        const cacheKey = generateCacheKey('user_stats', programId || 'all');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const match = programId ? { 'profile.programId': programId } : {};

        const stats = await UserModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    students: { $sum: { $cond: [{ $eq: ['$role', 'student'] }, 1, 0] } },
                    instructors: { $sum: { $cond: [{ $eq: ['$role', 'instructor'] }, 1, 0] } },
                    admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
                    activeUsers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } }
                }
            }
        ]);

        const result = stats[0] || {
            totalUsers: 0,
            students: 0,
            instructors: 0,
            admins: 0,
            activeUsers: 0
        };

        cache.set(cacheKey, result, 300); // Cache for 5 minutes
        return result;
    } catch (error) {
        logger.error('User stats calculation error:', error);
        return null;
    }
};

// Get material statistics
export const getMaterialStats = async (MaterialModel: any, courseId?: string) => {
    try {
        const cacheKey = generateCacheKey('material_stats', courseId || 'all');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const match = courseId ? { courseId } : {};

        const stats = await MaterialModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalMaterials: { $sum: 1 },
                    notes: { $sum: { $cond: [{ $eq: ['$category', 'notes'] }, 1, 0] } },
                    assignments: { $sum: { $cond: [{ $eq: ['$category', 'assignments'] }, 1, 0] } },
                    exams: { $sum: { $cond: [{ $eq: ['$category', 'exams'] }, 1, 0] } },
                    approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    totalDownloads: { $sum: '$downloadCount' },
                    avgRating: { $avg: '$averageRating' }
                }
            }
        ]);

        const result = stats[0] || {
            totalMaterials: 0,
            notes: 0,
            assignments: 0,
            exams: 0,
            approved: 0,
            pending: 0,
            totalDownloads: 0,
            avgRating: 0
        };

        if (result.avgRating) {
            result.avgRating = parseFloat(result.avgRating.toFixed(2));
        }

        cache.set(cacheKey, result, 300);
        return result;
    } catch (error) {
        logger.error('Material stats calculation error:', error);
        return null;
    }
};

// Get course statistics - removed due to model deletion
export const getCourseStats = async (CourseModel: any, EnrollmentModel: any, programId?: string) => {
    return {
        totalCourses: 0,
        avgCredits: 0,
        totalEnrollments: 0,
        completedEnrollments: 0,
        completionRate: 0
    };
};

// Get dashboard statistics
export const getDashboardStats = async (models: any) => {
    try {
        const cacheKey = 'dashboard_stats';
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const [userStats, materialStats] = await Promise.all([
            getUserStats(models.User),
            getMaterialStats(models.Material)
        ]);

        const result = {
            users: userStats,
            materials: materialStats,
            courses: {
                totalCourses: 0,
                avgCredits: 0,
                totalEnrollments: 0,
                completedEnrollments: 0,
                completionRate: 0
            },
            lastUpdated: new Date()
        };

        cache.set(cacheKey, result, 180); // Cache for 3 minutes
        return result;
    } catch (error) {
        logger.error('Dashboard stats calculation error:', error);
        return null;
    }
};

// Get trending materials
export const getTrendingMaterials = async (MaterialModel: any, days: number = 7, limit: number = 10) => {
    try {
        const cacheKey = generateCacheKey('trending_materials', days.toString(), limit.toString());
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const trending = await MaterialModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: 'approved'
                }
            },
            {
                $addFields: {
                    trendingScore: {
                        $add: [
                            { $multiply: ['$downloadCount', 2] },
                            { $multiply: ['$viewCount', 1] },
                            { $multiply: ['$averageRating', 5] },
                            { $size: { $ifNull: ['$comments', []] } }
                        ]
                    }
                }
            },
            { $sort: { trendingScore: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'uploadedBy',
                    foreignField: '_id',
                    as: 'uploader'
                }
            },
            {
                $project: {
                    title: 1,
                    category: 1,
                    downloadCount: 1,
                    viewCount: 1,
                    averageRating: 1,
                    trendingScore: 1,
                    createdAt: 1,
                    'course.name': 1,
                    'course.code': 1,
                    'uploader.firstName': 1,
                    'uploader.lastName': 1
                }
            }
        ]);

        cache.set(cacheKey, trending, 600); // Cache for 10 minutes
        return trending;
    } catch (error) {
        logger.error('Trending materials calculation error:', error);
        return [];
    }
};

// Get user activity stats
export const getUserActivityStats = async (models: any, userId: string, days: number = 30) => {
    try {
        const cacheKey = generateCacheKey('user_activity', userId, days.toString());
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const [materialStats, enrollmentStats, commentStats] = await Promise.all([
            // Materials uploaded
            models.Material.countDocuments({
                uploadedBy: userId,
                createdAt: { $gte: startDate }
            }),

            // New enrollments - model removed
            Promise.resolve(0),

            // Comments made
            models.Material.aggregate([
                { $unwind: '$comments' },
                {
                    $match: {
                        'comments.userId': userId,
                        'comments.createdAt': { $gte: startDate }
                    }
                },
                { $count: 'total' }
            ])
        ]);

        const result = {
            materialsUploaded: materialStats,
            newEnrollments: 0, // Enrollment model removed
            commentsMade: commentStats[0]?.total || 0,
            period: `${days} days`
        };

        cache.set(cacheKey, result, 300);
        return result;
    } catch (error) {
        logger.error('User activity stats calculation error:', error);
        return null;
    }
};

// Calculate growth metrics
export const calculateGrowthMetrics = async (Model: any, field: string = 'createdAt', periods: number[] = [7, 30, 90]) => {
    try {
        const now = new Date();
        const results: any = {};

        for (const period of periods) {
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() - period);

            const previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - period);

            const [currentCount, previousCount] = await Promise.all([
                Model.countDocuments({ [field]: { $gte: startDate } }),
                Model.countDocuments({
                    [field]: {
                        $gte: previousStartDate,
                        $lt: startDate
                    }
                })
            ]);

            const growth = calculatePercentageChange(previousCount, currentCount);

            results[`${period}d`] = {
                current: currentCount,
                previous: previousCount,
                growth: growth,
                trend: growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable'
            };
        }

        return results;
    } catch (error) {
        logger.error('Growth metrics calculation error:', error);
        return {};
    }
};

// Get top performers
export const getTopPerformers = async (models: any, metric: string = 'downloads', limit: number = 10) => {
    try {
        const cacheKey = generateCacheKey('top_performers', metric, limit.toString());
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        let aggregation: any[] = [];

        switch (metric) {
            case 'downloads':
                aggregation = [
                    { $match: { status: 'approved' } },
                    { $sort: { downloadCount: -1 } },
                    { $limit: limit }
                ];
                break;

            case 'ratings':
                aggregation = [
                    {
                        $match: {
                            status: 'approved',
                            averageRating: { $gt: 0 }
                        }
                    },
                    { $sort: { averageRating: -1, ratingCount: -1 } },
                    { $limit: limit }
                ];
                break;

            case 'recent':
                aggregation = [
                    { $match: { status: 'approved' } },
                    { $sort: { createdAt: -1 } },
                    { $limit: limit }
                ];
                break;

            default:
                aggregation = [
                    { $match: { status: 'approved' } },
                    { $sort: { downloadCount: -1 } },
                    { $limit: limit }
                ];
        }

        const topMaterials = await models.Material.aggregate([
            ...aggregation,
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'uploadedBy',
                    foreignField: '_id',
                    as: 'uploader'
                }
            },
            {
                $project: {
                    title: 1,
                    category: 1,
                    downloadCount: 1,
                    averageRating: 1,
                    ratingCount: 1,
                    createdAt: 1,
                    'course.name': 1,
                    'course.code': 1,
                    'uploader.firstName': 1,
                    'uploader.lastName': 1
                }
            }
        ]);

        cache.set(cacheKey, topMaterials, 900); // Cache for 15 minutes
        return topMaterials;
    } catch (error) {
        logger.error('Top performers calculation error:', error);
        return [];
    }
};

// Export all functions
export default {
    calculateBasicStats,
    calculatePercentageChange,
    getUserStats,
    getMaterialStats,
    getCourseStats,
    getDashboardStats,
    getTrendingMaterials,
    getUserActivityStats,
    calculateGrowthMetrics,
    getTopPerformers
};