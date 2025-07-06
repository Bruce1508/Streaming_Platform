"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchool = exports.updateSchool = exports.createSchool = exports.seedSchools = exports.getProvinces = exports.getSchoolsByProvince = exports.getSchoolById = exports.getSchools = void 0;
const School_1 = require("../models/School");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const Api_utils_1 = require("../utils/Api.utils");
const Cache_utils_1 = require("../utils/Cache.utils");
const logger_utils_1 = require("../utils/logger.utils");
const schoolData_1 = require("../lib/schoolData");
// ===== SCHOOL CONTROLLERS =====
/**
 * @desc    Get all schools with filtering support for onBoarding
 * @route   GET /api/schools
 * @access  Public
 */
exports.getSchools = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { search, province, type, isActive = true, sortBy = 'name', sortOrder = 'asc' } = req.query;
    // ✅ Use pagination utils
    const { page, limit, skip } = (0, Api_utils_1.extractPagination)(req);
    // ✅ Use sort utils
    const sortOptions = (0, Api_utils_1.extractSortOptions)(req, { [sortBy]: sortOrder === 'asc' ? 1 : -1 });
    // ✅ Generate cache key
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('schools_list', JSON.stringify(req.query));
    const cached = yield (0, Cache_utils_1.getCachedSchools)(cacheKey);
    if (cached) {
        logger_utils_1.logger.info('Schools retrieved from cache');
        return res.status(200).json(cached);
    }
    // Build filter object
    const filter = {};
    if (isActive !== undefined)
        filter.isActive = isActive;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    if (province)
        filter.province = province;
    if (type)
        filter.type = type;
    try {
        // Execute query
        const [schools, total] = yield Promise.all([
            School_1.School.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            School_1.School.countDocuments(filter)
        ]);
        // ✅ Create paginated response
        const response = (0, Api_utils_1.createPaginatedResponse)(schools, total, page, limit, 'Schools retrieved successfully');
        // ✅ Cache the response (5 minutes)
        yield (0, Cache_utils_1.cacheSchools)(cacheKey, response, 300);
        logger_utils_1.logger.info('Schools retrieved successfully', {
            total,
            page,
            limit,
            filters: { search, province, type, isActive }
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error retrieving schools:', error);
        throw new ApiError_1.ApiError(500, 'Failed to retrieve schools');
    }
}));
/**
 * @desc    Get single school by ID or code
 * @route   GET /api/schools/:identifier
 * @access  Public
 */
exports.getSchoolById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { identifier } = req.params;
    // ✅ Try cache first
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('school_detail', identifier);
    const cached = yield (0, Cache_utils_1.getCachedSchools)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    let school;
    // Check if identifier is ObjectId or code
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        // It's an ObjectId
        school = yield School_1.School.findById(identifier)
            .populate('programs', 'name code level totalCredits')
            .lean();
    }
    else {
        // It's a code
        school = yield School_1.School.findOne({ code: identifier.toUpperCase() })
            .populate('programs', 'name code level totalCredits')
            .lean();
    }
    if (!school) {
        throw new ApiError_1.ApiError(404, 'School not found');
    }
    const response = new ApiResponse_1.ApiResponse(200, school, 'School retrieved successfully');
    // ✅ Cache the school (10 minutes)
    yield (0, Cache_utils_1.cacheSchools)(cacheKey, response, 600);
    logger_utils_1.logger.info('School retrieved by identifier', {
        identifier,
        schoolName: school.name
    });
    res.status(200).json(response);
}));
/**
 * @desc    Get schools by province (for onBoarding dropdown)
 * @route   GET /api/schools/province/:province
 * @access  Public
 */
exports.getSchoolsByProvince = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { province } = req.params;
    const { type, limit = 50 } = req.query;
    // ✅ Try cache first
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('schools_by_province', province, type);
    const cached = yield (0, Cache_utils_1.getCachedSchools)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    const filter = {
        province: province,
        isActive: true
    };
    if (type)
        filter.type = type;
    try {
        const schools = yield School_1.School.find(filter)
            .select('name code type website established')
            .sort({ name: 1 })
            .limit(parseInt(limit))
            .lean();
        const response = new ApiResponse_1.ApiResponse(200, {
            schools,
            province,
            total: schools.length
        }, `Schools in ${province} retrieved successfully`);
        // ✅ Cache the response (15 minutes)
        yield (0, Cache_utils_1.cacheSchools)(cacheKey, response, 900);
        logger_utils_1.logger.info('Schools retrieved by province', {
            province,
            type,
            count: schools.length
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error retrieving schools by province:', error);
        throw new ApiError_1.ApiError(500, 'Failed to retrieve schools by province');
    }
}));
/**
 * @desc    Get available provinces list
 * @route   GET /api/schools/provinces
 * @access  Public
 */
exports.getProvinces = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const cacheKey = 'schools_provinces_list';
    const cached = yield (0, Cache_utils_1.getCachedSchools)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    try {
        const provinces = yield School_1.School.distinct('province', { isActive: true });
        // Sort provinces alphabetically
        provinces.sort();
        const response = new ApiResponse_1.ApiResponse(200, { provinces }, 'Provinces retrieved successfully');
        // ✅ Cache for 1 hour
        yield (0, Cache_utils_1.cacheSchools)(cacheKey, response, 3600);
        logger_utils_1.logger.info('Provinces list retrieved', {
            count: provinces.length
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error retrieving provinces:', error);
        throw new ApiError_1.ApiError(500, 'Failed to retrieve provinces');
    }
}));
/**
 * @desc    Seed schools from schoolData.ts (Admin only)
 * @route   POST /api/schools/seed
 * @access  Admin
 */
exports.seedSchools = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    try {
        // Clear existing schools (optional - can be made safer)
        const existingCount = yield School_1.School.countDocuments();
        if (existingCount > 0) {
            throw new ApiError_1.ApiError(400, 'Schools already exist. Use force=true to override');
        }
        // Insert schools from schoolData
        const schoolsToInsert = schoolData_1.canadianSchools.map(school => ({
            name: school.name,
            code: school.code,
            type: school.type,
            province: school.province,
            website: school.website,
            established: school.established,
            isActive: school.isActive,
            description: `${school.type} located in ${school.location || school.province}`,
            color: '#3B82F6' // Default color
        }));
        const insertedSchools = yield School_1.School.insertMany(schoolsToInsert);
        logger_utils_1.logger.info('Schools seeded successfully', {
            count: insertedSchools.length
        });
        res.status(201).json(new ApiResponse_1.ApiResponse(201, {
            inserted: insertedSchools.length,
            schools: insertedSchools.slice(0, 5) // Return first 5 as sample
        }, 'Schools seeded successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('Error seeding schools:', error);
        throw new ApiError_1.ApiError(500, 'Failed to seed schools');
    }
}));
// ===== ADMIN CONTROLLERS (Future) =====
/**
 * @desc    Create new school (Admin only)
 * @route   POST /api/schools
 * @access  Admin
 */
exports.createSchool = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { name, code, type, province, website, description } = req.body;
    // Check if school with same code exists
    const existingSchool = yield School_1.School.findOne({ code: code.toUpperCase() });
    if (existingSchool) {
        throw new ApiError_1.ApiError(400, 'School with this code already exists');
    }
    const school = new School_1.School({
        name,
        code: code.toUpperCase(),
        type,
        province,
        website,
        description,
        isActive: true
    });
    const savedSchool = yield school.save();
    logger_utils_1.logger.info('New school created', {
        schoolId: savedSchool._id,
        code: savedSchool.code,
        name: savedSchool.name
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, savedSchool, 'School created successfully'));
}));
/**
 * @desc    Update school (Admin only)
 * @route   PUT /api/schools/:id
 * @access  Admin
 */
exports.updateSchool = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { id } = req.params;
    const updates = req.body;
    const school = yield School_1.School.findByIdAndUpdate(id, Object.assign(Object.assign({}, updates), { updatedAt: new Date() }), { new: true, runValidators: true });
    if (!school) {
        throw new ApiError_1.ApiError(404, 'School not found');
    }
    logger_utils_1.logger.info('School updated', {
        schoolId: school._id,
        code: school.code
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, school, 'School updated successfully'));
}));
/**
 * @desc    Delete school (Admin only)
 * @route   DELETE /api/schools/:id
 * @access  Admin
 */
exports.deleteSchool = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { id } = req.params;
    const school = yield School_1.School.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!school) {
        throw new ApiError_1.ApiError(404, 'School not found');
    }
    logger_utils_1.logger.info('School soft deleted', {
        schoolId: school._id,
        code: school.code
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, school, 'School deleted successfully'));
}));
//# sourceMappingURL=school.controllers.js.map