import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getStreamToken } from "../controllers/chat.controllers";
import { createRateLimit } from "../middleware/rateLimiter";

const router = express.Router();

// ===== RATE LIMITING SETUP =====
const tokenLimit = createRateLimit(30, 15); // 30 token requests per 15 minutes

// =====================================================
// STREAM TOKEN ROUTES
// =====================================================

/**
 * @route   GET /api/chat/token
 * @desc    Get stream token for real-time chat
 * @access  Private
 */
router.get("/token", protectRoute, tokenLimit, getStreamToken);

export default router;