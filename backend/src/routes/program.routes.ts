import { Router } from 'express';
import {
    getPrograms,
    getProgramById,
    getProgramsBySchool,
    getProgramLevels,
    searchPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    bulkImportPrograms
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
 * Validation for bulk import programs
 */
const validateBulkImportPrograms = (req: any, res: any, next: any) => {
    const { programs } = req.body;

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Programs array is required and cannot be empty'
        });
    }

    // Validate structure of each program
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

        if (!program.credential || typeof program.credential !== 'string') {
            return res.status(400).json({
                success: false,
                message: `Program credential is required for program at index ${i}`
            });
        }

        if (!program.school || typeof program.school !== 'string') {
            return res.status(400).json({
                success: false,
                message: `Program school is required for program at index ${i}`
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
 * @route   POST /api/programs/bulk-import
 * @desc    Bulk import programs from scraped data
 * @access  Admin only (temporarily disabled for import)
 */
router.post('/bulk-import',
    // adminRateLimit,              // Temporarily disabled for import
    // protectRoute,                // Temporarily disabled
    // authorize(['admin']),        // Temporarily disabled
    validateBulkImportPrograms,
    bulkImportPrograms
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