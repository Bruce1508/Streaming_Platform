"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/user.routes.ts - CLEANED VERSION
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controllers_1 = require("../controllers/user.controllers");
// Import rate limiters và validators
const rateLimiter_1 = require("../middleware/rateLimiter");
const common_validation_1 = require("../middleware/validation/common.validation");
const router = express_1.default.Router();
// ===== RATE LIMITING SETUP =====
const generalLimit = (0, rateLimiter_1.createRateLimit)(100, 15); // 100 requests per 15 minutes
const searchLimit = (0, rateLimiter_1.createRateLimit)(50, 15); // 50 searches per 15 minutes
const profileUpdateLimit = (0, rateLimiter_1.createRateLimit)(10, 15); // 10 profile updates per 15 minutes
// Apply auth middleware to all routes
router.use(auth_middleware_1.protectRoute);
// =====================================================
// USER SEARCH & DISCOVERY ROUTES
// =====================================================
/**
 * @route   GET /api/users/recommended
 * @desc    Get recommended users based on academic profile
 * @access  Private
 */
router.get("/recommended", generalLimit, user_controllers_1.getRecommendedUsers);
/**
 * @route   GET /api/users/search
 * @desc    Search users by name, email, or academic criteria
 * @access  Private
 * @query   search, program, school, role, page, limit
 */
router.get("/search", searchLimit, user_controllers_1.searchUsers);
// =====================================================
// FRIENDS MANAGEMENT ROUTES
// =====================================================
/**
 * @route   GET /api/users/friends
 * @desc    Get current user's friends list
 * @access  Private
 * @query   page, limit, search
 */
router.get("/friends", generalLimit, user_controllers_1.getMyFriends);
/**
 * @route   DELETE /api/users/friends/:friendId
 * @desc    Remove a friend
 * @access  Private
 */
router.delete("/friends/:friendId", (0, common_validation_1.validateObjectId)('friendId'), generalLimit, user_controllers_1.removeFriend);
// =====================================================
// PROFILE MANAGEMENT ROUTES
// =====================================================
/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/profile", generalLimit, user_controllers_1.getMyProfile);
/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put("/profile", profileUpdateLimit, user_controllers_1.updateMyProfile);
/**
 * @route   GET /api/users/stats
 * @desc    Get current user's statistics
 * @access  Private
 */
router.get("/stats", generalLimit, user_controllers_1.getUserStats);
exports.default = router;
//# sourceMappingURL=user.routes.js.map