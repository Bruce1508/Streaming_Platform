import { Router } from 'express';
import { param } from 'express-validator';
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
import { protectRoute } from '../middleWare/auth.middleware';
import { createRateLimit } from '../middleWare/rateLimiter';
import {
    validateObjectId,
    handleValidationErrors
} from '../middleWare/validation/common.validation';

const router = Router();

// Rate limiters
const reviewRateLimit = createRateLimit(5, 15); // 5 reviews per 15 minutes per user
const publicRateLimit = createRateLimit(100, 15); // 100 requests per 15 minutes

// ===== VALIDATION MIDDLEWARE =====

// Validate program code format (e.g., "3MAVEP3JF", "CPA", etc.)
const validateProgramCode = (paramName: string = 'programId') => [
    param(paramName)
        .trim()
        .notEmpty()
        .withMessage(`${paramName} is required`)
        .isLength({ min: 2, max: 15 })
        .withMessage(`${paramName} must be 2-15 characters`)
        .matches(/^[A-Z0-9]+$/i)
        .withMessage(`${paramName} can only contain letters and numbers`),
    handleValidationErrors
];

const validateReviewData = (req: any, res: any, next: any) => {
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
router.get('/program/:programId', 
    publicRateLimit,
    ...validateProgramCode('programId'),
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
    ...validateProgramCode('programId'),
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