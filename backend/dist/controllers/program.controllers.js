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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkImportPrograms = exports.deleteProgram = exports.updateProgram = exports.createProgram = exports.searchPrograms = exports.getProgramLevels = exports.getProgramById = exports.getProgramsBySchool = exports.getPrograms = void 0;
const Program_1 = require("../models/Program");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const Api_utils_1 = require("../utils/Api.utils");
const Cache_utils_1 = require("../utils/Cache.utils");
const logger_utils_1 = require("../utils/logger.utils");
const mongoose_1 = __importDefault(require("mongoose"));
// ===== PROGRAM CONTROLLERS =====
/**
 * @desc    Get all programs with filtering support for onBoarding
 * @route   GET /api/programs
 * @access  Public
 */
exports.getPrograms = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { search, school, level, isActive = true, sortBy = 'name', sortOrder = 'asc' } = req.query;
    // ✅ Use pagination utils
    const { page, limit, skip } = (0, Api_utils_1.extractPagination)(req);
    // ✅ Use sort utils
    const sortOptions = (0, Api_utils_1.extractSortOptions)(req, { [sortBy]: sortOrder === 'asc' ? 1 : -1 });
    // ✅ Generate cache key
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('programs_list', JSON.stringify(req.query));
    const cached = yield (0, Cache_utils_1.getCachedPrograms)(cacheKey);
    if (cached) {
        logger_utils_1.logger.info('Programs retrieved from cache');
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
    if (school) {
        // Support both ObjectId and school code
        if (mongoose_1.default.Types.ObjectId.isValid(school)) {
            filter.school = school;
        }
        else {
            // Need to lookup school by code first - will implement populate alternative
            filter['school.code'] = school.toUpperCase();
        }
    }
    if (level)
        filter.level = level;
    try {
        // Execute query with school population
        const [programs, total] = yield Promise.all([
            Program_1.Program.find(filter)
                .populate('school', 'name code type province')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            Program_1.Program.countDocuments(filter)
        ]);
        // ✅ Create paginated response
        const response = (0, Api_utils_1.createPaginatedResponse)(programs, total, page, limit, 'Programs retrieved successfully');
        // ✅ Cache the response (5 minutes)
        yield (0, Cache_utils_1.cachePrograms)(cacheKey, response, 300);
        logger_utils_1.logger.info('Programs retrieved successfully', {
            total,
            page,
            limit,
            filters: { search, school, level, isActive }
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error retrieving programs:', error);
        throw new ApiError_1.ApiError(500, 'Failed to retrieve programs');
    }
}));
/**
 * @desc    Get programs by school (for onBoarding dropdown)
 * @route   GET /api/programs/school/:schoolId
 * @access  Public
 */
exports.getProgramsBySchool = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { schoolId } = req.params;
    const { level, limit = 50 } = req.query;
    // Validate schoolId
    if (!mongoose_1.default.Types.ObjectId.isValid(schoolId)) {
        throw new ApiError_1.ApiError(400, 'Invalid school ID');
    }
    // ✅ Try cache first
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('programs_by_school', schoolId, level);
    const cached = yield (0, Cache_utils_1.getCachedPrograms)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    const filter = {
        school: schoolId,
        isActive: true
    };
    if (level)
        filter.level = level;
    try {
        const programs = yield Program_1.Program.find(filter)
            .select('name code level duration totalCredits description')
            .populate('school', 'name code')
            .sort({ name: 1 })
            .limit(parseInt(limit))
            .lean();
        const response = new ApiResponse_1.ApiResponse(200, {
            programs,
            school: ((_a = programs[0]) === null || _a === void 0 ? void 0 : _a.school) || null,
            total: programs.length
        }, 'Programs retrieved successfully');
        // ✅ Cache the response (10 minutes)
        yield (0, Cache_utils_1.cachePrograms)(cacheKey, response, 600);
        logger_utils_1.logger.info('Programs retrieved by school', {
            schoolId,
            level,
            count: programs.length
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error retrieving programs by school:', error);
        throw new ApiError_1.ApiError(500, 'Failed to retrieve programs by school');
    }
}));
/**
 * @desc    Get single program by ID or code
 * @route   GET /api/programs/:identifier
 * @access  Public
 */
exports.getProgramById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { identifier } = req.params;
    // ✅ Try cache first
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('program_detail', identifier);
    const cached = yield (0, Cache_utils_1.getCachedPrograms)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    let program;
    // Check if identifier is ObjectId or code
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        // It's an ObjectId
        program = yield Program_1.Program.findById(identifier)
            .populate('school', 'name code type province website')
            .populate('courses', 'name code credits level')
            .lean();
    }
    else {
        // It's a code
        program = yield Program_1.Program.findOne({ code: identifier.toUpperCase() })
            .populate('school', 'name code type province website')
            .populate('courses', 'name code credits level')
            .lean();
    }
    if (!program) {
        throw new ApiError_1.ApiError(404, 'Program not found');
    }
    const response = new ApiResponse_1.ApiResponse(200, program, 'Program retrieved successfully');
    // ✅ Cache the program (10 minutes)
    yield (0, Cache_utils_1.cachePrograms)(cacheKey, response, 600);
    logger_utils_1.logger.info('Program retrieved by identifier', {
        identifier,
        programName: program.name
    });
    res.status(200).json(response);
}));
/**
 * @desc    Get available program levels
 * @route   GET /api/programs/levels
 * @access  Public
 */
exports.getProgramLevels = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const cacheKey = 'program_levels_list';
    const cached = yield (0, Cache_utils_1.getCachedPrograms)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    try {
        const levels = yield Program_1.Program.distinct('level', { isActive: true });
        // Sort levels by educational hierarchy
        const levelOrder = ['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Graduate Certificate'];
        const sortedLevels = levels.sort((a, b) => {
            const indexA = levelOrder.indexOf(a);
            const indexB = levelOrder.indexOf(b);
            return indexA - indexB;
        });
        const response = new ApiResponse_1.ApiResponse(200, { levels: sortedLevels }, 'Program levels retrieved successfully');
        // ✅ Cache for 1 hour
        yield (0, Cache_utils_1.cachePrograms)(cacheKey, response, 3600);
        logger_utils_1.logger.info('Program levels retrieved', {
            count: sortedLevels.length
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error retrieving program levels:', error);
        throw new ApiError_1.ApiError(500, 'Failed to retrieve program levels');
    }
}));
/**
 * @desc    Search programs for onBoarding autocomplete
 * @route   GET /api/programs/search
 * @access  Public
 */
exports.searchPrograms = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { q, school, level, limit = 10 } = req.query;
    if (!q || q.length < 2) {
        throw new ApiError_1.ApiError(400, 'Search query must be at least 2 characters');
    }
    // ✅ Try cache first
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('program_search', q, school, level);
    const cached = yield (0, Cache_utils_1.getCachedPrograms)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    const filter = {
        isActive: true,
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { code: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ]
    };
    if (school && mongoose_1.default.Types.ObjectId.isValid(school)) {
        filter.school = school;
    }
    if (level)
        filter.level = level;
    try {
        const programs = yield Program_1.Program.find(filter)
            .select('name code level school')
            .populate('school', 'name code')
            .sort({ name: 1 })
            .limit(parseInt(limit))
            .lean();
        const response = new ApiResponse_1.ApiResponse(200, {
            programs,
            query: q,
            total: programs.length
        }, 'Program search completed');
        // ✅ Cache for 5 minutes
        yield (0, Cache_utils_1.cachePrograms)(cacheKey, response, 300);
        logger_utils_1.logger.info('Program search completed', {
            query: q,
            school,
            level,
            results: programs.length
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error searching programs:', error);
        throw new ApiError_1.ApiError(500, 'Failed to search programs');
    }
}));
// ===== ADMIN CONTROLLERS (Future) =====
/**
 * @desc    Create new program (Admin only)
 * @route   POST /api/programs
 * @access  Admin
 */
exports.createProgram = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { name, code, school, level, duration, totalCredits, description } = req.body;
    // Validate school exists
    if (!mongoose_1.default.Types.ObjectId.isValid(school)) {
        throw new ApiError_1.ApiError(400, 'Invalid school ID');
    }
    // Check if program with same code exists
    const existingProgram = yield Program_1.Program.findOne({ code: code.toUpperCase() });
    if (existingProgram) {
        throw new ApiError_1.ApiError(400, 'Program with this code already exists');
    }
    const program = new Program_1.Program({
        name,
        code: code.toUpperCase(),
        school,
        level,
        duration,
        totalCredits,
        description,
        isActive: true
    });
    const savedProgram = yield program.save();
    yield savedProgram.populate('school', 'name code');
    logger_utils_1.logger.info('New program created', {
        programId: savedProgram._id,
        code: savedProgram.code,
        name: savedProgram.name,
        school: savedProgram.school
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, savedProgram, 'Program created successfully'));
}));
/**
 * @desc    Update program (Admin only)
 * @route   PUT /api/programs/:id
 * @access  Admin
 */
exports.updateProgram = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { id } = req.params;
    const updates = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.ApiError(400, 'Invalid program ID');
    }
    const program = yield Program_1.Program.findByIdAndUpdate(id, Object.assign(Object.assign({}, updates), { updatedAt: new Date() }), { new: true, runValidators: true }).populate('school', 'name code');
    if (!program) {
        throw new ApiError_1.ApiError(404, 'Program not found');
    }
    logger_utils_1.logger.info('Program updated', {
        programId: program._id,
        code: program.code
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, program, 'Program updated successfully'));
}));
/**
 * @desc    Delete program (Admin only)
 * @route   DELETE /api/programs/:id
 * @access  Admin
 */
exports.deleteProgram = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.ApiError(400, 'Invalid program ID');
    }
    const program = yield Program_1.Program.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!program) {
        throw new ApiError_1.ApiError(404, 'Program not found');
    }
    logger_utils_1.logger.info('Program soft deleted', {
        programId: program._id,
        code: program.code
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, program, 'Program deleted successfully'));
}));
// ===== BULK IMPORT HELPERS =====
/**
 * Function to map credential to level
 */
function mapCredentialToLevel(credential) {
    const credentialLower = credential.toLowerCase();
    if (credentialLower.includes('certificate') && credentialLower.includes('graduate')) {
        return 'Graduate Certificate';
    }
    if (credentialLower.includes('honours bachelor')) {
        return 'Honours Bachelor Degree';
    }
    if (credentialLower.includes('bachelor')) {
        return 'Bachelor';
    }
    if (credentialLower.includes('advanced diploma')) {
        return 'Advanced Diploma';
    }
    if (credentialLower.includes('diploma')) {
        return 'Diploma';
    }
    if (credentialLower.includes('certificate')) {
        return 'Certificate';
    }
    if (credentialLower.includes('seneca certificate')) {
        return 'Seneca Certificate of Standing';
    }
    if (credentialLower.includes('apprenticeship')) {
        return 'Certificate of Apprenticeship, Ontario College Certificate';
    }
    // Default fallback
    return 'Certificate';
}
/**
 * Function to transform raw program data
 */
function transformProgram(rawProgram) {
    return {
        programId: rawProgram.id.toLowerCase(),
        code: rawProgram.code.toUpperCase(),
        name: rawProgram.name,
        overview: rawProgram.overview,
        duration: rawProgram.duration,
        campus: rawProgram.campus || [],
        delivery: rawProgram.delivery === 'program delivery options' ? undefined : rawProgram.delivery,
        credential: rawProgram.credential,
        school: rawProgram.school,
        level: mapCredentialToLevel(rawProgram.credential),
        isActive: true,
        stats: {
            enrollmentCount: 0,
            graduationRate: undefined,
            employmentRate: undefined
        }
    };
}
/**
 * @desc    Bulk import programs from scraped data
 * @route   POST /api/programs/bulk-import
 * @access  Admin only
 */
exports.bulkImportPrograms = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Api_utils_1.logApiRequest)(req);
    const { programs } = req.body;
    if (!Array.isArray(programs) || programs.length === 0) {
        throw new ApiError_1.ApiError(400, 'Programs array is required');
    }
    logger_utils_1.logger.info(`Starting bulk import of ${programs.length} programs`);
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    // Transform programs first
    const transformedPrograms = programs.map(transformProgram);
    for (const programData of transformedPrograms) {
        try {
            yield Program_1.Program.findOneAndUpdate({
                $or: [
                    { programId: programData.programId },
                    { code: programData.code }
                ]
            }, programData, {
                upsert: true,
                new: true,
                runValidators: true
            });
            successCount++;
        }
        catch (error) {
            errorCount++;
            errors.push(`${programData.programId} (${programData.code}): ${error.message}`);
            logger_utils_1.logger.error(`Error importing program ${programData.programId}:`, error);
        }
    }
    logger_utils_1.logger.info(`Bulk import completed: ${successCount} successful, ${errorCount} failed`);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        successCount,
        errorCount,
        errors: errors.slice(0, 10), // Only return first 10 errors
        totalProcessed: programs.length
    }, `Bulk import completed: ${successCount} successful, ${errorCount} failed`));
}));
//# sourceMappingURL=program.controllers.js.map