import { Router } from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { optionalSessionValidation } from '../middleware/session.middleware';
import { 
    getActiveSessions, 
    logoutSession, 
    logoutAllDevices 
} from '../controllers/session.controllers';
import { createRateLimit } from '../middleware/rateLimiter';
import { validateObjectId } from '../middleware/validation/common.validation';

const router = Router();

// ===== RATE LIMITING SETUP =====
const sessionLimit = createRateLimit(50, 15); // 50 session operations per 15 minutes
const logoutLimit = createRateLimit(10, 15); // 10 logout operations per 15 minutes

// All session routes require authentication
router.use([
    optionalSessionValidation,  // Get session info
    protectRoute               // Require valid JWT
]);

// =====================================================
// SESSION MANAGEMENT ROUTES
// =====================================================

/**
 * @route   GET /api/sessions
 * @desc    Get user's active sessions
 * @access  Private
 * @query   page, limit
 */
router.get('/', sessionLimit, getActiveSessions);

/**
 * @route   DELETE /api/sessions
 * @desc    Logout from all devices except current
 * @access  Private
 */
router.delete('/', logoutLimit, logoutAllDevices);

/**
 * @route   DELETE /api/sessions/:sessionId
 * @desc    Logout from specific session
 * @access  Private
 */
router.delete('/:sessionId', 
    validateObjectId('sessionId'), 
    logoutLimit, 
    logoutSession
);

export default router;