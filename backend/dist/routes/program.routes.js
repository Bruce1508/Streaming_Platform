"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const program_controllers_1 = require("../controllers/program.controllers");
// Middleware imports
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
// Validation imports
const common_validation_1 = require("../middleware/validation/common.validation");
const program_validation_1 = require("../middleware/validation/program.validation");
const router = (0, express_1.Router)();
// Rate limiters
const publicRateLimit = (0, rateLimiter_1.createRateLimit)(100, 15);
const adminRateLimit = (0, rateLimiter_1.createRateLimit)(20, 15);
// ===== VALIDATION HELPERS =====
/**
 * Validation for Universal standardized bulk import
 */
const validateStandardizedBulkImport = (req, res, next) => {
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
    const allowedCredentials = ['bachelor', 'diploma', 'advanced diploma', 'certificate'];
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
router.get('/', publicRateLimit, common_validation_1.validatePagination, common_validation_1.validateSearch, common_validation_1.validateSort, program_validation_1.validateProgramQuery, program_controllers_1.getPrograms);
/**
 * @route   GET /api/programs/levels
 * @desc    Get available program levels
 * @access  Public
 */
router.get('/levels', publicRateLimit, program_controllers_1.getProgramLevels);
/**
 * @route   GET /api/programs/schools
 * @desc    Get available schools
 * @access  Public
 */
router.get('/schools', publicRateLimit, program_controllers_1.getProgramSchools);
/**
 * @route   GET /api/programs/credentials
 * @desc    Get available credentials
 * @access  Public
 */
router.get('/credentials', publicRateLimit, program_controllers_1.getProgramCredentials);
/**
 * @route   GET /api/programs/search
 * @desc    Search programs for autocomplete
 * @access  Public
 */
router.get('/search', publicRateLimit, common_validation_1.validateSearch, program_controllers_1.searchPrograms);
/**
 * @route   GET /api/programs/suggestions
 * @desc    Get program suggestions for autocomplete dropdown
 * @access  Public
 */
router.get('/suggestions', publicRateLimit, common_validation_1.validateSearch, program_controllers_1.getProgramSuggestions);
/**
 * @route   GET /api/programs/school/:schoolId
 * @desc    Get programs by school
 * @access  Public
 */
router.get('/school/:schoolId', publicRateLimit, (0, common_validation_1.validateObjectId)('schoolId'), program_validation_1.validateProgramQuery, program_controllers_1.getProgramsBySchool);
/**
 * @route   GET /api/programs/:identifier
 * @desc    Get single program by ID or code
 * @access  Public
 * @note    This route MUST be last among GET routes to avoid conflicts
 */
router.get('/:identifier', publicRateLimit, program_controllers_1.getProgramById);
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
validateStandardizedBulkImport, program_controllers_1.bulkImportStandardizedPrograms);
/**
 * @route   POST /api/programs
 * @desc    Create new program
 * @access  Admin only
 */
router.post('/', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), adminRateLimit, program_validation_1.validateProgramCreate, program_controllers_1.createProgram);
/**
 * @route   PUT /api/programs/:id
 * @desc    Update program
 * @access  Admin only
 */
router.put('/:id', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), adminRateLimit, (0, common_validation_1.validateObjectId)('id'), program_validation_1.validateProgramCreate, program_controllers_1.updateProgram);
/**
 * @route   DELETE /api/programs/:id
 * @desc    Soft delete program
 * @access  Admin only
 */
router.delete('/:id', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), adminRateLimit, (0, common_validation_1.validateObjectId)('id'), program_controllers_1.deleteProgram);
exports.default = router;
//# sourceMappingURL=program.routes.js.map