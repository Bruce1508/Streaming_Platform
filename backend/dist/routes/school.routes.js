"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const school_controllers_1 = require("../controllers/school.controllers");
// Middleware imports
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
// Validation imports
const common_validation_1 = require("../middleware/validation/common.validation");
const school_validation_1 = require("../middleware/validation/school.validation");
const router = (0, express_1.Router)();
// Rate limiters
const publicRateLimit = (0, rateLimiter_1.createRateLimit)(100, 15);
const adminRateLimit = (0, rateLimiter_1.createRateLimit)(20, 15);
// ===== PUBLIC ROUTES (No Auth Required) =====
/**
 * @route   GET /api/schools
 * @desc    Get all schools with filtering
 * @access  Public
 */
router.get('/', publicRateLimit, common_validation_1.validatePagination, common_validation_1.validateSearch, common_validation_1.validateSort, school_validation_1.validateSchoolQuery, school_controllers_1.getSchools);
/**
 * @route   GET /api/schools/provinces
 * @desc    Get available provinces list
 * @access  Public
 */
router.get('/provinces', publicRateLimit, school_controllers_1.getProvinces);
/**
 * @route   GET /api/schools/province/:province
 * @desc    Get schools by province
 * @access  Public
 */
router.get('/province/:province', publicRateLimit, school_validation_1.validateSchoolQuery, school_controllers_1.getSchoolsByProvince);
/**
 * @route   GET /api/schools/:identifier
 * @desc    Get single school by ID or code
 * @access  Public
 */
router.get('/:identifier', publicRateLimit, school_controllers_1.getSchoolById);
// ===== ADMIN ROUTES (Auth + Admin Role Required) =====
/**
 * @route   POST /api/schools/seed
 * @desc    Seed schools from schoolData.ts
 * @access  Admin only
 */
router.post('/seed', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), (0, rateLimiter_1.createRateLimit)(2, 60), school_controllers_1.seedSchools);
/**
 * @route   POST /api/schools
 * @desc    Create new school
 * @access  Admin only
 */
router.post('/', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), adminRateLimit, school_validation_1.validateSchoolCreate, school_controllers_1.createSchool);
/**
 * @route   PUT /api/schools/:id
 * @desc    Update school
 * @access  Admin only
 */
router.put('/:id', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), adminRateLimit, (0, common_validation_1.validateObjectId)('id'), school_validation_1.validateSchoolCreate, school_controllers_1.updateSchool);
/**
 * @route   DELETE /api/schools/:id
 * @desc    Soft delete school
 * @access  Admin only
 */
router.delete('/:id', auth_middleware_1.protectRoute, (0, auth_middleware_1.authorize)(['admin']), adminRateLimit, (0, common_validation_1.validateObjectId)('id'), school_controllers_1.deleteSchool);
exports.default = router;
//# sourceMappingURL=school.routes.js.map