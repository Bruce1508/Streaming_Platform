// routes/dashboard.routes.ts - FULLY ENHANCED VERSION
import { Router } from 'express';
import { 
    getDashboard,
    getUserAnalytics,
    getMaterialAnalytics,
    getCourseAnalytics,
    getSystemHealth,
    getMyActivity,
    getTrendingContent
} from '../controllers/dashboard.controllers'; // <-- Sử dụng file mới (số nhiều)
import { protectRoute, authorize } from '../middleware/auth.middleware';
import { validateQueryParams } from '../middleware/validation/query.validation';

const router = Router();

// =====================================================
// ADMIN & PROFESSOR ANALYTICS ROUTES
// =====================================================

/**
 * @route   GET /api/dashboard/overview
 * @desc    Get comprehensive dashboard overview statistics
 * @access  Admin/Professor only
 */
router.get('/overview', 
    protectRoute, 
    authorize(['admin', 'professor']), 
    getDashboard
);

/**
 * @route   GET /api/dashboard/users
 * @desc    Get user analytics
 * @access  Admin only
 */
router.get('/users',
    protectRoute,
    authorize(['admin']),
    validateQueryParams,
    getUserAnalytics
);

/**
 * @route   GET /api/dashboard/materials
 * @desc    Get material analytics
 * @access  Admin/Professor only
 */
router.get('/materials',
    protectRoute,
    authorize(['admin', 'professor']),
    validateQueryParams,
    getMaterialAnalytics
);

/**
 * @route   GET /api/dashboard/courses
 * @desc    Get course analytics
 * @access  Admin/Professor only
 */
router.get('/courses',
    protectRoute,
    authorize(['admin', 'professor']),
    validateQueryParams,
    getCourseAnalytics
);

/**
 * @route   GET /api/dashboard/health
 * @desc    Get system health metrics
 * @access  Admin only
 */
router.get('/health',
    protectRoute,
    authorize(['admin']),
    getSystemHealth
);

// =====================================================
// PUBLIC & USER-SPECIFIC ROUTES
// =====================================================

/**
 * @route   GET /api/dashboard/trending
 * @desc    Get trending materials and content
 * @access  Public
 */
router.get('/trending', 
    validateQueryParams,
    getTrendingContent
);

/**
 * @route   GET /api/dashboard/my-activity
 * @desc    Get personal activity dashboard for the logged-in user
 * @access  Authenticated users
 */
router.get('/my-activity', 
    protectRoute,
    validateQueryParams,
    getMyActivity
);

export default router; 