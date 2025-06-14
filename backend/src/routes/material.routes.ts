import { Router } from 'express';
import {
    getStudyMaterialById,
    getMaterialsByCategory,
    saveMaterial,
    removeSavedMaterial, 
    rateMaterial,
    addComment,
    getUserSavedMaterials,
    getUserUploadedMaterials
} from '../controllers/material.controller';
import { protectRoute } from '../middleWare/auth.middleware';

const router = Router();

// =====================================================
// PUBLIC ROUTES - No Authentication Required
// =====================================================

/**
 * GET /api/materials/category/:category
 * Get study materials by specific category
 * Params: category (string)
 * Query params: language, level, limit
 */
router.get('/category/:category', getMaterialsByCategory);

/**
 * GET /api/materials/:id
 * Get single study material by ID
 * Params: id (MongoDB ObjectId)
 */
router.get('/:id', getStudyMaterialById);

// =====================================================
// MATERIAL INTERACTION ROUTES - Authentication Required
// =====================================================

/**
 * POST /api/materials/:id/save
 * Save/bookmark a study material
 * Params: id (MongoDB ObjectId)
 */
router.post('/:id/save', protectRoute, saveMaterial);

/**
 * DELETE /api/materials/:id/save
 * Remove bookmark from study material
 * Params: id (MongoDB ObjectId)
 */
router.delete('/:id/save', protectRoute, removeSavedMaterial);  // ✅ Updated function name

/**
 * POST /api/materials/:id/rate
 * Rate a study material (1-5 stars)
 * Params: id (MongoDB ObjectId)
 * Body: rating (number 1-5)
 */
router.post('/:id/rate', protectRoute, rateMaterial);

/**
 * POST /api/materials/:id/comments
 * Add comment to study material
 * Params: id (MongoDB ObjectId)
 * Body: content (string)
 */
router.post('/:id/comments', protectRoute, addComment);

// =====================================================
// USER-SPECIFIC ROUTES - Authentication Required
// =====================================================

/**
 * GET /api/materials/user/saved
 * Get current user's saved/bookmarked materials
 * Query params: page, limit
 */
router.get('/user/saved', protectRoute, getUserSavedMaterials);

/**
 * GET /api/materials/user/uploaded
 * Get current user's uploaded materials
 * Query params: page, limit, status
 */
router.get('/user/uploaded', protectRoute, getUserUploadedMaterials);

export default router;