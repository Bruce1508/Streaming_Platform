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

// ===== VALIDATION HELPERS =====

/**
 * Validation for Universal standardized bulk import
 */
const validateStandardizedBulkImport = (req: any, res: any, next: any) => {
    const { school, programs } = req.body;

    if (!school || typeof school !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'School is required and must be a string'
        });
    }

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Programs array is required and cannot be empty'
        });
    }

    const allowedCredentials = ['bachelor', 'diploma', 'advanced diploma', 'certificate', 'other'];

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        
        if (!program.id || typeof program.id !== 'string') {
            return res.status(400).json({
                success: false,
                message: `Program id is required for program at index ${i}`
            });
        }

        if (!program.code || typeof program.code !== 'string') {
            return res.status(400).json({
                success: false,
                message: `Program code is required for program at index ${i}`
            });
        }

        if (!program.name || typeof program.name !== 'string') {
            return res.status(400).json({
                success: false,
                message: `Program name is required for program at index ${i}`
            });
        }

        if (!program.credential || !allowedCredentials.includes(program.credential)) {
            return res.status(400).json({
                success: false,
                message: `Program credential must be one of: ${allowedCredentials.join(', ')} for program at index ${i}`
            });
        }

        if (program.campus && !Array.isArray(program.campus)) {
            return res.status(400).json({
                success: false,
                message: `Program campus must be an array for program at index ${i}`
            });
        }
    }

    next();
};

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
    validateStandardizedBulkImport,
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