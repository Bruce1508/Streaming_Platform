// src/routes/auth.routes.ts - ENHANCED VERSION
import express from "express";
import { 
    signIn, 
    signUp, 
    getMe, 
    logout, 
    logoutAllDevices, // ✅ NEW ENHANCED
    updateProfile, 
    refreshToken,
    getAllUsers,      // ✅ NEW
    forgotPassword,   // ✅ NEW  
    resetPassword     // ✅ NEW
} from "../controllers/auth.controllers";
import { protectRoute } from "../middleware/auth.middleware";

// Import rate limiters và validators  
import { authRateLimiters } from "../middleware/rateLimiter";
import { authValidators, securityMiddleware } from "../middleware/validation/auth.validation";

const router = express.Router();

// ===== PUBLIC ROUTES =====

// ✅ ENHANCED SIGNUP với additional validation
router.post("/signUp", [
    authRateLimiters.register,           // Rate limiting
    securityMiddleware.sanitizeInput,    // XSS prevention
    authValidators.validateSignUp       // Validation
], signUp);

// ✅ ENHANCED SIGNIN với progressive rate limiting
router.post("/signIn", [
    authRateLimiters.login,              // Progressive rate limiting
    securityMiddleware.sanitizeInput,    // XSS prevention
    authValidators.validateSignIn       // Validation
], signIn);

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