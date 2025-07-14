"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
const notification_controllers_1 = require("../controllers/notification.controllers");
const router = express_1.default.Router();
// Rate limiting
const generalLimit = (0, rateLimiter_1.createRateLimit)(100, 15); // 100 requests per 15 minutes
// Apply auth middleware to all routes
router.use(auth_middleware_1.protectRoute);
/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 * @query   page, limit, unreadOnly
 */
router.get('/', generalLimit, notification_controllers_1.getNotifications);
/**
 * @route   PUT /api/notifications/:notificationId/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:notificationId/read', generalLimit, notification_controllers_1.markAsRead);
/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', generalLimit, notification_controllers_1.markAllAsRead);
/**
 * @route   DELETE /api/notifications/:notificationId
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:notificationId', generalLimit, notification_controllers_1.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map