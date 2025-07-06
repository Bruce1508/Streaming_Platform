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
exports.getTopPerformers = exports.calculateGrowthMetrics = exports.getUserActivityStats = exports.getTrendingMaterials = exports.getDashboardStats = exports.getCourseStats = exports.getMaterialStats = exports.getUserStats = exports.calculatePercentageChange = exports.calculateBasicStats = void 0;
// utils/stats.utils.ts
const logger_utils_1 = require("./logger.utils");
const Cache_utils_1 = require("./Cache.utils");
// Calculate basic statistics
const calculateBasicStats = (numbers) => {
    if (!numbers.length)
        return null;
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
exports.calculateBasicStats = calculateBasicStats;
// Calculate percentage change
const calculatePercentageChange = (oldValue, newValue) => {
    if (oldValue === 0)
        return newValue > 0 ? 100 : 0;
    return parseFloat(((newValue - oldValue) / oldValue * 100).toFixed(2));
};
exports.calculatePercentageChange = calculatePercentageChange;
// Get user statistics
const getUserStats = (UserModel, programId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('user_stats', programId || 'all');
        const cached = Cache_utils_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const match = programId ? { 'profile.programId': programId } : {};
        const stats = yield UserModel.aggregate([
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
        Cache_utils_1.cache.set(cacheKey, result, 300); // Cache for 5 minutes
        return result;
    }
    catch (error) {
        logger_utils_1.logger.error('User stats calculation error:', error);
        return null;
    }
});
exports.getUserStats = getUserStats;
// Get material statistics
const getMaterialStats = (MaterialModel, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('material_stats', courseId || 'all');
        const cached = Cache_utils_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const match = courseId ? { courseId } : {};
        const stats = yield MaterialModel.aggregate([
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
        Cache_utils_1.cache.set(cacheKey, result, 300);
        return result;
    }
    catch (error) {
        logger_utils_1.logger.error('Material stats calculation error:', error);
        return null;
    }
});
exports.getMaterialStats = getMaterialStats;
// Get course statistics
const getCourseStats = (CourseModel, EnrollmentModel, programId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('course_stats', programId || 'all');
        const cached = Cache_utils_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const match = programId ? { programId } : {};
        const courseStats = yield CourseModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalCourses: { $sum: 1 },
                    avgCredits: { $avg: '$credits' }
                }
            }
        ]);
        const enrollmentStats = yield EnrollmentModel.aggregate([
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: '$course' },
            ...(programId ? [{ $match: { 'course.programId': programId } }] : []),
            {
                $group: {
                    _id: null,
                    totalEnrollments: { $sum: 1 },
                    completedEnrollments: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
                }
            }
        ]);
        const result = {
            totalCourses: ((_a = courseStats[0]) === null || _a === void 0 ? void 0 : _a.totalCourses) || 0,
            avgCredits: ((_b = courseStats[0]) === null || _b === void 0 ? void 0 : _b.avgCredits) ? parseFloat(courseStats[0].avgCredits.toFixed(2)) : 0,
            totalEnrollments: ((_c = enrollmentStats[0]) === null || _c === void 0 ? void 0 : _c.totalEnrollments) || 0,
            completedEnrollments: ((_d = enrollmentStats[0]) === null || _d === void 0 ? void 0 : _d.completedEnrollments) || 0,
            completionRate: 0
        };
        if (result.totalEnrollments > 0) {
            result.completionRate = parseFloat(((result.completedEnrollments / result.totalEnrollments) * 100).toFixed(2));
        }
        Cache_utils_1.cache.set(cacheKey, result, 300);
        return result;
    }
    catch (error) {
        logger_utils_1.logger.error('Course stats calculation error:', error);
        return null;
    }
});
exports.getCourseStats = getCourseStats;
// Get dashboard statistics
const getDashboardStats = (models) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = 'dashboard_stats';
        const cached = Cache_utils_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const [userStats, materialStats, courseStats] = yield Promise.all([
            (0, exports.getUserStats)(models.User),
            (0, exports.getMaterialStats)(models.Material),
            (0, exports.getCourseStats)(models.Course, models.Enrollment)
        ]);
        const result = {
            users: userStats,
            materials: materialStats,
            courses: courseStats,
            lastUpdated: new Date()
        };
        Cache_utils_1.cache.set(cacheKey, result, 180); // Cache for 3 minutes
        return result;
    }
    catch (error) {
        logger_utils_1.logger.error('Dashboard stats calculation error:', error);
        return null;
    }
});
exports.getDashboardStats = getDashboardStats;
// Get trending materials
const getTrendingMaterials = (MaterialModel_1, ...args_1) => __awaiter(void 0, [MaterialModel_1, ...args_1], void 0, function* (MaterialModel, days = 7, limit = 10) {
    try {
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('trending_materials', days, limit);
        const cached = Cache_utils_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const trending = yield MaterialModel.aggregate([
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
        Cache_utils_1.cache.set(cacheKey, trending, 600); // Cache for 10 minutes
        return trending;
    }
    catch (error) {
        logger_utils_1.logger.error('Trending materials calculation error:', error);
        return [];
    }
});
exports.getTrendingMaterials = getTrendingMaterials;
// Get user activity stats
const getUserActivityStats = (models_1, userId_1, ...args_1) => __awaiter(void 0, [models_1, userId_1, ...args_1], void 0, function* (models, userId, days = 30) {
    var _a;
    try {
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('user_activity', userId, days);
        const cached = Cache_utils_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const [materialStats, enrollmentStats, commentStats] = yield Promise.all([
            // Materials uploaded
            models.Material.countDocuments({
                uploadedBy: userId,
                createdAt: { $gte: startDate }
            }),
            // New enrollments
            models.Enrollment.countDocuments({
                studentId: userId,
                enrollmentDate: { $gte: startDate }
            }),
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
            newEnrollments: enrollmentStats,
            commentsMade: ((_a = commentStats[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            period: `${days} days`
        };
        Cache_utils_1.cache.set(cacheKey, result, 300);
        return result;
    }
    catch (error) {
        logger_utils_1.logger.error('User activity stats calculation error:', error);
        return null;
    }
});
exports.getUserActivityStats = getUserActivityStats;
// Calculate growth metrics
const calculateGrowthMetrics = (Model_1, ...args_1) => __awaiter(void 0, [Model_1, ...args_1], void 0, function* (Model, field = 'createdAt', periods = [7, 30, 90]) {
    try {
        const now = new Date();
        const results = {};
        for (const period of periods) {
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() - period);
            const previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - period);
            const [currentCount, previousCount] = yield Promise.all([
                Model.countDocuments({ [field]: { $gte: startDate } }),
                Model.countDocuments({
                    [field]: {
                        $gte: previousStartDate,
                        $lt: startDate
                    }
                })
            ]);
            const growth = (0, exports.calculatePercentageChange)(previousCount, currentCount);
            results[`${period}d`] = {
                current: currentCount,
                previous: previousCount,
                growth: growth,
                trend: growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable'
            };
        }
        return results;
    }
    catch (error) {
        logger_utils_1.logger.error('Growth metrics calculation error:', error);
        return {};
    }
});
exports.calculateGrowthMetrics = calculateGrowthMetrics;
// Get top performers
const getTopPerformers = (models_1, ...args_1) => __awaiter(void 0, [models_1, ...args_1], void 0, function* (models, metric = 'downloads', limit = 10) {
    try {
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('top_performers', metric, limit);
        const cached = Cache_utils_1.cache.get(cacheKey);
        if (cached)
            return cached;
        let aggregation = [];
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
        const topMaterials = yield models.Material.aggregate([
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
        Cache_utils_1.cache.set(cacheKey, topMaterials, 900); // Cache for 15 minutes
        return topMaterials;
    }
    catch (error) {
        logger_utils_1.logger.error('Top performers calculation error:', error);
        return [];
    }
});
exports.getTopPerformers = getTopPerformers;
// Export all functions
exports.default = {
    calculateBasicStats: exports.calculateBasicStats,
    calculatePercentageChange: exports.calculatePercentageChange,
    getUserStats: exports.getUserStats,
    getMaterialStats: exports.getMaterialStats,
    getCourseStats: exports.getCourseStats,
    getDashboardStats: exports.getDashboardStats,
    getTrendingMaterials: exports.getTrendingMaterials,
    getUserActivityStats: exports.getUserActivityStats,
    calculateGrowthMetrics: exports.calculateGrowthMetrics,
    getTopPerformers: exports.getTopPerformers
};
//# sourceMappingURL=Stats.utils.js.map