"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controllers_1 = require("../controllers/course.controllers");
// Rate limiting
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
// ===== RATE LIMITING SETUP =====
const generalLimit = (0, rateLimiter_1.createRateLimit)(100, 15); // 100 requests per 15 minutes
const adminLimit = (0, rateLimiter_1.createRateLimit)(50, 15); // 50 admin actions per 15 minutes
// ===== VALIDATION HELPERS =====
const validateProgramId = (req, res, next) => {
    const { programId } = req.params;
    if (!programId || typeof programId !== 'string' || programId.trim().length === 0) {
        res.status(400).json({
            success: false,
            message: 'Program ID is required'
        });
        return;
    }
    next();
};
const validateQueryParams = (req, res, next) => {
    const { page, limit } = req.query;
    // Validate pagination
    if (page && (isNaN(Number(page)) || Number(page) < 1)) {
        res.status(400).json({
            success: false,
            message: 'Page must be a positive number'
        });
        return;
    }
    if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        res.status(400).json({
            success: false,
            message: 'Limit must be between 1 and 100'
        });
        return;
    }
    next();
};
const validateBulkImport = (req, res, next) => {
    const { programCourses } = req.body;
    if (!programCourses || !Array.isArray(programCourses) || programCourses.length === 0) {
        res.status(400).json({
            success: false,
            message: 'programCourses array is required and cannot be empty'
        });
        return;
    }
    // Validate structure of each program
    for (let i = 0; i < programCourses.length; i++) {
        const program = programCourses[i];
        if (!program.programId || typeof program.programId !== 'string') {
            res.status(400).json({
                success: false,
                message: `programId is required for program at index ${i}`
            });
            return;
        }
        if (!program.programName || typeof program.programName !== 'string') {
            res.status(400).json({
                success: false,
                message: `programName is required for program at index ${i}`
            });
            return;
        }
        if (!program.semesters || !Array.isArray(program.semesters)) {
            res.status(400).json({
                success: false,
                message: `semesters array is required for program at index ${i}`
            });
            return;
        }
    }
    next();
};
// =====================================================
// PROGRAM COURSES ROUTES
// =====================================================
/**
 * @route   POST /api/courses/program-courses/bulk-import
 * @desc    Bulk import program courses from scraped data
 * @access  Admin only (temporarily disabled for import)
 * @body    { programCourses: IProgramCourses[] }
 */
router.post('/program-courses/bulk-import', 
// adminLimit,              // Temporarily disabled for import
// protectRoute,            // Temporarily disabled
// requireAdmin,            // Temporarily disabled
validateBulkImport, course_controllers_1.bulkImportProgramCourses);
/**
 * @route   GET /api/courses/program-courses/stats
 * @desc    Get program courses statistics
 * @access  Public
 */
router.get('/program-courses/stats', generalLimit, course_controllers_1.getProgramCoursesStats);
/**
 * @route   GET /api/courses/program-courses/search
 * @desc    Search courses across all programs
 * @access  Public
 * @query   courseCode, courseName, page, limit
 */
router.get('/program-courses/search', generalLimit, validateQueryParams, course_controllers_1.searchCoursesAcrossPrograms);
/**
 * @route   GET /api/courses/program-courses
 * @desc    Get all program courses with filtering
 * @access  Public
 * @query   search, programId, page, limit, sortBy, sortOrder
 */
router.get('/program-courses', generalLimit, validateQueryParams, course_controllers_1.getProgramCourses);
/**
 * @route   GET /api/courses/program-courses/:programId
 * @desc    Get program courses by program ID
 * @access  Public
 * @param   programId - Program ID (e.g., CPA, ESC, DAN)
 */
router.get('/program-courses/:programId', generalLimit, validateProgramId, course_controllers_1.getProgramCoursesByProgramId);
exports.default = router;
//# sourceMappingURL=course.routes.js.map