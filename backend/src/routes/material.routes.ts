import { Router } from 'express';
import {
    getStudyMaterials,
    getStudyMaterialById,
    getMaterialsByCategory,
    createStudyMaterial,
    updateStudyMaterial,
    deleteStudyMaterial,
    saveMaterial,
    removeSavedMaterial,
    rateMaterial,
    addComment,
    getUserSavedMaterials,
    getUserUploadedMaterials
} from '../controllers/material.controllers';
import { protectRoute } from '../middleWare/auth.middleware';
import { 
    validateObjectId,
    validateCreateMaterial,
    validateUpdateMaterial,
    validateRating,
    validateComment,
    validateQueryParams
} from '../middleWare/material.middleware';

const router = Router();

// =====================================================
// PUBLIC ROUTES - No Authentication Required
// =====================================================

/**
 * GET /api/materials
 * Get all study materials with filtering, search, pagination
 */
router.get('/', validateQueryParams, getStudyMaterials);

/**
 * GET /api/materials/category/:category
 * Get study materials by specific category
 */
router.get('/category/:category', validateQueryParams, getMaterialsByCategory);

/**
 * GET /api/materials/:id
 * Get single study material by ID
 */
router.get('/:id', validateObjectId('id'), getStudyMaterialById);

// =====================================================
// MATERIAL CRUD ROUTES - Authentication Required
// =====================================================

/**
 * POST /api/materials
 * Create new study material
 */
router.post('/', protectRoute, validateCreateMaterial, createStudyMaterial);

/**
 * PUT /api/materials/:id
 * Update existing study material (author only)
 */
router.put('/:id', protectRoute, validateObjectId('id'), validateUpdateMaterial, updateStudyMaterial);

/**
 * DELETE /api/materials/:id
 * Delete study material (author only)
 */
router.delete('/:id', protectRoute, validateObjectId('id'), deleteStudyMaterial);

// =====================================================
// MATERIAL INTERACTION ROUTES - Authentication Required
// =====================================================

/**
 * POST /api/materials/:id/save
 * Save/bookmark a study material
 */
router.post('/:id/save', protectRoute, validateObjectId('id'), saveMaterial);

/**
 * DELETE /api/materials/:id/save
 * Remove bookmark from study material
 */
router.delete('/:id/save', protectRoute, validateObjectId('id'), removeSavedMaterial);

/**
 * POST /api/materials/:id/rate
 * Rate a study material (1-5 stars)
 */
router.post('/:id/rate', protectRoute, validateObjectId('id'), validateRating, rateMaterial);

/**
 * POST /api/materials/:id/comments
 * Add comment to study material
 */
router.post('/:id/comments', protectRoute, validateObjectId('id'), validateComment, addComment);

// =====================================================
// USER-SPECIFIC ROUTES - Authentication Required
// =====================================================

/**
 * GET /api/materials/user/saved
 * Get current user's saved/bookmarked materials
 */
router.get('/user/saved', protectRoute, validateQueryParams, getUserSavedMaterials);

/**
 * GET /api/materials/user/uploaded
 * Get current user's uploaded materials
 */
router.get('/user/uploaded', protectRoute, validateQueryParams, getUserUploadedMaterials);

export default router;