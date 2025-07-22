"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
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
// Validate program code format (e.g., "3MAVEP3JF", "CPA", etc.)
const validateProgramCode = (paramName = 'programId') => [
    (0, express_validator_1.param)(paramName)
        .trim()
        .notEmpty()
        .withMessage(`${paramName} is required`)
        .isLength({ min: 2, max: 15 })
        .withMessage(`${paramName} must be 2-15 characters`)
        .matches(/^[A-Z0-9]+$/i)
        .withMessage(`${paramName} can only contain letters and numbers`),
    common_validation_1.handleValidationErrors
];
const validateReviewData = (req, res, next) => {
    const { currentSemester, ratings, takeTheCourseAgain } = req.body;
    // Validate currentSemester
    if (currentSemester && typeof currentSemester !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Current semester must be a string'
        });
    }
    // Validate takeTheCourseAgain
    if (takeTheCourseAgain !== undefined && typeof takeTheCourseAgain !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'takeTheCourseAgain must be a boolean'
        });
    }
    // Validate ratings structure
    if (ratings) {
        const { instructorRating, contentQualityRating, practicalValueRating } = ratings;
        if (instructorRating !== undefined && (typeof instructorRating !== 'number' || instructorRating < 0 || instructorRating > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Instructor rating must be a number between 0 and 100'
            });
        }
        if (contentQualityRating !== undefined && (typeof contentQualityRating !== 'number' || contentQualityRating < 0 || contentQualityRating > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Content quality rating must be a number between 0 and 100'
            });
        }
        if (practicalValueRating !== undefined && (typeof practicalValueRating !== 'number' || practicalValueRating < 0 || practicalValueRating > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Practical value rating must be a number between 0 and 100'
            });
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
router.get('/program/:programId', publicRateLimit, ...validateProgramCode('programId'), programReview_controllers_1.getProgramReviews);
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
router.get('/user/:programId', auth_middleware_1.protectRoute, ...validateProgramCode('programId'), programReview_controllers_1.getUserReviewForProgram);
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