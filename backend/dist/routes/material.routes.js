"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/material.routes.ts - ADD MISSING ROUTES
const express_1 = require("express");
const material_controllers_1 = require("../controllers/material.controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const material_middleware_1 = require("../middleware/material.middleware");
const router = (0, express_1.Router)();
// =====================================================
// PUBLIC ROUTES - No Authentication Required
// =====================================================
router.get('/', material_middleware_1.validateQueryParams, material_controllers_1.getStudyMaterials);
router.get('/search', material_middleware_1.validateQueryParams, material_controllers_1.searchMaterials); // ← NEW: Enhanced search endpoint
router.get('/category/:category', material_middleware_1.validateQueryParams, material_controllers_1.getMaterialsByCategory);
router.get('/featured', material_controllers_1.getFeaturedMaterials);
router.get('/popular', material_controllers_1.getPopularMaterials);
router.get('/course/:courseId', (0, material_middleware_1.validateObjectId)('courseId'), material_controllers_1.getMaterialsByCourse);
router.get('/program/:programId', (0, material_middleware_1.validateObjectId)('programId'), material_controllers_1.getMaterialsByProgram);
router.get('/:id', (0, material_middleware_1.validateObjectId)('id'), material_controllers_1.getStudyMaterialById);
router.get('/:id/stats', (0, material_middleware_1.validateObjectId)('id'), material_controllers_1.getMaterialStats);
// =====================================================
// MATERIAL CRUD ROUTES - Authentication Required
// =====================================================
router.post('/', auth_middleware_1.protectRoute, material_middleware_1.validateCreateMaterial, material_controllers_1.createStudyMaterial);
router.put('/:id', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_middleware_1.validateUpdateMaterial, material_controllers_1.updateStudyMaterial);
router.delete('/:id', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_controllers_1.deleteStudyMaterial);
// =====================================================
// MATERIAL INTERACTION ROUTES - Authentication Required
// =====================================================
router.post('/:id/save', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_controllers_1.saveMaterial);
router.delete('/:id/save', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_controllers_1.removeSavedMaterial);
// Rating routes
router.post('/:id/rate', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_middleware_1.validateRating, material_controllers_1.rateMaterial);
router.delete('/:id/rate', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_controllers_1.removeRating); // ← ADDED
// Comment routes
router.post('/:id/comments', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_middleware_1.validateComment, material_controllers_1.addComment);
router.put('/:id/comments/:commentId', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_middleware_1.validateComment, material_controllers_1.updateComment);
router.delete('/:id/comments/:commentId', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_controllers_1.deleteComment);
// Report route
router.post('/:id/report', auth_middleware_1.protectRoute, (0, material_middleware_1.validateObjectId)('id'), material_controllers_1.reportMaterial); // ← ADDED
// =====================================================
// USER-SPECIFIC ROUTES - Authentication Required
// =====================================================
/**
 * GET /api/materials/userSaved
 * Get current user's saved/bookmarked materials
 */
router.get('/userSaved', auth_middleware_1.protectRoute, material_middleware_1.validateQueryParams, material_controllers_1.getUserSavedMaterials);
/**
 * GET /api/materials/userUploaded
 * Get current user's uploaded materials
 */
router.get('/userUploaded', auth_middleware_1.protectRoute, material_middleware_1.validateQueryParams, material_controllers_1.getUserUploadedMaterials);
exports.default = router;
//# sourceMappingURL=material.routes.js.map