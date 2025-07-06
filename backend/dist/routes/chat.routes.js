"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const chat_controllers_1 = require("../controllers/chat.controllers");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
// ===== RATE LIMITING SETUP =====
const tokenLimit = (0, rateLimiter_1.createRateLimit)(30, 15); // 30 token requests per 15 minutes
// =====================================================
// STREAM TOKEN ROUTES
// =====================================================
/**
 * @route   GET /api/chat/token
 * @desc    Get stream token for real-time chat
 * @access  Private
 */
router.get("/token", auth_middleware_1.protectRoute, tokenLimit, chat_controllers_1.getStreamToken);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map