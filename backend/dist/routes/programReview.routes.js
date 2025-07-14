"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programReview_controllers_1 = require("../controllers/programReview.controllers");
// Middleware imports
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
const common_validation_1 = require("../middleware/validation/common.validation");
const router = (0, express_1.Router)();
// Rate limiters
const reviewRateLimit = (0, rateLimiter_1.createRateLimit)(5, 15); // 5 reviews per 15 minutes per user
const publicRateLimit = (0, rateLimiter_1.createRateLimit)(100, 15); // 100 requests per 15 minutes
// ===== VALIDATION MIDDLEWARE =====
const validateReviewData = (req, res, next) => {
    const { year, criteriaRatings } = req.body;
    // Validate year
    if (year && (year < 2000 || year > new Date().getFullYear() + 2)) {
        return res.status(400).json({
            success: false,
            message: 'Year must be between 2000 and next year'
        });
    }
    // Validate criteriaRatings structure
    if (criteriaRatings) {
        const requiredCriteria = [
            'TeachingQuality', 'FacultySupport', 'LearningEnvironment',
            'LibraryResources', 'StudentSupport', 'CampusLife', 'OverallExperience'
        ];
        for (const criteria of requiredCriteria) {
            const rating = criteriaRatings[criteria];
            if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
                return res.status(400).json({
                    success: false,
                    message: `${criteria} must be a number between 1 and 5`
                });
            }
        }
    }
    next();
};
// ===== PUBLIC ROUTES =====
/**
 * @route   GET /api/program-reviews/program/:programId
 * @desc    Get all reviews for a specific program with averages
 * @access  Public
 */
router.get('/program/:programId', publicRateLimit, (0, common_validation_1.validateObjectId)('programId'), common_validation_1.handleValidationErrors, programReview_controllers_1.getProgramReviews);
// ===== PROTECTED ROUTES =====
/**
 * @route   POST /api/program-reviews
 * @desc    Create a new review for a program
 * @access  Private (authenticated users only)
 */
router.post('/', auth_middleware_1.protectRoute, reviewRateLimit, validateReviewData, common_validation_1.handleValidationErrors, programReview_controllers_1.createReview);
/**
 * @route   GET /api/program-reviews/user/:programId
 * @desc    Get current user's review for a specific program
 * @access  Private
 */
router.get('/user/:programId', auth_middleware_1.protectRoute, (0, common_validation_1.validateObjectId)('programId'), common_validation_1.handleValidationErrors, programReview_controllers_1.getUserReviewForProgram);
/**
 * @route   POST /api/program-reviews/:reviewId/like
 * @desc    Like a review
 * @access  Private
 */
router.post('/:reviewId/like', auth_middleware_1.protectRoute, (0, common_validation_1.validateObjectId)('reviewId'), common_validation_1.handleValidationErrors, programReview_controllers_1.likeReview);
/**
 * @route   POST /api/program-reviews/:reviewId/dislike
 * @desc    Dislike a review
 * @access  Private
 */
router.post('/:reviewId/dislike', auth_middleware_1.protectRoute, (0, common_validation_1.validateObjectId)('reviewId'), common_validation_1.handleValidationErrors, programReview_controllers_1.dislikeReview);
/**
 * @route   PUT /api/program-reviews/:reviewId
 * @desc    Update user's own review
 * @access  Private (review owner only)
 */
router.put('/:reviewId', auth_middleware_1.protectRoute, (0, common_validation_1.validateObjectId)('reviewId'), validateReviewData, common_validation_1.handleValidationErrors, programReview_controllers_1.updateReview);
/**
 * @route   DELETE /api/program-reviews/:reviewId
 * @desc    Delete user's own review
 * @access  Private (review owner only)
 */
router.delete('/:reviewId', auth_middleware_1.protectRoute, (0, common_validation_1.validateObjectId)('reviewId'), common_validation_1.handleValidationErrors, programReview_controllers_1.deleteReview);
exports.default = router;
//# sourceMappingURL=programReview.routes.js.map