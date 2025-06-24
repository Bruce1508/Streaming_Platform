import { Router } from 'express';
import {
    getPrograms,
    getProgramById,
    getProgramsBySchool,
    getProgramLevels,
    searchPrograms,
    createProgram,
    updateProgram,
    deleteProgram
} from '../controllers/program.controllers';

// Middleware imports
import { 
    protectRoute, 
    authorize
} from '../middleware/auth.middleware';
import { createRateLimit } from '../middleware/rateLimiter';

// Validation imports
import {
    validatePagination,
    validateSearch,
    validateSort,
    validateObjectId,
    handleValidationErrors
} from '../middleware/validation/common.validation';
import { validateProgramQuery, validateProgramCreate } from '../middleware/validation/program.validation';

const router = Router();

// Rate limiters
const publicRateLimit = createRateLimit(100, 15);
const adminRateLimit = createRateLimit(20, 15);

// ===== PUBLIC ROUTES (No Auth Required) =====

/**
 * @route   GET /api/programs
 * @desc    Get all programs with filtering
 * @access  Public
 */
router.get('/', publicRateLimit, validatePagination, validateSearch, validateSort, validateProgramQuery, getPrograms);

/**
 * @route   GET /api/programs/levels
 * @desc    Get available program levels
 * @access  Public
 */
router.get('/levels', publicRateLimit, getProgramLevels);

/**
 * @route   GET /api/programs/search
 * @desc    Search programs for autocomplete
 * @access  Public
 */
router.get('/search', publicRateLimit, validateSearch, searchPrograms);

/**
 * @route   GET /api/programs/school/:schoolId
 * @desc    Get programs by school
 * @access  Public
 */
router.get('/school/:schoolId', publicRateLimit, validateObjectId('schoolId'), validateProgramQuery, getProgramsBySchool);

/**
 * @route   GET /api/programs/:identifier
 * @desc    Get single program by ID or code
 * @access  Public
 */
router.get('/:identifier', publicRateLimit, getProgramById);

// ===== ADMIN ROUTES (Auth + Admin Role Required) =====

/**
 * @route   POST /api/programs
 * @desc    Create new program
 * @access  Admin only
 */
router.post('/', protectRoute, authorize(['admin']), adminRateLimit, validateProgramCreate, createProgram);

/**
 * @route   PUT /api/programs/:id
 * @desc    Update program
 * @access  Admin only
 */
router.put('/:id', protectRoute, authorize(['admin']), adminRateLimit, validateObjectId('id'), validateProgramCreate, updateProgram);

/**
 * @route   DELETE /api/programs/:id
 * @desc    Soft delete program
 * @access  Admin only
 */
router.delete('/:id', protectRoute, authorize(['admin']), adminRateLimit, validateObjectId('id'), deleteProgram);

export default router; 