import express from 'express';
import {
    bulkImportProgramCourses,
    getProgramCourses,
    getProgramCoursesByProgramId,
    searchCoursesAcrossPrograms,
    getProgramCoursesStats
} from '../controllers/course.controllers';

// Auth middleware
import {
    protectRoute,
    requireAdmin
} from '../middleware/auth.middleware';

// Rate limiting
import { createRateLimit } from '../middleware/rateLimiter';

const router = express.Router();

// ===== RATE LIMITING SETUP =====
const generalLimit = createRateLimit(100, 15); // 100 requests per 15 minutes
const adminLimit = createRateLimit(50, 15); // 50 admin actions per 15 minutes

// ===== VALIDATION HELPERS =====
const validateProgramId = (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

const validateQueryParams = (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

const validateBulkImport = (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    validateBulkImport,
    bulkImportProgramCourses
);

/**
 * @route   GET /api/courses/program-courses/stats
 * @desc    Get program courses statistics
 * @access  Public
 */
router.get('/program-courses/stats',
    generalLimit,
    getProgramCoursesStats
);

/**
 * @route   GET /api/courses/program-courses/search
 * @desc    Search courses across all programs
 * @access  Public
 * @query   courseCode, courseName, page, limit
 */
router.get('/program-courses/search',
    generalLimit,
    validateQueryParams,
    searchCoursesAcrossPrograms
);

/**
 * @route   GET /api/courses/program-courses
 * @desc    Get all program courses with filtering
 * @access  Public
 * @query   search, programId, page, limit, sortBy, sortOrder
 */
router.get('/program-courses',
    generalLimit,
    validateQueryParams,
    getProgramCourses
);

/**
 * @route   GET /api/courses/program-courses/:programId
 * @desc    Get program courses by program ID
 * @access  Public
 * @param   programId - Program ID (e.g., CPA, ESC, DAN)
 */
router.get('/program-courses/:programId',
    generalLimit,
    validateProgramId,
    getProgramCoursesByProgramId
);

export default router; 