// backend/src/routes/course.routes.ts
import express from 'express';
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    unenrollFromCourse,
    getCourseEnrollments,
    getCourseMaterials,
    getMyCourses,
    getCourseStats
} from '../controllers/course.controllers';

// Auth middleware
import {
    protectRoute,
    authorize,
    requireStudent,
    requireProfessor,
    requireAdmin,
    optionalAuth,
    authorizeOwnerOrAdmin
} from '../middleware/auth.middleware';

// Rate limiting
import { createRateLimit } from '../middleware/rateLimiter';

const router = express.Router();

// ===== RATE LIMITING SETUP =====
const generalLimit = createRateLimit(100, 15); // 100 requests per 15 minutes
const enrollmentLimit = createRateLimit(10, 15); // 10 enrollments per 15 minutes
const adminLimit = createRateLimit(50, 15); // 50 admin actions per 15 minutes

// ===== VALIDATION HELPERS =====
import mongoose from 'mongoose';

const validateCourseId = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            success: false,
            message: 'Invalid course ID format'
        });
        return;
    }
    next();
};

const validateQueryParams = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { page, limit, program, school, level, difficulty } = req.query;
    
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

    // Validate ObjectIds
    if (program && !mongoose.Types.ObjectId.isValid(program as string)) {
        res.status(400).json({
            success: false,
            message: 'Invalid program ID format'
        });
        return;
    }

    if (school && !mongoose.Types.ObjectId.isValid(school as string)) {
        res.status(400).json({
            success: false,
            message: 'Invalid school ID format'
        });
        return;
    }

    // Validate enums
    const validLevels = ['1', '2', '3', '4', 'graduate', 'undergraduate'];
    if (level && !validLevels.includes(level as string)) {
        res.status(400).json({
            success: false,
            message: `Level must be one of: ${validLevels.join(', ')}`
        });
        return;
    }

    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (difficulty && !validDifficulties.includes(difficulty as string)) {
        res.status(400).json({
            success: false,
            message: `Difficulty must be one of: ${validDifficulties.join(', ')}`
        });
        return;
    }

    next();
};

const validateCourse = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { code, name, description, credits, school, level, programs } = req.body;
    const errors: string[] = [];

    // Required fields validation
    if (!code || typeof code !== 'string' || !/^[A-Z]{3}[0-9]{3}$/.test(code)) {
        errors.push('Course code must follow format: 3 letters + 3 numbers (e.g., IPC144)');
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Course name is required');
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push('Course description is required');
    }

    if (!credits || typeof credits !== 'number' || credits < 0.5 || credits > 6) {
        errors.push('Credits must be between 0.5 and 6');
    }

    if (!school || !mongoose.Types.ObjectId.isValid(school)) {
        errors.push('Valid school ID is required');
    }

    if (!level || !['1', '2', '3', '4', 'graduate', 'undergraduate'].includes(level)) {
        errors.push('Valid level is required');
    }

    if (!programs || !Array.isArray(programs) || programs.length === 0) {
        errors.push('At least one program is required');
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
        return;
    }

    next();
};

const validateEnrollment = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { semester, year, term } = req.body;

    if (semester && (typeof semester !== 'number' || semester < 1 || semester > 8)) {
        res.status(400).json({
            success: false,
            message: 'Semester must be between 1 and 8'
        });
        return;
    }

    if (year && (typeof year !== 'number' || year < 2020 || year > new Date().getFullYear() + 1)) {
        res.status(400).json({
            success: false,
            message: 'Year must be valid'
        });
        return;
    }

    if (term && !['fall', 'winter', 'summer'].includes(term)) {
        res.status(400).json({
            success: false,
            message: 'Term must be fall, winter, or summer'
        });
        return;
    }

    next();
};

// =====================================================
// PUBLIC ROUTES - No Authentication Required
// =====================================================

/**
 * @route   GET /api/courses
 * @desc    Get all courses with filtering, searching, pagination
 * @access  Public (but can use optional auth for personalized results)
 * @query   search, program, school, level, difficulty, page, limit, sortBy, sortOrder
 * @example GET /api/courses?search=programming&program=60f0123456789abc12345678&page=1&limit=20
 */
router.get('/', 
    generalLimit,
    optionalAuth, // Optional auth for personalized data
    validateQueryParams,
    getCourses
);

/**
 * @route   GET /api/courses/searchAdvanced
 * @desc    Advanced search with multiple filters
 * @access  Public
 * @query   programs[], schools[], levels[], delivery[], difficulty, credits_min, credits_max, has_prerequisites
 * @example GET /api/courses/searchAdvanced?programs[]=60f0123456789abc12345678&schools[]=60f0123456789abc12345679&levels[]=2,3
 */
router.get('/searchAdvanced', 
    generalLimit,
    optionalAuth,
    validateQueryParams,
    getCourses // Reuse same controller with different route
);

/**
 * @route   GET /api/courses/byProgram/:programId
 * @desc    Get all courses for a specific program
 * @access  Public
 * @query   semester?, page?, limit?
 */
router.get('/byProgram/:programId',
    generalLimit,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.programId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid program ID format'
            });
            return;
        }
        next();
    },
    validateQueryParams,
    getCourses
);

/**
 * @route   GET /api/courses/bySchool/:schoolId
 * @desc    Get all courses for a specific school
 * @access  Public
 * @query   level?, difficulty?, page?, limit?
 */
router.get('/bySchool/:schoolId',
    generalLimit,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.schoolId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid school ID format'
            });
            return;
        }
        next();
    },
    validateQueryParams,
    getCourses
);

/**
 * @route   GET /api/courses/recommendations
 * @desc    Get course recommendations for current user
 * @access  Students only
 */
router.get('/recommendations',
    generalLimit,
    ...requireStudent,
    (req: express.Request, res: express.Response) => {
        // TODO: Implement course recommendations logic
        res.status(200).json({
            success: true,
            data: {
                recommendations: [],
                message: 'Course recommendations not implemented yet'
            }
        });
    }
);

/**
 * @route   GET /api/courses/myCourses
 * @desc    Get current user's enrolled courses
 * @access  Students only
 */
router.get('/myCourses', 
    generalLimit,
    ...requireStudent,
    getMyCourses
);

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course by ID with detailed information
 * @access  Public
 * @example GET /api/courses/670123456789abcdef012345
 */
router.get('/:id', 
    generalLimit,
    validateCourseId,
    getCourseById
);

/**
 * @route   GET /api/courses/:id/materials
 * @desc    Get materials for a specific course
 * @access  Public (public materials only)
 * @query   page, limit, category, week, sortBy, sortOrder
 * @example GET /api/courses/670123456789abcdef012345/materials?category=lecture-notes&week=1
 */
router.get('/:id/materials', 
    generalLimit,
    validateCourseId,
    validateQueryParams,
    getCourseMaterials
);

// =====================================================
// STUDENT ROUTES - Authentication Required
// =====================================================

/**
 * @route   POST /api/courses/:id/enroll
 * @desc    Enroll current user in a course
 * @access  Students only
 * @body    { semester?: number, year?: number, term?: string }
 */
router.post('/:id/enroll', 
    enrollmentLimit,
    validateCourseId,
    ...requireStudent,
    validateEnrollment,
    enrollInCourse
);

/**
 * @route   POST /api/courses/:id/unenroll
 * @desc    Unenroll current user from a course
 * @access  Students only
 */
router.post('/:id/unenroll', 
    enrollmentLimit,
    validateCourseId,
    ...requireStudent,
    unenrollFromCourse
);

// =====================================================
// PROFESSOR/ADMIN ROUTES
// =====================================================

/**
 * @route   GET /api/courses/:id/enrollments
 * @desc    Get all enrollments for a specific course
 * @access  Professors and Admins only
 * @query   page, limit, status
 * @example GET /api/courses/670123456789abcdef012345/enrollments?status=enrolled&page=1
 */
router.get('/:id/enrollments', 
    generalLimit,
    validateCourseId,
    ...requireProfessor,
    validateQueryParams,
    getCourseEnrollments
);

/**
 * @route   GET /api/courses/:id/stats
 * @desc    Get comprehensive statistics for a course
 * @access  Professors and Admins only
 */
router.get('/:id/stats', 
    generalLimit,
    validateCourseId,
    ...requireProfessor,
    getCourseStats
);

// =====================================================
// ADMIN ONLY ROUTES
// =====================================================

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Admin only
 * @body    { code, name, description, credits, school, level, programs, hours, prerequisites?, corequisites?, delivery?, difficulty?, tags?, learningOutcomes?, assessmentMethods?, textbooks?, professors? }
 */
router.post('/', 
    adminLimit,
    ...requireAdmin,
    validateCourse,
    createCourse
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update an existing course
 * @access  Admin only
 * @body    { name?, description?, credits?, hours?, prerequisites?, corequisites?, delivery?, difficulty?, tags?, learningOutcomes?, assessmentMethods?, textbooks?, professors? }
 */
router.put('/:id', 
    adminLimit,
    validateCourseId,
    ...requireAdmin,
    updateCourse
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course (soft delete)
 * @access  Admin only
 */
router.delete('/:id', 
    adminLimit,
    validateCourseId,
    ...requireAdmin,
    deleteCourse
);

// =====================================================
// UTILITY ROUTES
// =====================================================

/**
 * @route   GET /api/courses/:id/prerequisitesCheck
 * @desc    Check if current user meets course prerequisites
 * @access  Students only
 */
router.get('/:id/prerequisitesCheck',
    generalLimit,
    validateCourseId,
    ...requireStudent,
    (req: express.Request, res: express.Response) => {
        // TODO: Implement prerequisites check logic
        res.status(200).json({
            success: true,
            data: {
                meetsPrerequisites: true,
                missingPrerequisites: [],
                message: 'Prerequisites check not implemented yet'
            }
        });
    }
);

export default router;