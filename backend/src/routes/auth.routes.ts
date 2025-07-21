// src/routes/auth.routes.ts - ENHANCED VERSION
import express from "express";
import { 
    getMe, 
    logout, 
    logoutAllDevices, 
    updateProfile, 
    refreshToken,
    getAllUsers,
    handleOAuth,      // ✅ OAuth authentication
    sendMagicLink,    // ✅ Magic link authentication
    verifyMagicLink   // ✅ Magic link verification
} from "../controllers/auth.controllers";
import { protectRoute } from "../middleware/auth.middleware";

// Import rate limiters và validators  
import { authRateLimiters } from "../middleware/rateLimiter";
import { authValidators, securityMiddleware } from "../middleware/validation/auth.validation";

const router = express.Router();

// ===== PUBLIC ROUTES =====
// ✅ REMOVED: Traditional signUp/signIn routes - now using magic link + OAuth

// ✅ ENHANCED OAUTH ENDPOINT
router.post("/oauth", [
    authRateLimiters.oauth,
    securityMiddleware.sanitizeInput,
    authValidators.validateOAuth
], handleOAuth);

// ===== UTILITY ROUTES =====
router.post("/refresh", [
    authRateLimiters.general
], refreshToken);

// ===== MAGIC LINK ROUTES =====
router.post('/send-magic-link', [
    authValidators.validateSendMagicLink
], sendMagicLink);

router.post('/magic-link-verify', [
    authValidators.validateVerifyMagicLink
], verifyMagicLink);

// ===== PROTECTED ROUTES =====

// ✅ ENHANCED PROFILE UPDATE
router.put("/profile", [
    authRateLimiters.general,
    securityMiddleware.sanitizeInput,
    protectRoute
], updateProfile);

router.get("/me", [
    authRateLimiters.general,
    protectRoute
], getMe);

router.post("/logout", [
    authRateLimiters.general,
    protectRoute
], logout);

router.post("/logout-all", [
    authRateLimiters.general,
    protectRoute
], logoutAllDevices);

// ===== ADMIN ROUTES =====
router.get("/users", [
    authRateLimiters.general,
    protectRoute,
    // Add admin middleware here if needed
], getAllUsers);

export default router;