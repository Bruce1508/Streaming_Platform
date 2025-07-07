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
    bulkImportPrograms,
    bulkImportCentennialPrograms,
    bulkImportGeorgeBrownPrograms,
    bulkImportHumberPrograms,
    bulkImportTMUPrograms,
    bulkImportYorkPrograms,
    bulkImportSenecaPrograms
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

/**
 * Validation for Centennial College bulk import
 */
const validateCentennialBulkImport = (req: any, res: any, next: any) => {
    const { programs } = req.body;

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Centennial programs array is required and cannot be empty'
        });
    }

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        
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
    }

    next();
};

/**
 * Validation for George Brown College bulk import
 */
const validateGeorgeBrownBulkImport = (req: any, res: any, next: any) => {
    const { programs } = req.body;

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'George Brown programs array is required and cannot be empty'
        });
    }

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        
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
    }

    next();
};

/**
 * Validation for Humber College bulk import
 */
const validateHumberBulkImport = (req: any, res: any, next: any) => {
    const { programs } = req.body;

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Humber programs array is required and cannot be empty'
        });
    }

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        
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
    }

    next();
};

/**
 * Validation for TMU bulk import
 */
const validateTMUBulkImport = (req: any, res: any, next: any) => {
    const { programs } = req.body;

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'TMU programs array is required and cannot be empty'
        });
    }

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        
        if (!program.name || typeof program.name !== 'string') {
            return res.status(400).json({
                success: false,
                message: `Program name is required for program at index ${i}`
            });
        }
    }

    next();
};

/**
 * Validation for York University bulk import
 */
const validateYorkBulkImport = (req: any, res: any, next: any) => {
    const { programs } = req.body;

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'York programs array is required and cannot be empty'
        });
    }

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        
        if (!program.name || typeof program.name !== 'string') {
            return res.status(400).json({
                success: false,
                message: `Program name is required for program at index ${i}`
            });
        }
    }

    next();
};

/**
 * Validation for Seneca College bulk import
 */
const validateSenecaBulkImport = (req: any, res: any, next: any) => {
    const { programs } = req.body;

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Seneca programs array is required and cannot be empty'
        });
    }

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        
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
 * @route   POST /api/programs/bulk-import/centennial
 * @desc    Bulk import Centennial College programs
 * @access  Admin only (temporarily disabled for import)
 */
router.post('/bulk-import/centennial',
    // adminRateLimit,              // Temporarily disabled for import
    // protectRoute,                // Temporarily disabled
    // authorize(['admin']),        // Temporarily disabled
    validateCentennialBulkImport,
    bulkImportCentennialPrograms
);

/**
 * @route   POST /api/programs/bulk-import/george-brown
 * @desc    Bulk import George Brown College programs
 * @access  Admin only (temporarily disabled for import)
 */
router.post('/bulk-import/george-brown',
    // adminRateLimit,              // Temporarily disabled for import
    // protectRoute,                // Temporarily disabled
    // authorize(['admin']),        // Temporarily disabled
    validateGeorgeBrownBulkImport,
    bulkImportGeorgeBrownPrograms
);

/**
 * @route   POST /api/programs/bulk-import/humber
 * @desc    Bulk import Humber College programs
 * @access  Admin only (temporarily disabled for import)
 */
router.post('/bulk-import/humber',
    // adminRateLimit,              // Temporarily disabled for import
    // protectRoute,                // Temporarily disabled
    // authorize(['admin']),        // Temporarily disabled
    validateHumberBulkImport,
    bulkImportHumberPrograms
);

/**
 * @route   POST /api/programs/bulk-import/tmu
 * @desc    Bulk import TMU programs
 * @access  Admin only (temporarily disabled for import)
 */
router.post('/bulk-import/tmu',
    // adminRateLimit,              // Temporarily disabled for import
    // protectRoute,                // Temporarily disabled
    // authorize(['admin']),        // Temporarily disabled
    validateTMUBulkImport,
    bulkImportTMUPrograms
);

/**
 * @route   POST /api/programs/bulk-import/york
 * @desc    Bulk import York University programs
 * @access  Admin only (temporarily disabled for import)
 */
router.post('/bulk-import/york',
    // adminRateLimit,              // Temporarily disabled for import
    // protectRoute,                // Temporarily disabled
    // authorize(['admin']),        // Temporarily disabled
    validateYorkBulkImport,
    bulkImportYorkPrograms
);

/**
 * @route   POST /api/programs/bulk-import/seneca
 * @desc    Bulk import Seneca College programs
 * @access  Admin only (temporarily disabled for import)
 */
router.post('/bulk-import/seneca',
    // adminRateLimit,              // Temporarily disabled for import
    // protectRoute,                // Temporarily disabled
    // authorize(['admin']),        // Temporarily disabled
    validateSenecaBulkImport,
    bulkImportSenecaPrograms
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