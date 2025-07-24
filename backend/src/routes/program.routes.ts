import { Router } from 'express';
import {
    getPrograms,
    getProgramById,
    getProgramsBySchool,
    getProgramLevels,
    getProgramSchools,
    getProgramCredentials,
    searchPrograms,
    getProgramSuggestions,
    createProgram,
    updateProgram,
    deleteProgram,
    bulkImportStandardizedPrograms
} from '../controllers/program.controllers';

// Middleware imports
import { 
    protectRoute, 
    authorize
} from '../middleWare/auth.middleware';
import { createRateLimit } from '../middleWare/rateLimiter';

// Validation imports
import {
    validatePagination,
    validateSearch,
    validateSort,
    validateObjectId,
} from '../middleWare/validation/common.validation';
import { validateProgramQuery, validateProgramCreate } from '../middleWare/validation/program.validation';

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
 * @route   GET /api/programs/schools
 * @desc    Get available schools
 * @access  Public
 */
router.get('/schools', publicRateLimit, getProgramSchools);

/**
 * @route   GET /api/programs/credentials
 * @desc    Get available credentials
 * @access  Public
 */
router.get('/credentials', publicRateLimit, getProgramCredentials);

/**
 * @route   GET /api/programs/search
 * @desc    Search programs for autocomplete
 * @access  Public
 */
router.get('/search', publicRateLimit, validateSearch, searchPrograms);

/**
 * @route   GET /api/programs/suggestions
 * @desc    Get program suggestions for autocomplete dropdown
 * @access  Public
 */
router.get('/suggestions', publicRateLimit, validateSearch, getProgramSuggestions);

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
 * @note    This route MUST be last among GET routes to avoid conflicts
 */
router.get('/:identifier', publicRateLimit, getProgramById);

// ===== ADMIN ROUTES (Auth + Admin Role Required) =====

/**
 * @route   POST /api/programs/bulk-import
 * @desc    Universal bulk import for standardized programs from all schools
 * @access  Admin only (temporarily disabled for import)
 */
router.post('/bulk-import',
    // adminRateLimit,              // Temporarily disabled for import
    // protectRoute,                // Temporarily disabled
    // authorize(['admin']),        // Temporarily disabled
    // validateStandardizedBulkImport,
    bulkImportStandardizedPrograms
);



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