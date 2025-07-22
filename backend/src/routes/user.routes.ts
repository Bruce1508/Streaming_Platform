// backend/src/routes/user.routes.ts - CLEANED VERSION
import express from 'express';
import { protectRoute } from '../middleWare/auth.middleware';
import { 
    getRecommendedUsers, 
    getMyFriends, 
    getMyProfile,
    updateMyProfile,
    searchUsers,
    removeFriend,
    getUserStats
} from '../controllers/user.controllers';

// Import rate limiters và validators
import { createRateLimit } from '../middleWare/rateLimiter';
import { validateObjectId } from '../middleWare/validation/common.validation';

const router = express.Router();

// ===== RATE LIMITING SETUP =====
const generalLimit = createRateLimit(100, 15); // 100 requests per 15 minutes
const searchLimit = createRateLimit(50, 15); // 50 searches per 15 minutes
const profileUpdateLimit = createRateLimit(10, 15); // 10 profile updates per 15 minutes

// Apply auth middleware to all routes
router.use(protectRoute);

// =====================================================
// USER SEARCH & DISCOVERY ROUTES
// =====================================================

/**
 * @route   GET /api/users/recommended
 * @desc    Get recommended users based on academic profile
 * @access  Private
 */
router.get("/recommended", generalLimit, getRecommendedUsers);

/**
 * @route   GET /api/users/search
 * @desc    Search users by name, email, or academic criteria
 * @access  Private
 * @query   search, program, school, role, page, limit
 */
router.get("/search", searchLimit, searchUsers);

// =====================================================
// FRIENDS MANAGEMENT ROUTES
// =====================================================

/**
 * @route   GET /api/users/friends
 * @desc    Get current user's friends list
 * @access  Private
 * @query   page, limit, search
 */
router.get("/friends", generalLimit, getMyFriends);

/**
 * @route   DELETE /api/users/friends/:friendId
 * @desc    Remove a friend
 * @access  Private
 */
router.delete("/friends/:friendId", 
    validateObjectId('friendId'), 
    generalLimit, 
    removeFriend
);

// =====================================================
// PROFILE MANAGEMENT ROUTES
// =====================================================

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/profile", generalLimit, getMyProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put("/profile", profileUpdateLimit, updateMyProfile);

/**
 * @route   GET /api/users/stats
 * @desc    Get current user's statistics
 * @access  Private
 */
router.get("/stats", generalLimit, getUserStats);

export default router;