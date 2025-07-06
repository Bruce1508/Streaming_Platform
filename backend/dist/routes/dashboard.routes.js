"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/dashboard.routes.ts - FULLY ENHANCED VERSION
const express_1 = require("express");
const dashboard_controllers_1 = require("../controllers/dashboard.controllers"); // <-- Sử dụng file mới (số nhiều)
const auth_middleware_1 = require("../middleware/auth.middleware");
const query_validation_1 = require("../middleware/validation/query.validation");
const router = (0, express_1.Router)();
// =====================================================
// ADMIN & PROFESSOR ANALYTICS ROUTES
// =====================================================
/**
 * @route   GET /api/dashboard/overview
 * @desc    Get comprehensive dashboard overview statistics
 * @access  Admin/Professor only
 */
router.get('/overview', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin', 'professor']), dashboard_controllers_1.getDashboard);
/**
 * @route   GET /api/dashboard/users
 * @desc    Get user analytics
 * @access  Admin only
 */
router.get('/users', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), query_validation_1.validateQueryParams, dashboard_controllers_1.getUserAnalytics);
/**
 * @route   GET /api/dashboard/materials
 * @desc    Get material analytics
 * @access  Admin/Professor only
 */
router.get('/materials', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin', 'professor']), query_validation_1.validateQueryParams, dashboard_controllers_1.getMaterialAnalytics);
/**
 * @route   GET /api/dashboard/courses
 * @desc    Get course analytics
 * @access  Admin/Professor only
 */
router.get('/courses', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin', 'professor']), query_validation_1.validateQueryParams, dashboard_controllers_1.getCourseAnalytics);
/**
 * @route   GET /api/dashboard/health
 * @desc    Get system health metrics
 * @access  Admin only
 */
router.get('/health', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), dashboard_controllers_1.getSystemHealth);
// =====================================================
// PUBLIC & USER-SPECIFIC ROUTES
// =====================================================
/**
 * @route   GET /api/dashboard/trending
 * @desc    Get trending materials and content
 * @access  Public
 */
router.get('/trending', query_validation_1.validateQueryParams, dashboard_controllers_1.getTrendingContent);
/**
 * @route   GET /api/dashboard/my-activity
 * @desc    Get personal activity dashboard for the logged-in user
 * @access  Authenticated users
 */
router.get('/my-activity', auth_middleware_1.protectRoute, query_validation_1.validateQueryParams, dashboard_controllers_1.getMyActivity);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map