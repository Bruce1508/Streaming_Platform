import { Router } from 'express';
import {
    createReview,
    getProgramReviews,
    updateReview,
    deleteReview,
    getUserReviewForProgram,
    likeReview,
    dislikeReview
} from '../controllers/programReview.controllers';

// Middleware imports
import { protectRoute } from '../middleware/auth.middleware';
import { createRateLimit } from '../middleware/rateLimiter';
import {
    validateObjectId,
    handleValidationErrors
} from '../middleware/validation/common.validation';

const router = Router();

// Rate limiters
const reviewRateLimit = createRateLimit(5, 15); // 5 reviews per 15 minutes per user
const publicRateLimit = createRateLimit(100, 15); // 100 requests per 15 minutes

// ===== VALIDATION MIDDLEWARE =====
const validateReviewData = (req: any, res: any, next: any) => {
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
router.get('/program/:programId', 
    publicRateLimit,
    validateObjectId('programId'),
    handleValidationErrors,
    getProgramReviews
);

// ===== PROTECTED ROUTES =====

/**
 * @route   POST /api/program-reviews
 * @desc    Create a new review for a program
 * @access  Private (authenticated users only)
 */
router.post('/',
    protectRoute,
    reviewRateLimit,
    validateReviewData,
    handleValidationErrors,
    createReview
);

/**
 * @route   GET /api/program-reviews/user/:programId
 * @desc    Get current user's review for a specific program
 * @access  Private
 */
router.get('/user/:programId',
    protectRoute,
    validateObjectId('programId'),
    handleValidationErrors,
    getUserReviewForProgram
);

/**
 * @route   POST /api/program-reviews/:reviewId/like
 * @desc    Like a review
 * @access  Private
 */
router.post('/:reviewId/like',
    protectRoute,
    validateObjectId('reviewId'),
    handleValidationErrors,
    likeReview
);

/**
 * @route   POST /api/program-reviews/:reviewId/dislike
 * @desc    Dislike a review
 * @access  Private
 */
router.post('/:reviewId/dislike',
    protectRoute,
    validateObjectId('reviewId'),
    handleValidationErrors,
    dislikeReview
);

/**
 * @route   PUT /api/program-reviews/:reviewId
 * @desc    Update user's own review
 * @access  Private (review owner only)
 */
router.put('/:reviewId',
    protectRoute,
    validateObjectId('reviewId'),
    validateReviewData,
    handleValidationErrors,
    updateReview
);

/**
 * @route   DELETE /api/program-reviews/:reviewId
 * @desc    Delete user's own review
 * @access  Private (review owner only)
 */
router.delete('/:reviewId',
    protectRoute,
    validateObjectId('reviewId'),
    handleValidationErrors,
    deleteReview
);

export default router; 