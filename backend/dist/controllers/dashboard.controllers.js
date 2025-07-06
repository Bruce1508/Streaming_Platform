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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemHealth = exports.getTrendingContent = exports.getMyActivity = exports.getCourseAnalytics = exports.getMaterialAnalytics = exports.getUserAnalytics = exports.getDashboard = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const Stats_utils_1 = require("../utils/Stats.utils");
const Api_utils_1 = require("../utils/Api.utils");
const Cache_utils_1 = require("../utils/Cache.utils");
const logger_utils_1 = require("../utils/logger.utils");
// Import models
const User_1 = __importDefault(require("../models/User"));
const StudyMaterial_1 = __importDefault(require("../models/StudyMaterial"));
const Course_1 = require("../models/Course");
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
/**
 * @desc    Get comprehensive dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Admin/Professor
 */
exports.getDashboard = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user || !['admin', 'professor'].includes(req.user.role)) {
        return res.status(403).json(new ApiResponse_1.ApiResponse(403, null, 'Access denied. Admin or Professor role required.'));
    }
    // ✅ Check cache first
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('dashboard_overview', req.user.role);
    const cached = (0, Cache_utils_1.getCachedStats)(cacheKey);
    if (cached) {
        return res.json(cached);
    }
    try {
        // ✅ Get comprehensive stats using utils
        const models = { User: User_1.default, Material: StudyMaterial_1.default, Course: Course_1.Course, Enrollment: Enrollment_1.default };
        const dashboardData = yield (0, Stats_utils_1.getDashboardStats)(models);
        if (!dashboardData) {
            return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to generate dashboard statistics'));
        }
        // ✅ Add additional admin-specific data
        const enhancedData = Object.assign(Object.assign({}, dashboardData), { 
            // System health indicators
            systemHealth: {
                totalActiveUsers: ((_a = dashboardData.users) === null || _a === void 0 ? void 0 : _a.activeUsers) || 0,
                totalMaterials: ((_b = dashboardData.materials) === null || _b === void 0 ? void 0 : _b.totalMaterials) || 0,
                totalCourses: ((_c = dashboardData.courses) === null || _c === void 0 ? void 0 : _c.totalCourses) || 0,
                avgRating: ((_d = dashboardData.materials) === null || _d === void 0 ? void 0 : _d.avgRating) || 0,
                lastUpdated: new Date()
            }, 
            // Quick actions for admins
            quickActions: [
                { name: 'Review Pending Materials', count: ((_e = dashboardData.materials) === null || _e === void 0 ? void 0 : _e.pending) || 0 },
                { name: 'Moderate Reports', count: 0 }, // Could be implemented
                { name: 'Manage Users', count: ((_f = dashboardData.users) === null || _f === void 0 ? void 0 : _f.totalUsers) || 0 },
                { name: 'Course Analytics', count: ((_g = dashboardData.courses) === null || _g === void 0 ? void 0 : _g.totalCourses) || 0 }
            ] });
        const response = new ApiResponse_1.ApiResponse(200, enhancedData, 'Dashboard statistics retrieved successfully');
        // ✅ Cache the response
        (0, Cache_utils_1.cacheStats)(cacheKey, response, 300); // 5 minutes
        logger_utils_1.logger.info('Dashboard accessed', {
            adminId: req.user._id,
            role: req.user.role,
            timestamp: new Date()
        });
        res.json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Dashboard stats error:', error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to retrieve dashboard statistics'));
    }
}));
/**
 * @desc    Get user analytics
 * @route   GET /api/dashboard/users
 * @access  Admin only
 */
exports.getUserAnalytics = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse_1.ApiResponse(403, null, 'Access denied. Admin role required.'));
    }
    const { programId, timeframe = 'all' } = req.query;
    try {
        // ✅ Get user statistics with optional program filter
        const [userStats, growthMetrics, topContributors] = yield Promise.all([
            (0, Stats_utils_1.getUserStats)(User_1.default, programId),
            (0, Stats_utils_1.calculateGrowthMetrics)(User_1.default, 'createdAt', [7, 30, 90]),
            (0, Stats_utils_1.getTopPerformers)({ User: User_1.default, Material: StudyMaterial_1.default }, 'downloads', 10)
        ]);
        const analyticsData = {
            overview: userStats,
            growth: growthMetrics,
            topContributors,
            demographics: {
                byRole: {
                    students: (userStats === null || userStats === void 0 ? void 0 : userStats.students) || 0,
                    instructors: (userStats === null || userStats === void 0 ? void 0 : userStats.instructors) || 0,
                    admins: (userStats === null || userStats === void 0 ? void 0 : userStats.admins) || 0
                },
                activeVsInactive: {
                    active: (userStats === null || userStats === void 0 ? void 0 : userStats.activeUsers) || 0,
                    inactive: ((userStats === null || userStats === void 0 ? void 0 : userStats.totalUsers) || 0) - ((userStats === null || userStats === void 0 ? void 0 : userStats.activeUsers) || 0)
                }
            },
            filters: {
                programId: programId || null,
                timeframe
            }
        };
        res.json(new ApiResponse_1.ApiResponse(200, analyticsData, 'User analytics retrieved successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('User analytics error:', error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to retrieve user analytics'));
    }
}));
/**
 * @desc    Get material analytics
 * @route   GET /api/dashboard/materials
 * @access  Admin/Professor
 */
exports.getMaterialAnalytics = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user || !['admin', 'professor'].includes(req.user.role)) {
        return res.status(403).json(new ApiResponse_1.ApiResponse(403, null, 'Access denied.'));
    }
    const { courseId, timeframe = '30d' } = req.query;
    try {
        // ✅ Get material statistics
        const [materialStats, trendingMaterials, growthMetrics] = yield Promise.all([
            (0, Stats_utils_1.getMaterialStats)(StudyMaterial_1.default, courseId),
            (0, Stats_utils_1.getTrendingMaterials)(StudyMaterial_1.default, 7, 15),
            (0, Stats_utils_1.calculateGrowthMetrics)(StudyMaterial_1.default, 'createdAt', [7, 30, 90])
        ]);
        const analyticsData = {
            overview: materialStats,
            trending: trendingMaterials,
            growth: growthMetrics,
            qualityMetrics: {
                avgRating: (materialStats === null || materialStats === void 0 ? void 0 : materialStats.avgRating) || 0,
                totalRatings: (materialStats === null || materialStats === void 0 ? void 0 : materialStats.totalRatings) || 0,
                approvalRate: materialStats ?
                    ((materialStats.approved / materialStats.totalMaterials) * 100).toFixed(1) : '0'
            },
            filters: {
                courseId: courseId || null,
                timeframe
            }
        };
        res.json(new ApiResponse_1.ApiResponse(200, analyticsData, 'Material analytics retrieved successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('Material analytics error:', error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to retrieve material analytics'));
    }
}));
/**
 * @desc    Get course analytics
 * @route   GET /api/dashboard/courses
 * @access  Admin/Professor
 */
exports.getCourseAnalytics = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user || !['admin', 'professor'].includes(req.user.role)) {
        return res.status(403).json(new ApiResponse_1.ApiResponse(403, null, 'Access denied.'));
    }
    const { programId } = req.query;
    try {
        // ✅ Get course statistics
        const courseStats = yield (0, Stats_utils_1.getCourseStats)(Course_1.Course, Enrollment_1.default, programId);
        if (!courseStats) {
            return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to generate course statistics'));
        }
        const analyticsData = {
            overview: courseStats,
            enrollmentTrends: {
                totalEnrollments: courseStats.totalEnrollments,
                completedEnrollments: courseStats.completedEnrollments,
                completionRate: courseStats.completionRate,
                avgCredits: courseStats.avgCredits
            },
            filters: {
                programId: programId || null
            }
        };
        res.json(new ApiResponse_1.ApiResponse(200, analyticsData, 'Course analytics retrieved successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('Course analytics error:', error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to retrieve course analytics'));
    }
}));
/**
 * @desc    Get personal activity dashboard (for any user)
 * @route   GET /api/dashboard/my-activity
 * @access  Authenticated users
 */
exports.getMyActivity = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user) {
        return res.status(401).json(new ApiResponse_1.ApiResponse(401, null, 'Authentication required'));
    }
    const { days = '30' } = req.query;
    try {
        // ✅ Get user's personal activity stats
        const models = { User: User_1.default, Material: StudyMaterial_1.default, Enrollment: Enrollment_1.default };
        const activityStats = yield (0, Stats_utils_1.getUserActivityStats)(models, req.user._id.toString(), parseInt(days));
        if (!activityStats) {
            return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to generate activity statistics'));
        }
        // ✅ Enhanced personal dashboard
        const personalDashboard = {
            activity: activityStats,
            // Personal achievements
            achievements: {
                totalUploads: ((_a = req.user.activity) === null || _a === void 0 ? void 0 : _a.uploadCount) || 0,
                totalContributions: ((_b = req.user.activity) === null || _b === void 0 ? void 0 : _b.contributionScore) || 0,
                totalFriends: ((_c = req.user.friends) === null || _c === void 0 ? void 0 : _c.length) || 0,
                savedMaterials: ((_d = req.user.savedMaterials) === null || _d === void 0 ? void 0 : _d.length) || 0
            },
            // Study stats  
            studyProgress: req.user.studyStats || {
                totalStudyTime: 0,
                materialsDownloaded: 0,
                materialsUploaded: 0,
                averageRating: 0
            },
            // Academic info
            academicInfo: req.user.academic ? {
                school: req.user.academic.school,
                program: req.user.academic.program,
                currentSemester: req.user.academic.currentSemester,
                status: req.user.academic.status
            } : null,
            period: `${days} days`
        };
        res.json(new ApiResponse_1.ApiResponse(200, personalDashboard, 'Personal activity retrieved successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('Personal activity error:', error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to retrieve personal activity'));
    }
}));
/**
 * @desc    Get trending content
 * @route   GET /api/dashboard/trending
 * @access  Public
 */
exports.getTrendingContent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { days = '7', limit = '10' } = req.query;
    try {
        // ✅ Check cache first
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('trending_content', days, limit);
        const cached = (0, Cache_utils_1.getCachedStats)(cacheKey);
        if (cached) {
            return res.json(cached);
        }
        const trendingMaterials = yield (0, Stats_utils_1.getTrendingMaterials)(StudyMaterial_1.default, parseInt(days), parseInt(limit));
        const response = new ApiResponse_1.ApiResponse(200, {
            materials: trendingMaterials,
            period: `${days} days`,
            totalCount: trendingMaterials.length
        }, 'Trending content retrieved successfully');
        // ✅ Cache trending content
        (0, Cache_utils_1.cacheStats)(cacheKey, response, 600); // 10 minutes
        res.json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Trending content error:', error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to retrieve trending content'));
    }
}));
/**
 * @desc    Get system health metrics
 * @route   GET /api/dashboard/health
 * @access  Admin only
 */
exports.getSystemHealth = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse_1.ApiResponse(403, null, 'Access denied. Admin role required.'));
    }
    try {
        // Get basic system metrics
        const [userCount, materialCount, courseCount, enrollmentCount] = yield Promise.all([
            User_1.default.countDocuments({ isActive: true }),
            StudyMaterial_1.default.countDocuments({ status: 'published' }),
            Course_1.Course.countDocuments({ isActive: true }),
            Enrollment_1.default.countDocuments({})
        ]);
        // ✅ System health indicators
        const healthMetrics = {
            database: {
                status: 'healthy', // Could implement actual DB health check
                totalUsers: userCount,
                totalMaterials: materialCount,
                totalCourses: courseCount,
                totalEnrollments: enrollmentCount
            },
            performance: {
                avgResponseTime: '< 100ms', // Could implement actual monitoring
                uptime: '99.9%',
                lastUpdate: new Date()
            },
            alerts: {
                critical: 0,
                warnings: 0,
                info: 1
            },
            storage: {
                materialsSize: '2.4 GB', // Could implement actual calculation
                uploadsToday: yield StudyMaterial_1.default.countDocuments({
                    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                })
            }
        };
        res.json(new ApiResponse_1.ApiResponse(200, healthMetrics, 'System health retrieved successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('System health error:', error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Failed to retrieve system health'));
    }
}));
//# sourceMappingURL=dashboard.controllers.js.map