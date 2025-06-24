import { Router } from 'express';
import {
    completeOnboarding,
    updateAcademicInfo,
    getOnboardingStatus,
    skipOnboarding
} from '../controllers/onboarding.controllers';

// Middleware imports
import { 
    protectRoute 
} from '../middleware/auth.middleware';
import { createRateLimit } from '../middleware/rateLimiter';

// Validation imports
import {
    handleValidationErrors
} from '../middleware/validation/common.validation';
import { validateOnboardingComplete, validateAcademicUpdate } from '../middleware/validation/onboarding.validation';

const router = Router();

// Rate limiters
const onboardingRateLimit = createRateLimit(10, 15); // 10 requests per 15 minutes

// ===== AUTHENTICATED ROUTES (User must be logged in) =====

/**
 * @route   GET /api/onboarding/status
 * @desc    Get user's onboarding status and progress
 * @access  Private
 */
router.get('/status', protectRoute, onboardingRateLimit, getOnboardingStatus);

/**
 * @route   POST /api/onboarding/complete
 * @desc    Complete onboarding with academic information
 * @access  Private
 */
router.post('/complete', protectRoute, onboardingRateLimit, validateOnboardingComplete, completeOnboarding);

/**
 * @route   PUT /api/onboarding/academic
 * @desc    Update user's academic information
 * @access  Private
 */
router.put('/academic', protectRoute, onboardingRateLimit, validateAcademicUpdate, updateAcademicInfo);

/**
 * @route   POST /api/onboarding/skip
 * @desc    Skip onboarding process
 * @access  Private
 */
router.post('/skip', protectRoute, onboardingRateLimit, skipOnboarding);

export default router; 