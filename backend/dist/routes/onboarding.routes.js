"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const onboarding_controllers_1 = require("../controllers/onboarding.controllers");
// Middleware imports
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
const onboarding_validation_1 = require("../middleware/validation/onboarding.validation");
const router = (0, express_1.Router)();
// Rate limiters
const onboardingRateLimit = (0, rateLimiter_1.createRateLimit)(10, 15); // 10 requests per 15 minutes
// ===== AUTHENTICATED ROUTES (User must be logged in) =====
/**
 * @route   GET /api/onboarding/status
 * @desc    Get user's onboarding status and progress
 * @access  Private
 */
router.get('/status', auth_middleware_1.protectRoute, onboardingRateLimit, onboarding_controllers_1.getOnboardingStatus);
/**
 * @route   POST /api/onboarding/complete
 * @desc    Complete onboarding with academic information
 * @access  Private
 */
router.post('/complete', auth_middleware_1.protectRoute, onboardingRateLimit, onboarding_validation_1.validateOnboardingComplete, onboarding_controllers_1.completeOnboarding);
/**
 * @route   PUT /api/onboarding/academic
 * @desc    Update user's academic information
 * @access  Private
 */
router.put('/academic', auth_middleware_1.protectRoute, onboardingRateLimit, onboarding_validation_1.validateAcademicUpdate, onboarding_controllers_1.updateAcademicInfo);
/**
 * @route   POST /api/onboarding/skip
 * @desc    Skip onboarding process
 * @access  Private
 */
router.post('/skip', auth_middleware_1.protectRoute, onboardingRateLimit, onboarding_controllers_1.skipOnboarding);
exports.default = router;
//# sourceMappingURL=onboarding.routes.js.map