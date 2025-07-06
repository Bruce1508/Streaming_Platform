"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts - ENHANCED VERSION
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
// Import rate limiters và validators  
const rateLimiter_1 = require("../middleware/rateLimiter");
const auth_validation_1 = require("../middleware/validation/auth.validation");
const router = express_1.default.Router();
// ===== PUBLIC ROUTES =====
// ✅ ENHANCED SIGNUP với additional validation
router.post("/signUp", [
    rateLimiter_1.authRateLimiters.register, // Rate limiting
    auth_validation_1.securityMiddleware.sanitizeInput, // XSS prevention
    auth_validation_1.authValidators.validateSignUp // Validation
], auth_controllers_1.signUp);
// ✅ ENHANCED SIGNIN với progressive rate limiting
router.post("/signIn", [
    rateLimiter_1.authRateLimiters.login, // Progressive rate limiting
    auth_validation_1.securityMiddleware.sanitizeInput, // XSS prevention
    auth_validation_1.authValidators.validateSignIn // Validation
], auth_controllers_1.signIn);
// ✅ ENHANCED REFRESH TOKEN với rate limiting
router.post("/refresh", [
    rateLimiter_1.authRateLimiters.general,
    auth_validation_1.securityMiddleware.sanitizeInput
], auth_controllers_1.refreshToken);
// ✅ NEW - FORGOT PASSWORD
router.post("/forgot-password", [
    rateLimiter_1.authRateLimiters.passwordReset, // Use existing rate limiter
    auth_validation_1.securityMiddleware.sanitizeInput,
    auth_validation_1.authValidators.validateForgotPassword
], auth_controllers_1.forgotPassword);
// ✅ NEW - RESET PASSWORD
router.post("/reset-password", [
    rateLimiter_1.authRateLimiters.general,
    auth_validation_1.securityMiddleware.sanitizeInput,
    auth_validation_1.authValidators.validateResetPassword
], auth_controllers_1.resetPassword);
// ✅ NEW - OAUTH HANDLER (Minimal middleware for OAuth)
router.post("/oauth", [
    rateLimiter_1.authRateLimiters.general
    // Remove sanitizeInput middleware that's causing issues
], auth_controllers_1.handleOAuth);
// ===== PROTECTED ROUTES =====
// ✅ ENHANCED PROFILE UPDATE
router.put("/profile", [
    rateLimiter_1.authRateLimiters.general,
    auth_validation_1.securityMiddleware.sanitizeInput,
    auth_middleware_1.protectRoute
], auth_controllers_1.updateProfile);
// ✅ ENHANCED GET ME
router.get('/me', [
    auth_middleware_1.protectRoute // ← Auth required
], auth_controllers_1.getMe);
// ✅ ENHANCED LOGOUT với token blacklisting
router.post("/logout", [
    rateLimiter_1.authRateLimiters.general,
    auth_middleware_1.protectRoute // ← Must be authenticated to logout
], auth_controllers_1.logout);
// ✅ NEW - LOGOUT FROM ALL DEVICES
router.post("/logout-all-devices", [
    rateLimiter_1.authRateLimiters.general,
    auth_middleware_1.protectRoute // ← Must be authenticated
], auth_controllers_1.logoutAllDevices);
// ===== ADMIN ROUTES =====
// ✅ NEW - GET ALL USERS (Admin only)
router.get("/users", [
    auth_middleware_1.protectRoute
], auth_controllers_1.getAllUsers);
// ✅ NEW - HEALTH CHECK
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Auth service is healthy",
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map