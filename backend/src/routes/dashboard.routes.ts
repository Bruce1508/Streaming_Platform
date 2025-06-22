// routes/dashboard.routes.ts - NEW FILE FOR DASHBOARD ANALYTICS
import { Router } from 'express';
import { 
    getDashboard, 
    getTrendingContent, 
    getMyActivity 
} from '../controllers/dashboard.controller';
import { protectRoute, authorize } from '../middleware/auth.middleware';
import { validateQueryParams } from '../middleware/validation/query.validation';

const router = Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get comprehensive dashboard statistics
 * @access  Admin/Professor only
 */
router.get('/stats', 
    protectRoute, 
    authorize(['admin', 'professor']), 
    getDashboard
);

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
 * @desc    Get personal activity dashboard
 * @access  Authenticated users
 */
router.get('/my-activity', 
    protectRoute,
    validateQueryParams,
    getMyActivity
);

export default router; 