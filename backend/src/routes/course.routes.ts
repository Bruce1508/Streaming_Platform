// // routes/course.routes.ts
// import express from 'express';
// import {
//     getCourses,
//     getCourseById,
//     createCourse,
//     updateCourse,
//     deleteCourse,
//     enrollInCourse,
//     unenrollFromCourse,
//     getCourseEnrollments,
//     getCourseMaterials,
//     getMyCourses,
//     getCourseStats
// } from '../controllers/course.controllers';

// // Auth middleware
// import {
//     protectRoute,
//     authorize,
//     requireStudent,
//     requireProfessor,
//     requireAdmin,
//     optionalAuth,
//     authorizeOwnerOrAdmin
// } from '../middleWare/auth.middleware';

// // Validation middleware
// import {
//     validateCourse,
//     validateEnrollment,
//     validateCourseId,
//     validateQueryParams
// } from '../utils/validation';

// // Rate limiting
// import { createRateLimit } from '../middleWare/rateLimiter';

// const router = express.Router();

// // ===== RATE LIMITING SETUP =====
// const generalLimit = createRateLimit(100, 15); // 100 requests per 15 minutes
// const enrollmentLimit = createRateLimit(10, 15); // 10 enrollments per 15 minutes
// const adminLimit = createRateLimit(50, 15); // 50 admin actions per 15 minutes

// // ===== PUBLIC ROUTES =====

// /**
//  * @route   GET /api/courses
//  * @desc    Get all courses with filtering, searching, pagination
//  * @access  Public (but can use optional auth for personalized results)
//  * @example GET /api/courses?search=programming&program=Computer Science&page=1&limit=20
//  */
// router.get('/', 
//     generalLimit,
//     optionalAuth, // Optional auth để có thể show personalized data
//     validateQueryParams,
//     getCourses
// );

// /**
//  * @route   GET /api/courses/:id
//  * @desc    Get single course by ID with detailed information
//  * @access  Public
//  * @example GET /api/courses/670123456789abcdef012345
//  */
// router.get('/:id', 
//     generalLimit,
//     validateCourseId,
//     getCourseById
// );

// /**
//  * @route   GET /api/courses/:id/materials
//  * @desc    Get materials for a specific course
//  * @access  Public (public materials only)
//  * @example GET /api/courses/670123456789abcdef012345/materials?category=lecture&week=1
//  */
// router.get('/:id/materials', 
//     generalLimit,
//     validateCourseId,
//     getCourseMaterials
// );

// // ===== STUDENT ROUTES =====

// /**
//  * @route   GET /api/courses/my/courses
//  * @desc    Get current user's enrolled courses
//  * @access  Students only
//  */
// router.get('/my/courses', 
//     generalLimit,
//     ...requireStudent,
//     getMyCourses
// );

// /**
//  * @route   POST /api/courses/:id/enroll
//  * @desc    Enroll current user in a course
//  * @access  Students only
//  * @body    { semester?: number, year?: number, term?: string }
//  */
// router.post('/:id/enroll', 
//     enrollmentLimit,
//     validateCourseId,
//     ...requireStudent,
//     validateEnrollment,
//     enrollInCourse
// );

// /**
//  * @route   POST /api/courses/:id/unenroll
//  * @desc    Unenroll current user from a course
//  * @access  Students only
//  */
// router.post('/:id/unenroll', 
//     enrollmentLimit,
//     validateCourseId,
//     ...requireStudent,
//     unenrollFromCourse
// );

// // ===== PROFESSOR/ADMIN ROUTES =====

// /**
//  * @route   GET /api/courses/:id/enrollments
//  * @desc    Get all enrollments for a specific course
//  * @access  Professors and Admins only
//  * @example GET /api/courses/670123456789abcdef012345/enrollments?status=enrolled&page=1
//  */
// router.get('/:id/enrollments', 
//     generalLimit,
//     validateCourseId,
//     ...requireProfessor,
//     getCourseEnrollments
// );

// /**
//  * @route   GET /api/courses/:id/stats
//  * @desc    Get comprehensive statistics for a course
//  * @access  Professors and Admins only
//  */
// router.get('/:id/stats', 
//     generalLimit,
//     validateCourseId,
//     ...requireProfessor,
//     getCourseStats
// );

// // ===== ADMIN ONLY ROUTES =====

// /**
//  * @route   POST /api/courses
//  * @desc    Create a new course
//  * @access  Admin only
//  * @body    { code, name, description, credits, school, level, programs, ... }
//  */
// router.post('/', 
//     adminLimit,
//     ...requireAdmin,
//     validateCourse,
//     createCourse
// );

// /**
//  * @route   PUT /api/courses/:id
//  * @desc    Update an existing course
//  * @access  Admin only
//  * @body    { name?, description?, credits?, ... }
//  */
// router.put('/:id', 
//     adminLimit,
//     validateCourseId,
//     ...requireAdmin,
//     validateCourse,
//     updateCourse
// );

// /**
//  * @route   DELETE /api/courses/:id
//  * @desc    Delete a course (soft delete)
//  * @access  Admin only
//  */
// router.delete('/:id', 
//     adminLimit,
//     validateCourseId,
//     ...requireAdmin,
//     deleteCourse
// );

// // ===== ADVANCED ROUTES =====

// /**
//  * @route   GET /api/courses/search/advanced
//  * @desc    Advanced search with multiple filters
//  * @access  Public
//  * @example GET /api/courses/search/advanced?programs[]=CS&schools[]=Engineering&levels[]=2,3
//  */
// router.get('/search/advanced', 
//     generalLimit,
//     optionalAuth,
//     validateQueryParams,
//     getCourses // Reuse same controller with different route
// );

// /**
//  * @route   GET /api/courses/recommendations/:userId?
//  * @desc    Get course recommendations (for current user or specified user)
//  * @access  Students (own recommendations) / Admin (any user)
//  */
// router.get('/recommendations/:userId?', 
//     generalLimit,
//     protectRoute,
//     authorizeOwnerOrAdmin(req => req.params.userId || req.user?._id.toString() || ''),
//     // getCourseRecommendations // TODO: Implement this controller
// );

// /**
//  * @route   POST /api/courses/:id/favorite
//  * @desc    Add course to user's favorites
//  * @access  Students only
//  */
// router.post('/:id/favorite', 
//     generalLimit,
//     validateCourseId,
//     ...requireStudent,
//     // addToFavorites // TODO: Implement this controller
// );

// /**
//  * @route   DELETE /api/courses/:id/favorite
//  * @desc    Remove course from user's favorites
//  * @access  Students only
//  */
// router.delete('/:id/favorite', 
//     generalLimit,
//     validateCourseId,
//     ...requireStudent,
//     // removeFromFavorites // TODO: Implement this controller
// );

// /**
//  * @route   GET /api/courses/:id/prerequisites-check/:userId?
//  * @desc    Check if user meets course prerequisites
//  * @access  Students (own check) / Professor/Admin (any user)
//  */
// router.get('/:id/prerequisites-check/:userId?', 
//     generalLimit,
//     validateCourseId,
//     protectRoute,
//     authorizeOwnerOrAdmin(req => req.params.userId || req.user?._id.toString() || ''),
//     // checkPrerequisites // TODO: Implement this controller
// );

// // ===== BULK OPERATIONS (Admin only) =====

// /**
//  * @route   POST /api/courses/bulk/create
//  * @desc    Create multiple courses at once
//  * @access  Admin only
//  * @body    { courses: [{ code, name, ... }, ...] }
//  */
// router.post('/bulk/create', 
//     adminLimit,
//     ...requireAdmin,
//     // validateBulkCourses, // TODO: Create this validation
//     // bulkCreateCourses // TODO: Implement this controller
// );

// /**
//  * @route   PUT /api/courses/bulk/update
//  * @desc    Update multiple courses at once
//  * @access  Admin only
//  * @body    { updates: [{ id, data }, ...] }
//  */
// router.put('/bulk/update', 
//     adminLimit,
//     ...requireAdmin,
//     // validateBulkUpdates, // TODO: Create this validation
//     // bulkUpdateCourses // TODO: Implement this controller
// );

// /**
//  * @route   POST /api/courses/bulk/enroll
//  * @desc    Bulk enroll students in courses
//  * @access  Admin only
//  * @body    { enrollments: [{ studentId, courseId, semester, year, term }, ...] }
//  */
// router.post('/bulk/enroll', 
//     adminLimit,
//     ...requireAdmin,
//     // validateBulkEnrollments, // TODO: Create this validation
//     // bulkEnrollStudents // TODO: Implement this controller
// );

// // ===== EXPORT/IMPORT ROUTES (Admin only) =====

// /**
//  * @route   GET /api/courses/export/csv
//  * @desc    Export all courses to CSV
//  * @access  Admin only
//  */
// router.get('/export/csv', 
//     adminLimit,
//     ...requireAdmin,
//     // exportCoursesToCSV // TODO: Implement this controller
// );

// /**
//  * @route   POST /api/courses/import/csv
//  * @desc    Import courses from CSV
//  * @access  Admin only
//  */
// router.post('/import/csv', 
//     adminLimit,
//     ...requireAdmin,
//     // uploadCSV middleware, // TODO: Create file upload middleware
//     // importCoursesFromCSV // TODO: Implement this controller
// );

// export default router;