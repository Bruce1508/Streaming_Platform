// backend/src/routes/user.routes.ts - ENHANCED VERSION
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { 
    getRecommendedUsers, 
    getMyFriends, 
    sendFriendRequest, 
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getFriendRequests, 
    getOutgoingFriendReqs,
    getMyProfile,
    updateMyProfile,
    updateProfilePicture,
    searchUsers,
    removeFriend,
    collectFriendData,
    getUserStats,
    getTopContributors,
    getUsersByProgram
} from '../controllers/user.controllers';

// Import rate limiters và validators
import { createRateLimit } from '../middleware/rateLimiter';
import { validateObjectId } from '../middleware/validation/common.validation';

const router = express.Router();

// ===== RATE LIMITING SETUP =====
const generalLimit = createRateLimit(100, 15); // 100 requests per 15 minutes
const searchLimit = createRateLimit(50, 15); // 50 searches per 15 minutes
const friendActionLimit = createRateLimit(20, 15); // 20 friend actions per 15 minutes
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

/**
 * @route   GET /api/users/top-contributors
 * @desc    Get top contributing users
 * @access  Private
 * @query   limit, program, school
 */
router.get("/top-contributors", generalLimit, getTopContributors);

/**
 * @route   GET /api/users/by-program/:programId
 * @desc    Get users by specific program
 * @access  Private
 * @query   page, limit, role
 */
router.get("/by-program/:programId", 
    validateObjectId('programId'), 
    generalLimit, 
    getUsersByProgram
);

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
    friendActionLimit, 
    removeFriend
);

/**
 * @route   GET /api/users/friend-requests
 * @desc    Get incoming friend requests
 * @access  Private
 * @query   page, limit
 */
router.get("/friend-requests", generalLimit, getFriendRequests);

/**
 * @route   GET /api/users/outgoing-friend-requests
 * @desc    Get outgoing friend requests
 * @access  Private
 * @query   page, limit
 */
router.get("/outgoing-friend-requests", generalLimit, getOutgoingFriendReqs);

/**
 * @route   POST /api/users/friend-request/:id
 * @desc    Send friend request
 * @access  Private
 */
router.post("/friend-request/:id", 
    validateObjectId('id'), 
    friendActionLimit, 
    sendFriendRequest
);

/**
 * @route   PUT /api/users/friend-request/:id/accept
 * @desc    Accept friend request
 * @access  Private
 */
router.put("/friend-request/:id/accept", 
    validateObjectId('id'), 
    friendActionLimit, 
    acceptFriendRequest
);

/**
 * @route   DELETE /api/users/friend-request/:id/reject
 * @desc    Reject friend request
 * @access  Private
 */
router.delete("/friend-request/:id/reject", 
    validateObjectId('id'), 
    friendActionLimit, 
    rejectFriendRequest
);

/**
 * @route   DELETE /api/users/friend-request/:id/cancel
 * @desc    Cancel outgoing friend request
 * @access  Private
 */
router.delete("/friend-request/:id/cancel", 
    validateObjectId('id'), 
    friendActionLimit, 
    cancelFriendRequest
);

/**
 * @route   GET /api/users/me-friends
 * @desc    Get comprehensive friend data for current user
 * @access  Private
 */
router.get("/me-friends", generalLimit, collectFriendData);

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
 * @route   PUT /api/users/profile-avatar
 * @desc    Update current user's profile picture
 * @access  Private
 */
router.put("/profile-avatar", profileUpdateLimit, updateProfilePicture);

/**
 * @route   GET /api/users/stats
 * @desc    Get current user's statistics
 * @access  Private
 */
router.get("/stats", generalLimit, getUserStats);

export default router;