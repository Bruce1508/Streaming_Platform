// controllers/dashboard.controller.ts - NEW FILE WITH COMPREHENSIVE STATS
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
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
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';

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
        const models = { User, Material: StudyMaterial, Course, Enrollment };
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
                { name: 'Moderate Reports', count: 0 },
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