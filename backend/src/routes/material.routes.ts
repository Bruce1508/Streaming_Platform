// routes/material.routes.ts - ADD MISSING ROUTES
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
    removeRating,
    addComment,
    deleteComment,
    updateComment,
    reportMaterial,
    getMaterialStats,
    getUserSavedMaterials,
    getUserUploadedMaterials,
    getMaterialsByCourse,
    getFeaturedMaterials,
    getPopularMaterials,
    getMaterialsByProgram,
    searchMaterials       // ← NEW: Enhanced search endpoint
} from '../controllers/material.controllers';
import { protectRoute } from '../middleware/auth.middleware';
import { 
    validateObjectId,
    validateCreateMaterial,
    validateUpdateMaterial,
    validateRating,
    validateComment,
    validateQueryParams
} from '../middleware/material.middleware';

const router = Router();

// =====================================================
// PUBLIC ROUTES - No Authentication Required
// =====================================================

router.get('/', validateQueryParams, getStudyMaterials);
router.get('/search', validateQueryParams, searchMaterials);         // ← NEW: Enhanced search endpoint
router.get('/category/:category', validateQueryParams, getMaterialsByCategory);
router.get('/featured', getFeaturedMaterials);
router.get('/popular', getPopularMaterials);
router.get('/course/:courseId', validateObjectId('courseId'), getMaterialsByCourse);
router.get('/program/:programId', validateObjectId('programId'), getMaterialsByProgram);
router.get('/:id', validateObjectId('id'), getStudyMaterialById);
router.get('/:id/stats', validateObjectId('id'), getMaterialStats);

// =====================================================
// MATERIAL CRUD ROUTES - Authentication Required
// =====================================================

router.post('/', protectRoute, validateCreateMaterial, createStudyMaterial);
router.put('/:id', protectRoute, validateObjectId('id'), validateUpdateMaterial, updateStudyMaterial);
router.delete('/:id', protectRoute, validateObjectId('id'), deleteStudyMaterial);

// =====================================================
// MATERIAL INTERACTION ROUTES - Authentication Required
// =====================================================

router.post('/:id/save', protectRoute, validateObjectId('id'), saveMaterial);
router.delete('/:id/save', protectRoute, validateObjectId('id'), removeSavedMaterial);

// Rating routes
router.post('/:id/rate', protectRoute, validateObjectId('id'), validateRating, rateMaterial);
router.delete('/:id/rate', protectRoute, validateObjectId('id'), removeRating);     // ← ADDED

// Comment routes
router.post('/:id/comments', protectRoute, validateObjectId('id'), validateComment, addComment);
router.put('/:id/comments/:commentId', protectRoute, validateObjectId('id'), validateComment, updateComment);
router.delete('/:id/comments/:commentId', protectRoute, validateObjectId('id'), deleteComment);

// Report route
router.post('/:id/report', protectRoute, validateObjectId('id'), reportMaterial);  // ← ADDED

// =====================================================
// USER-SPECIFIC ROUTES - Authentication Required
// =====================================================

/**
 * GET /api/materials/userSaved
 * Get current user's saved/bookmarked materials
 */
router.get('/userSaved', protectRoute, validateQueryParams, getUserSavedMaterials);

/**
 * GET /api/materials/userUploaded
 * Get current user's uploaded materials
 */
router.get('/userUploaded', protectRoute, validateQueryParams, getUserUploadedMaterials);

export default router;