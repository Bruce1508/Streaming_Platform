"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const session_middleware_1 = require("../middleware/session.middleware");
const session_controllers_1 = require("../controllers/session.controllers");
const rateLimiter_1 = require("../middleware/rateLimiter");
const common_validation_1 = require("../middleware/validation/common.validation");
const router = (0, express_1.Router)();
// ===== RATE LIMITING SETUP =====
const sessionLimit = (0, rateLimiter_1.createRateLimit)(50, 15); // 50 session operations per 15 minutes
const logoutLimit = (0, rateLimiter_1.createRateLimit)(10, 15); // 10 logout operations per 15 minutes
// All session routes require authentication
router.use([
    session_middleware_1.optionalSessionValidation, // Get session info
    auth_middleware_1.protectRoute // Require valid JWT
]);
// =====================================================
// SESSION MANAGEMENT ROUTES
// =====================================================
/**
 * @route   GET /api/sessions
 * @desc    Get user's active sessions
 * @access  Private
 * @query   page, limit
 */
router.get('/', sessionLimit, session_controllers_1.getActiveSessions);
/**
 * @route   DELETE /api/sessions
 * @desc    Logout from all devices except current
 * @access  Private
 */
router.delete('/', logoutLimit, session_controllers_1.logoutAllDevices);
/**
 * @route   DELETE /api/sessions/:sessionId
 * @desc    Logout from specific session
 * @access  Private
 */
router.delete('/:sessionId', (0, common_validation_1.validateObjectId)('sessionId'), logoutLimit, session_controllers_1.logoutSession);
exports.default = router;
//# sourceMappingURL=session.routes.js.map