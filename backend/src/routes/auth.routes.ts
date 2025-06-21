// src/routes/auth.routes.ts - Version đơn giản
import express from "express";
import { signIn, signUp, onBoarding, getMe, oauth, logout, updateProfile, refreshToken } from "../controllers/auth.controllers";
import { protectRoute } from "../middleware/auth.middleware";

// Import rate limiters và validators
import { authRateLimiters } from "../middleware/rateLimiter";
import { authValidators, securityMiddleware } from "../middleware/validation/auth.validation";
import { optionalSessionValidation } from "../middleware/session.middleware";

const router = express.Router();

// ✅ Simplified middleware chains
router.post("/signUp", [
    authRateLimiters.register,           // Rate limiting
    securityMiddleware.sanitizeInput,    // XSS prevention
    authValidators.validateSignUp       // Validation
], signUp);

router.post("/signIn", [
    authRateLimiters.login,              // Progressive rate limiting
    securityMiddleware.sanitizeInput,    // XSS prevention
    authValidators.validateSignIn       // Validation
], signIn);

router.put("/onBoarding", [
    authRateLimiters.general,
    securityMiddleware.sanitizeInput,
    authValidators.validateOnBoarding,
    optionalSessionValidation,           // ← Before auth
    protectRoute                         // ← Auth last
], onBoarding);

router.put("/profile", [         // ← Update existing profile  
    authRateLimiters.general,
    securityMiddleware.sanitizeInput,
    authValidators.validateOnBoarding,
    protectRoute
], updateProfile);

router.post("/oauth", [
    authRateLimiters.oauth,             // OAuth rate limiting
    securityMiddleware.sanitizeInput,    // XSS prevention
], oauth);

router.post("/refresh", [
    authRateLimiters.general,
    securityMiddleware.sanitizeInput
], refreshToken);

router.post("/logout", [
    authRateLimiters.general,
    optionalSessionValidation,           // ← Get session to deactivate
    protectRoute                         // ← Must be authenticated to logout
], logout);

router.get('/me', [
    protectRoute,                        // ← Auth first
    optionalSessionValidation            // ← Session enhancement after
], getMe);

export default router;