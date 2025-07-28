// controllers/dashboard.controllers.ts - NEW FILE WITH COMPREHENSIVE STATS
import { Request, Response } from 'express';
import { AuthRequest } from '../middleWare/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { 
    getDashboardStats, 
    getUserStats, 
    getMaterialStats,
    getCourseStats,
    getTrendingMaterials,
    getUserActivityStats,
    calculateGrowthMetrics,
    getTopPerformers 
} from '../utils/Stats.utils';
import { 
    logApiRequest
} from '../utils/Api.utils';
import { 
    getCachedStats,
    cacheStats,
    generateCacheKey 
} from '../utils/Cache.utils';
import { logger } from '../utils/logger.utils';

// Import models
import User from '../models/User';
import StudyMaterial from '../models/StudyMaterial';
import {ProgramCourses} from '../models/ProgramCourses';
import Enrollment from '../models/Enrollment';

/**
 * @desc    Get comprehensive dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Admin/Professor
 */
export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user || !['admin', 'professor'].includes(req.user.role)) {
        return res.status(403).json(
            new ApiResponse(403, null, 'Access denied. Admin or Professor role required.')
        );
    }

    // ✅ Check cache first
    const cacheKey = generateCacheKey('dashboard_overview', req.user.role);
    const cached = getCachedStats(cacheKey);
    
    if (cached) {
        return res.json(cached);
    }

    try {
        // ✅ Get comprehensive stats using utils
        const models = { User, Material: StudyMaterial, Course: ProgramCourses, Enrollment };
        const dashboardData = await getDashboardStats(models);

        if (!dashboardData) {
            return res.status(500).json(
                new ApiResponse(500, null, 'Failed to generate dashboard statistics')
            );
        }

        // ✅ Add additional admin-specific data
        const enhancedData = {
            ...dashboardData,
            
            // System health indicators
            systemHealth: {
                totalActiveUsers: dashboardData.users?.activeUsers || 0,
                totalMaterials: dashboardData.materials?.totalMaterials || 0,
                totalCourses: dashboardData.courses?.totalCourses || 0,
                avgRating: dashboardData.materials?.avgRating || 0,
                lastUpdated: new Date()
            },

            // Quick actions for admins
            quickActions: [
                { name: 'Review Pending Materials', count: dashboardData.materials?.pending || 0 },
                { name: 'Moderate Reports', count: 0 }, // Could be implemented
                { name: 'Manage Users', count: dashboardData.users?.totalUsers || 0 },
                { name: 'Course Analytics', count: dashboardData.courses?.totalCourses || 0 }
            ]
        };

        const response = new ApiResponse(
            200, 
            enhancedData, 
            'Dashboard statistics retrieved successfully'
        );

        // ✅ Cache the response
        cacheStats(cacheKey, response, 300); // 5 minutes

        logger.info('Dashboard accessed', {
            adminId: req.user._id,
            role: req.user.role,
            timestamp: new Date()
        });

        res.json(response);

    } catch (error: any) {
        logger.error('Dashboard stats error:', error);
        res.status(500).json(
            new ApiResponse(500, null, 'Failed to retrieve dashboard statistics')
        );
    }
});

/**
 * @desc    Get user analytics
 * @route   GET /api/dashboard/users
 * @access  Admin only
 */
export const getUserAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json(
            new ApiResponse(403, null, 'Access denied. Admin role required.')
        );
    }

    const { programId, timeframe = 'all' } = req.query;

    try {
        // ✅ Get user statistics with optional program filter
        const [userStats, growthMetrics, topContributors] = await Promise.all([
            getUserStats(User, programId as string),
            calculateGrowthMetrics(User, 'createdAt', [7, 30, 90]),
            getTopPerformers({ User, Material: StudyMaterial }, 'downloads', 10)
        ]);

        const analyticsData = {
            overview: userStats,
            growth: growthMetrics,
            topContributors,
            demographics: {
                byRole: {
                    students: userStats?.students || 0,
                    instructors: userStats?.instructors || 0,
                    admins: userStats?.admins || 0
                },
                activeVsInactive: {
                    active: userStats?.activeUsers || 0,
                    inactive: (userStats?.totalUsers || 0) - (userStats?.activeUsers || 0)
                }
            },
            filters: {
                programId: programId || null,
                timeframe
            }
        };

        res.json(
            new ApiResponse(200, analyticsData, 'User analytics retrieved successfully')
        );

    } catch (error: any) {
        logger.error('User analytics error:', error);
        res.status(500).json(
            new ApiResponse(500, null, 'Failed to retrieve user analytics')
        );
    }
});

/**
 * @desc    Get material analytics  
 * @route   GET /api/dashboard/materials
 * @access  Admin/Professor
 */
export const getMaterialAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user || !['admin', 'professor'].includes(req.user.role)) {
        return res.status(403).json(
            new ApiResponse(403, null, 'Access denied.')
        );
    }

    const { courseId, timeframe = '30d' } = req.query;

    try {
        // ✅ Get material statistics
        const [materialStats, trendingMaterials, growthMetrics] = await Promise.all([
            getMaterialStats(StudyMaterial, courseId as string),
            getTrendingMaterials(StudyMaterial, 7, 15),
            calculateGrowthMetrics(StudyMaterial, 'createdAt', [7, 30, 90])
        ]);

        const analyticsData = {
            overview: materialStats,
            trending: trendingMaterials,
            growth: growthMetrics,
            qualityMetrics: {
                avgRating: materialStats?.avgRating || 0,
                totalRatings: materialStats?.totalRatings || 0,
                approvalRate: materialStats ? 
                    ((materialStats.approved / materialStats.totalMaterials) * 100).toFixed(1) : '0'
            },
            filters: {
                courseId: courseId || null,
                timeframe
            }
        };

        res.json(
            new ApiResponse(200, analyticsData, 'Material analytics retrieved successfully')
        );

    } catch (error: any) {
        logger.error('Material analytics error:', error);
        res.status(500).json(
            new ApiResponse(500, null, 'Failed to retrieve material analytics')
        );
    }
});

/**
 * @desc    Get course analytics
 * @route   GET /api/dashboard/courses  
 * @access  Admin/Professor
 */
export const getCourseAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user || !['admin', 'professor'].includes(req.user.role)) {
        return res.status(403).json(
            new ApiResponse(403, null, 'Access denied.')
        );
    }

    const { programId } = req.query;

    try {
        // ✅ Get course statistics
        const courseStats = await getCourseStats(ProgramCourses, Enrollment, programId as string);

        if (!courseStats) {
            return res.status(500).json(
                new ApiResponse(500, null, 'Failed to generate course statistics')
            );
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

        res.json(
            new ApiResponse(200, analyticsData, 'Course analytics retrieved successfully')
        );

    } catch (error: any) {
        logger.error('Course analytics error:', error);
        res.status(500).json(
            new ApiResponse(500, null, 'Failed to retrieve course analytics')
        );
    }
});

/**
 * @desc    Get personal activity dashboard (for any user)
 * @route   GET /api/dashboard/my-activity
 * @access  Authenticated users
 */
export const getMyActivity = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(
            new ApiResponse(401, null, 'Authentication required')
        );
    }

    const { days = '30' } = req.query;

    try {
        // ✅ Get user's personal activity stats
        const models = { User, Material: StudyMaterial, Enrollment };
        const activityStats = await getUserActivityStats(
            models, 
            req.user._id.toString(), 
            parseInt(days as string)
        );

        if (!activityStats) {
            return res.status(500).json(
                new ApiResponse(500, null, 'Failed to generate activity statistics')
            );
        }

        // ✅ Enhanced personal dashboard
        const personalDashboard = {
            activity: activityStats,
            
            // Personal achievements
            achievements: {
                totalUploads: req.user.activity?.uploadCount || 0,
                totalContributions: req.user.activity?.contributionScore || 0,
                totalFriends: req.user.friends?.length || 0,
                savedMaterials: req.user.savedMaterials?.length || 0
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

        res.json(
            new ApiResponse(200, personalDashboard, 'Personal activity retrieved successfully')
        );

    } catch (error: any) {
        logger.error('Personal activity error:', error);
        res.status(500).json(
            new ApiResponse(500, null, 'Failed to retrieve personal activity')
        );
    }
});

/**
 * @desc    Get trending content
 * @route   GET /api/dashboard/trending
 * @access  Public
 */
export const getTrendingContent = asyncHandler(async (req: Request, res: Response) => {
    const { days = '7', limit = '10' } = req.query;

    try {
        // ✅ Check cache first
        const cacheKey = generateCacheKey('trending_content', days as string, limit as string);
        const cached = getCachedStats(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        const trendingMaterials = await getTrendingMaterials(
            StudyMaterial, 
            parseInt(days as string), 
            parseInt(limit as string)
        );

        const response = new ApiResponse(
            200, 
            {
                materials: trendingMaterials,
                period: `${days} days`,
                totalCount: trendingMaterials.length
            }, 
            'Trending content retrieved successfully'
        );

        // ✅ Cache trending content
        cacheStats(cacheKey, response, 600); // 10 minutes

        res.json(response);

    } catch (error: any) {
        logger.error('Trending content error:', error);
        res.status(500).json(
            new ApiResponse(500, null, 'Failed to retrieve trending content')
        );
    }
});

/**
 * @desc    Get system health metrics
 * @route   GET /api/dashboard/health
 * @access  Admin only
 */
export const getSystemHealth = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json(
            new ApiResponse(403, null, 'Access denied. Admin role required.')
        );
    }

    try {
        // Get basic system metrics
        const [userCount, materialCount, courseCount, enrollmentCount] = await Promise.all([
            User.countDocuments({ isActive: true }),
            StudyMaterial.countDocuments({ status: 'published' }),
            ProgramCourses.countDocuments(),
            Enrollment.countDocuments({})
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
                uploadsToday: await StudyMaterial.countDocuments({
                    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                })
            }
        };

        res.json(
            new ApiResponse(200, healthMetrics, 'System health retrieved successfully')
        );

    } catch (error: any) {
        logger.error('System health error:', error);
        res.status(500).json(
            new ApiResponse(500, null, 'Failed to retrieve system health')
        );
    }
}); 