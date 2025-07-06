import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { createRateLimit } from '../middleware/rateLimiter';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from '../controllers/notification.controllers';

const router = express.Router();

// Rate limiting
const generalLimit = createRateLimit(100, 15); // 100 requests per 15 minutes

// Apply auth middleware to all routes
router.use(protectRoute);

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 * @query   page, limit, unreadOnly
 */
router.get('/', generalLimit, getNotifications);

/**
 * @route   PUT /api/notifications/:notificationId/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:notificationId/read', generalLimit, markAsRead);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', generalLimit, markAllAsRead);

/**
 * @route   DELETE /api/notifications/:notificationId
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:notificationId', generalLimit, deleteNotification);

export default router; 