// src/routes/auth.routes.ts - ENHANCED VERSION
import express from "express";
import { 
    getMe, 
    logout, 
    logoutAllDevices, 
    updateProfile, 
    refreshToken,
    getAllUsers,
    forgotPassword,
    resetPassword,
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

// ✅ ENHANCED REFRESH TOKEN với rate limiting
router.post("/refresh", [
    authRateLimiters.general,
    securityMiddleware.sanitizeInput
], refreshToken);

// ✅ NEW - FORGOT PASSWORD
router.post("/forgot-password", [
    authRateLimiters.passwordReset,      // Use existing rate limiter
    securityMiddleware.sanitizeInput,
    authValidators.validateForgotPassword
], forgotPassword);

// ✅ NEW - RESET PASSWORD
router.post("/reset-password", [
    authRateLimiters.general,
    securityMiddleware.sanitizeInput,
    authValidators.validateResetPassword
], resetPassword);

// ✅ NEW - OAUTH HANDLER (Minimal middleware for OAuth)
router.post("/oauth", [
    authRateLimiters.general
    // Remove sanitizeInput middleware that's causing issues
], handleOAuth);

// ===== MAGIC LINK ROUTES =====
router.post('/send-magic-link', 
    authValidators.validateSendMagicLink, 
    sendMagicLink
);

router.post('/magic-link-verify', 
    authValidators.validateVerifyMagicLink, 
    verifyMagicLink
);

// ===== PROTECTED ROUTES =====

// ✅ ENHANCED PROFILE UPDATE
router.put("/profile", [
    authRateLimiters.general,
    securityMiddleware.sanitizeInput,
    protectRoute
], updateProfile);

// ✅ ENHANCED GET ME
router.get('/me', [
    protectRoute                        // ← Auth required
], getMe);

// ✅ ENHANCED LOGOUT với token blacklisting
router.post("/logout", [
    authRateLimiters.general,
    protectRoute                         // ← Must be authenticated to logout
], logout);

// ✅ NEW - LOGOUT FROM ALL DEVICES
router.post("/logout-all-devices", [
    authRateLimiters.general,
    protectRoute                         // ← Must be authenticated
], logoutAllDevices);

// ===== ADMIN ROUTES =====

// ✅ NEW - GET ALL USERS (Admin only)
router.get("/users", [
    protectRoute
], getAllUsers);

// ✅ NEW - HEALTH CHECK
router.get("/health", (req: express.Request, res: express.Response) => {
    res.json({
        success: true,
        message: "Auth service is healthy",
        timestamp: new Date().toISOString()
    });
});

export default router;