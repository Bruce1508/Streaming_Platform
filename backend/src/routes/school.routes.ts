import { Router } from 'express';
import {
    getSchools,
    getSchoolById,
    getSchoolsByProvince,
    getProvinces,
    seedSchools,
    createSchool,
    updateSchool,
    deleteSchool
} from '../controllers/school.controllers';

// Middleware imports
import { 
    protectRoute, 
    authorize,
    requireAdmin 
} from '../middleWare/auth.middleware';
import { createRateLimit } from '../middleWare/rateLimiter';

// Validation imports
import {
    validatePagination,
    validateSearch,
    validateSort,
    validateObjectId,
} from '../middleWare/validation/common.validation';
import { validateSchoolQuery, validateSchoolCreate } from '../middleWare/validation/school.validation';

const router = Router();

// Rate limiters
const publicRateLimit = createRateLimit(100, 15);
const adminRateLimit = createRateLimit(20, 15);

// ===== PUBLIC ROUTES (No Auth Required) =====

/**
 * @route   GET /api/schools
 * @desc    Get all schools with filtering
 * @access  Public
 */
router.get('/', publicRateLimit, validatePagination, validateSearch, validateSort, validateSchoolQuery, getSchools);

/**
 * @route   GET /api/schools/provinces
 * @desc    Get available provinces list
 * @access  Public
 */
router.get('/provinces', publicRateLimit, getProvinces);

/**
 * @route   GET /api/schools/province/:province
 * @desc    Get schools by province
 * @access  Public
 */
router.get('/province/:province', publicRateLimit, validateSchoolQuery, getSchoolsByProvince);

/**
 * @route   GET /api/schools/:identifier
 * @desc    Get single school by ID or code
 * @access  Public
 */
router.get('/:identifier', publicRateLimit, getSchoolById);

// ===== ADMIN ROUTES (Auth + Admin Role Required) =====

/**
 * @route   POST /api/schools/seed
 * @desc    Seed schools from schoolData.ts
 * @access  Admin only
 */
router.post('/seed', protectRoute, authorize(['admin']), createRateLimit(2, 60), seedSchools);

/**
 * @route   POST /api/schools
 * @desc    Create new school
 * @access  Admin only
 */
router.post('/', protectRoute, authorize(['admin']), adminRateLimit, validateSchoolCreate, createSchool);

/**
 * @route   PUT /api/schools/:id
 * @desc    Update school
 * @access  Admin only
 */
router.put('/:id', protectRoute, authorize(['admin']), adminRateLimit, validateObjectId('id'), validateSchoolCreate, updateSchool);

/**
 * @route   DELETE /api/schools/:id
 * @desc    Soft delete school
 * @access  Admin only
 */
router.delete('/:id', protectRoute, authorize(['admin']), adminRateLimit, validateObjectId('id'), deleteSchool);

export default router; 