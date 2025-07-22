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
// ✅ REMOVED: Traditional signUp/signIn routes - now using magic link + OAuth
// ✅ ENHANCED OAUTH ENDPOINT
router.post("/oauth", [
    rateLimiter_1.authRateLimiters.oauth,
    auth_validation_1.securityMiddleware.sanitizeInput,
    auth_validation_1.authValidators.validateOAuth
], auth_controllers_1.handleOAuth);
// ===== UTILITY ROUTES =====
router.post("/refresh", [
    rateLimiter_1.authRateLimiters.general
], auth_controllers_1.refreshToken);
// ===== MAGIC LINK ROUTES =====
router.post('/send-magic-link', [
    auth_validation_1.authValidators.validateSendMagicLink
], auth_controllers_1.sendMagicLink);
router.post('/magic-link-verify', [
    auth_validation_1.authValidators.validateVerifyMagicLink
], auth_controllers_1.verifyMagicLink);
// ===== PROTECTED ROUTES =====
// ✅ ENHANCED PROFILE UPDATE
router.put("/profile", [
    rateLimiter_1.authRateLimiters.general,
    auth_validation_1.securityMiddleware.sanitizeInput,
    auth_middleware_1.protectRoute
], auth_controllers_1.updateProfile);
router.get("/me", [
    rateLimiter_1.authRateLimiters.general,
    auth_middleware_1.protectRoute
], auth_controllers_1.getMe);
router.post("/logout", [
    rateLimiter_1.authRateLimiters.general,
    auth_middleware_1.protectRoute
], auth_controllers_1.logout);
router.post("/logout-all", [
    rateLimiter_1.authRateLimiters.general,
    auth_middleware_1.protectRoute
], auth_controllers_1.logoutAllDevices);
// ===== ADMIN ROUTES =====
router.get("/users", [
    rateLimiter_1.authRateLimiters.general,
    auth_middleware_1.protectRoute,
    // Add admin middleware here if needed
], auth_controllers_1.getAllUsers);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map