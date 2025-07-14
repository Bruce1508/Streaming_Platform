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
exports.bulkImportStandardizedPrograms = exports.deleteProgram = exports.updateProgram = exports.createProgram = exports.getProgramSuggestions = exports.searchPrograms = exports.getProgramCredentials = exports.getProgramSchools = exports.getProgramLevels = exports.getProgramById = exports.getProgramsBySchool = exports.getPrograms = void 0;
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
    const { search, school, level, credential, isActive = true, sortBy = 'name', sortOrder = 'asc' } = req.query;
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
        // School is stored as string (school name), so filter by exact match or regex
        if (mongoose_1.default.Types.ObjectId.isValid(school)) {
            filter.school = school;
        }
        else {
            // Filter by school name (case-insensitive)
            filter.school = { $regex: school, $options: 'i' };
        }
    }
    if (level)
        filter.level = level;
    if (credential)
        filter.credential = { $regex: credential, $options: 'i' };
    try {
        // Execute query without school population since school is a string
        const [programs, total] = yield Promise.all([
            Program_1.Program.find(filter)
                // .populate('school', 'name code type province') // Removed - school is string
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
            filters: { search, school, level, credential, isActive }
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
            // .populate('school', 'name code') // Removed - school is string
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
    const { identifier } = req.params;
    try {
        logger_utils_1.logger.info('=== Program API Call ===', {
            identifier,
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url
        });
        let program;
        // Check if identifier is ObjectId, programId, or code
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            // It's an ObjectId
            logger_utils_1.logger.info('Searching by ObjectId:', identifier);
            program = yield Program_1.Program.findById(identifier).lean();
        }
        else if (identifier.includes('-') || identifier.includes('_')) {
            // It's likely a programId (e.g., SENECA-DAN, GEORGE_BROWN-242576)
            logger_utils_1.logger.info('Searching by programId:', identifier);
            program = yield Program_1.Program.findOne({ programId: identifier }).lean();
        }
        else {
            // It's a code
            logger_utils_1.logger.info('Searching by code:', identifier.toUpperCase());
            program = yield Program_1.Program.findOne({ code: identifier.toUpperCase() }).lean();
        }
        if (!program) {
            logger_utils_1.logger.warn('Program not found:', identifier);
            throw new ApiError_1.ApiError(404, 'Program not found');
        }
        // Type assertion for accessing potentially dynamic fields
        const programData = program;
        logger_utils_1.logger.info('Program found:', {
            _id: programData._id,
            code: programData.code,
            name: programData.name,
            hasSemesters: !!programData.semesters,
            semestersCount: programData.semesters ? programData.semesters.length : 0
        });
        // Ensure semesters data is properly formatted if it exists
        if (programData.semesters && Array.isArray(programData.semesters)) {
            // Sort semesters by name/id if needed
            programData.semesters = programData.semesters.sort((a, b) => {
                const nameA = a.name || a.id || '';
                const nameB = b.name || b.id || '';
                return nameA.localeCompare(nameB);
            });
            logger_utils_1.logger.info('Semesters processed:', {
                count: programData.semesters.length,
                semesters: programData.semesters.map((s) => ({
                    id: s.id,
                    name: s.name,
                    coursesCount: s.courses ? s.courses.length : 0
                }))
            });
        }
        const response = new ApiResponse_1.ApiResponse(200, programData, 'Program retrieved successfully');
        logger_utils_1.logger.info('=== API Response Success ===', {
            identifier,
            success: true,
            dataKeys: Object.keys(programData)
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('=== API Error ===', {
            identifier,
            error: error.message,
            stack: error.stack,
            isApiError: error instanceof ApiError_1.ApiError
        });
        if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        throw new ApiError_1.ApiError(500, 'Failed to retrieve program details');
    }
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
 * @desc    Get available schools
 * @route   GET /api/programs/schools
 * @access  Public
 */
exports.getProgramSchools = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const cacheKey = 'program_schools_list';
    const cached = yield (0, Cache_utils_1.getCachedPrograms)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    try {
        const schools = yield Program_1.Program.distinct('school', { isActive: true });
        // Sort schools alphabetically
        const sortedSchools = schools.sort();
        const response = new ApiResponse_1.ApiResponse(200, { schools: sortedSchools }, 'Program schools retrieved successfully');
        // ✅ Cache for 1 hour
        yield (0, Cache_utils_1.cachePrograms)(cacheKey, response, 3600);
        logger_utils_1.logger.info('Program schools retrieved', {
            count: sortedSchools.length
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error retrieving program schools:', error);
        throw new ApiError_1.ApiError(500, 'Failed to retrieve program schools');
    }
}));
/**
 * @desc    Get available credentials
 * @route   GET /api/programs/credentials
 * @access  Public
 */
exports.getProgramCredentials = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const cacheKey = 'program_credentials_list';
    const cached = yield (0, Cache_utils_1.getCachedPrograms)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    try {
        const credentials = yield Program_1.Program.distinct('credential', { isActive: true, credential: { $ne: null, $ne: '' } });
        // Sort credentials alphabetically
        const sortedCredentials = credentials.sort();
        const response = new ApiResponse_1.ApiResponse(200, { credentials: sortedCredentials }, 'Program credentials retrieved successfully');
        // ✅ Cache for 1 hour
        yield (0, Cache_utils_1.cachePrograms)(cacheKey, response, 3600);
        logger_utils_1.logger.info('Program credentials retrieved', {
            count: sortedCredentials.length
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error retrieving program credentials:', error);
        throw new ApiError_1.ApiError(500, 'Failed to retrieve program credentials');
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
            // .populate('school', 'name code') // Removed - school is string
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
/**
 * @desc    Get program suggestions for autocomplete
 * @route   GET /api/programs/suggestions
 * @access  Public
 */
exports.getProgramSuggestions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { q, limit = 5 } = req.query;
    if (!q || q.length < 2) {
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, { suggestions: [] }, 'Query too short'));
    }
    // ✅ Try cache first
    const cacheKey = (0, Cache_utils_1.generateCacheKey)('program_suggestions', q, limit);
    const cached = yield (0, Cache_utils_1.getCachedPrograms)(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }
    const filter = {
        isActive: true,
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { code: { $regex: q, $options: 'i' } }
        ]
    };
    try {
        const programs = yield Program_1.Program.find(filter)
            .select('programId name code school level')
            .sort({ name: 1 })
            .limit(parseInt(limit))
            .lean();
        const suggestions = programs.map(program => ({
            id: program.programId,
            name: program.name,
            code: program.code,
            school: program.school,
            level: program.level
        }));
        const response = new ApiResponse_1.ApiResponse(200, { suggestions }, 'Program suggestions retrieved');
        // ✅ Cache for 5 minutes
        yield (0, Cache_utils_1.cachePrograms)(cacheKey, response, 300);
        logger_utils_1.logger.info('Program suggestions retrieved', {
            query: q,
            results: suggestions.length
        });
        res.status(200).json(response);
    }
    catch (error) {
        logger_utils_1.logger.error('Error getting program suggestions:', error);
        throw new ApiError_1.ApiError(500, 'Failed to get program suggestions');
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
    const program = yield Program_1.Program.findByIdAndUpdate(id, Object.assign(Object.assign({}, updates), { updatedAt: new Date() }), { new: true, runValidators: true });
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
// ===== UNIVERSAL IMPORT CONTROLLER =====
/**
 * @desc    Universal bulk import for standardized programs
 * @route   POST /api/programs/bulk-import
 * @access  Admin
 */
exports.bulkImportStandardizedPrograms = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { school, programs } = req.body;
    if (!school || !programs || !Array.isArray(programs)) {
        throw new ApiError_1.ApiError(400, 'School and programs array are required');
    }
    logger_utils_1.logger.info(`Starting bulk import for ${school}`, { count: programs.length });
    const results = {
        successCount: 0,
        errorCount: 0,
        errors: []
    };
    for (const programData of programs) {
        try {
            // Validate required fields
            if (!programData.id || !programData.code || !programData.name || !programData.credential) {
                throw new Error('Missing required fields: id, code, name, credential');
            }
            // Check if program already exists
            const existingProgram = yield Program_1.Program.findOne({
                $or: [
                    { id: programData.id },
                    { code: programData.code }
                ]
            });
            const programDoc = {
                id: programData.id,
                code: programData.code,
                name: programData.name,
                duration: programData.duration || '',
                campus: Array.isArray(programData.campus) ? programData.campus : [],
                credential: programData.credential,
                // Set legacy fields for backward compatibility
                programId: programData.id,
                school: school === 'seneca' ? 'Seneca College' :
                    school === 'centennial' ? 'Centennial College' :
                        school === 'york' ? 'York University' :
                            school === 'georgebrown' ? 'George Brown College' :
                                school === 'humber' ? 'Humber College' :
                                    school === 'tmu' ? 'Toronto Metropolitan University' :
                                        'Unknown School',
                level: mapStandardCredentialToLevel(programData.credential),
                isActive: true,
                stats: {
                    enrollmentCount: 0,
                    graduationRate: undefined,
                    employmentRate: undefined
                }
            };
            if (existingProgram) {
                // Update existing program
                yield Program_1.Program.findByIdAndUpdate(existingProgram._id, programDoc, {
                    new: true,
                    runValidators: true
                });
                logger_utils_1.logger.debug(`Updated program: ${programData.name}`);
            }
            else {
                // Create new program
                yield Program_1.Program.create(programDoc);
                logger_utils_1.logger.debug(`Created program: ${programData.name}`);
            }
            results.successCount++;
        }
        catch (error) {
            results.errorCount++;
            results.errors.push({
                program: programData.name || 'Unknown',
                error: error.message
            });
            logger_utils_1.logger.error(`Error processing program ${programData.name}:`, error.message);
        }
    }
    logger_utils_1.logger.info(`Bulk import completed for ${school}`, {
        successCount: results.successCount,
        errorCount: results.errorCount
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, results, `Bulk import completed for ${school}. ${results.successCount} successful, ${results.errorCount} errors.`));
}));
// Helper function to map standardized credentials to legacy levels
function mapStandardCredentialToLevel(credential) {
    switch (credential.toLowerCase()) {
        case 'bachelor':
            return 'Bachelor';
        case 'diploma':
            return 'Diploma';
        case 'advanced diploma':
            return 'Advanced Diploma';
        case 'certificate':
        default:
            return 'Certificate';
    }
}
//# sourceMappingURL=program.controllers.js.map