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
exports.getProgramCoursesStats = exports.searchCoursesAcrossPrograms = exports.getProgramCoursesByProgramId = exports.getProgramCourses = exports.bulkImportProgramCourses = void 0;
const ProgramCourses_1 = require("../models/ProgramCourses");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const Api_utils_1 = require("../utils/Api.utils");
// ===== PROGRAM COURSES CONTROLLERS =====
/**
 * @desc    Bulk import program courses from scraped data
 * @route   POST /api/courses/program-courses/bulk-import
 * @access  Admin only
 */
exports.bulkImportProgramCourses = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Api_utils_1.logApiRequest)(req);
    const { programCourses } = req.body;
    if (!Array.isArray(programCourses) || programCourses.length === 0) {
        throw new ApiError_1.ApiError(400, 'Program courses array is required');
    }
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    for (const programData of programCourses) {
        try {
            yield ProgramCourses_1.ProgramCourses.findOneAndUpdate({ programId: programData.programId }, programData, {
                upsert: true,
                new: true,
                runValidators: true
            });
            successCount++;
        }
        catch (error) {
            errorCount++;
            errors.push(`${programData.programId}: ${error.message}`);
        }
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        successCount,
        errorCount,
        errors: errors.slice(0, 10),
        totalProcessed: programCourses.length
    }, `Bulk import completed: ${successCount} successful, ${errorCount} failed`));
}));
/**
 * @desc    Get all program courses with filtering
 * @route   GET /api/courses/program-courses
 * @access  Public
 */
exports.getProgramCourses = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Api_utils_1.logApiRequest)(req);
    const { search, programId, hasWorkIntegratedLearning, sortBy = 'programId', sortOrder = 'asc' } = req.query;
    const { page, limit, skip } = (0, Api_utils_1.extractPagination)(req);
    // Build filter
    const filter = {};
    if (search) {
        filter.$or = [
            { programId: { $regex: search, $options: 'i' } },
            { programName: { $regex: search, $options: 'i' } }
        ];
    }
    if (programId) {
        filter.programId = programId.toString().toUpperCase();
    }
    if (hasWorkIntegratedLearning !== undefined) {
        filter.hasWorkIntegratedLearning = hasWorkIntegratedLearning === 'true';
    }
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    const [programCourses, total] = yield Promise.all([
        ProgramCourses_1.ProgramCourses.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        ProgramCourses_1.ProgramCourses.countDocuments(filter)
    ]);
    const response = (0, Api_utils_1.createPaginatedResponse)(programCourses, total, page, limit, 'Program courses retrieved successfully');
    res.status(200).json(response);
}));
/**
 * @desc    Get program courses by program ID
 * @route   GET /api/courses/program-courses/:programId
 * @access  Public
 */
exports.getProgramCoursesByProgramId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Api_utils_1.logApiRequest)(req);
    const { programId } = req.params;
    if (!programId) {
        throw new ApiError_1.ApiError(400, 'Program ID is required');
    }
    const programCourses = yield ProgramCourses_1.ProgramCourses.findOne({
        programId: programId.toUpperCase()
    }).lean();
    if (!programCourses) {
        throw new ApiError_1.ApiError(404, `Program courses not found for program: ${programId}`);
    }
    // Calculate statistics with new schema
    const totalCoreCourses = programCourses.semesters.reduce((total, sem) => total + sem.coreCourses.length, 0);
    const totalRequirements = programCourses.semesters.reduce((total, sem) => total + sem.requirements.reduce((reqTotal, req) => reqTotal + req.selectCount, 0), 0);
    // Count Work-Integrated Learning semesters
    const workIntegratedSemesters = programCourses.semesters.filter(sem => sem.type === 'work_integrated_learning' || sem.type === 'coop');
    // Separate regular and work-integrated semesters
    const regularSemesters = programCourses.semesters.filter(sem => sem.type === 'regular');
    const stats = {
        totalSemesters: programCourses.semesters.length,
        regularSemesters: regularSemesters.length,
        workIntegratedSemesters: workIntegratedSemesters.length,
        totalCoreCourses,
        totalRequirements,
        totalCourses: totalCoreCourses + totalRequirements,
        hasWorkIntegratedLearning: programCourses.hasWorkIntegratedLearning,
        coursesPerSemester: programCourses.semesters.map(sem => ({
            semester: sem.name,
            type: sem.type,
            coreCourses: sem.coreCourses.length,
            requirements: sem.requirements.reduce((reqTotal, req) => reqTotal + req.selectCount, 0),
            totalCourses: sem.coreCourses.length + sem.requirements.reduce((reqTotal, req) => reqTotal + req.selectCount, 0),
            isOptional: sem.isOptional || false
        }))
    };
    const responseData = Object.assign(Object.assign({}, programCourses), { stats });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, responseData, 'Program courses retrieved successfully'));
}));
/**
 * @desc    Search courses across all programs
 * @route   GET /api/courses/program-courses/search
 * @access  Public
 */
exports.searchCoursesAcrossPrograms = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, Api_utils_1.logApiRequest)(req);
    const { courseCode, courseName } = req.query;
    if (!courseCode && !courseName) {
        throw new ApiError_1.ApiError(400, 'Either courseCode or courseName is required');
    }
    const { page, limit, skip } = (0, Api_utils_1.extractPagination)(req);
    // Build match conditions for coreCourses
    const matchConditions = {};
    if (courseCode) {
        matchConditions['semesters.coreCourses.code'] = {
            $regex: courseCode.toString(),
            $options: 'i'
        };
    }
    if (courseName) {
        matchConditions['semesters.coreCourses.name'] = {
            $regex: courseName.toString(),
            $options: 'i'
        };
    }
    // Updated aggregation pipeline for new schema
    const results = yield ProgramCourses_1.ProgramCourses.aggregate([
        { $match: matchConditions },
        { $unwind: '$semesters' },
        { $unwind: '$semesters.coreCourses' },
        {
            $match: Object.assign(Object.assign({}, (courseCode && { 'semesters.coreCourses.code': { $regex: courseCode.toString(), $options: 'i' } })), (courseName && { 'semesters.coreCourses.name': { $regex: courseName.toString(), $options: 'i' } }))
        },
        {
            $group: {
                _id: '$semesters.coreCourses.code',
                course: { $first: '$semesters.coreCourses' },
                programs: {
                    $push: {
                        programId: '$programId',
                        programName: '$programName',
                        semester: '$semesters.name',
                        semesterType: '$semesters.type'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                courseCode: '$_id',
                courseName: '$course.name',
                programs: 1
            }
        },
        { $sort: { courseCode: 1 } },
        { $skip: skip },
        { $limit: limit }
    ]);
    // Get total count (simplified)
    const totalResults = yield ProgramCourses_1.ProgramCourses.aggregate([
        { $match: matchConditions },
        { $unwind: '$semesters' },
        { $unwind: '$semesters.coreCourses' },
        {
            $match: Object.assign(Object.assign({}, (courseCode && { 'semesters.coreCourses.code': { $regex: courseCode.toString(), $options: 'i' } })), (courseName && { 'semesters.coreCourses.name': { $regex: courseName.toString(), $options: 'i' } }))
        },
        {
            $group: {
                _id: '$semesters.coreCourses.code'
            }
        },
        { $count: 'total' }
    ]);
    const total = ((_a = totalResults[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    const response = (0, Api_utils_1.createPaginatedResponse)(results, total, page, limit, 'Course search completed successfully');
    res.status(200).json(response);
}));
/**
 * @desc    Get program courses statistics
 * @route   GET /api/courses/program-courses/stats
 * @access  Public
 */
exports.getProgramCoursesStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    (0, Api_utils_1.logApiRequest)(req);
    // Get basic stats with Work-Integrated Learning info
    const basicStats = yield ProgramCourses_1.ProgramCourses.aggregate([
        {
            $group: {
                _id: null,
                totalPrograms: { $sum: 1 },
                totalSemesters: {
                    $sum: {
                        $cond: [
                            { $isArray: '$semesters' },
                            { $size: '$semesters' },
                            0
                        ]
                    }
                },
                workIntegratedPrograms: {
                    $sum: { $cond: [{ $eq: ['$hasWorkIntegratedLearning', true] }, 1, 0] }
                }
            }
        }
    ]);
    // Get course counts with new schema
    const courseStats = yield ProgramCourses_1.ProgramCourses.aggregate([
        { $match: { semesters: { $exists: true, $type: 'array' } } },
        { $unwind: '$semesters' },
        {
            $group: {
                _id: null,
                totalCoreCourses: {
                    $sum: {
                        $cond: [
                            { $isArray: '$semesters.coreCourses' },
                            { $size: '$semesters.coreCourses' },
                            0
                        ]
                    }
                },
                totalRequirements: {
                    $sum: {
                        $cond: [
                            { $isArray: '$semesters.requirements' },
                            {
                                $reduce: {
                                    input: '$semesters.requirements',
                                    initialValue: 0,
                                    in: { $add: ['$$value', '$$this.selectCount'] }
                                }
                            },
                            0
                        ]
                    }
                },
                regularSemesters: {
                    $sum: { $cond: [{ $eq: ['$semesters.type', 'regular'] }, 1, 0] }
                },
                workIntegratedSemesters: {
                    $sum: { $cond: [{ $in: ['$semesters.type', ['work_integrated_learning', 'coop']] }, 1, 0] }
                }
            }
        }
    ]);
    // Get unique course codes from coreCourses
    const uniqueCourses = yield ProgramCourses_1.ProgramCourses.aggregate([
        { $match: { semesters: { $exists: true, $type: 'array' } } },
        { $unwind: '$semesters' },
        { $match: { 'semesters.coreCourses': { $exists: true, $type: 'array' } } },
        { $unwind: '$semesters.coreCourses' },
        { $group: { _id: '$semesters.coreCourses.code' } },
        { $count: 'uniqueCourses' }
    ]);
    // Get requirement type breakdown
    const requirementStats = yield ProgramCourses_1.ProgramCourses.aggregate([
        { $match: { semesters: { $exists: true, $type: 'array' } } },
        { $unwind: '$semesters' },
        { $match: { 'semesters.requirements': { $exists: true, $type: 'array' } } },
        { $unwind: '$semesters.requirements' },
        {
            $group: {
                _id: '$semesters.requirements.type',
                count: { $sum: 1 },
                totalSelectCount: { $sum: '$semesters.requirements.selectCount' }
            }
        }
    ]);
    const result = {
        totalPrograms: ((_a = basicStats[0]) === null || _a === void 0 ? void 0 : _a.totalPrograms) || 0,
        workIntegratedPrograms: ((_b = basicStats[0]) === null || _b === void 0 ? void 0 : _b.workIntegratedPrograms) || 0,
        totalSemesters: ((_c = basicStats[0]) === null || _c === void 0 ? void 0 : _c.totalSemesters) || 0,
        regularSemesters: ((_d = courseStats[0]) === null || _d === void 0 ? void 0 : _d.regularSemesters) || 0,
        workIntegratedSemesters: ((_e = courseStats[0]) === null || _e === void 0 ? void 0 : _e.workIntegratedSemesters) || 0,
        totalCoreCourses: ((_f = courseStats[0]) === null || _f === void 0 ? void 0 : _f.totalCoreCourses) || 0,
        totalRequirements: ((_g = courseStats[0]) === null || _g === void 0 ? void 0 : _g.totalRequirements) || 0,
        uniqueCourses: ((_h = uniqueCourses[0]) === null || _h === void 0 ? void 0 : _h.uniqueCourses) || 0,
        totalCourses: (((_j = courseStats[0]) === null || _j === void 0 ? void 0 : _j.totalCoreCourses) || 0) + (((_k = courseStats[0]) === null || _k === void 0 ? void 0 : _k.totalRequirements) || 0),
        requirementBreakdown: requirementStats.reduce((acc, item) => {
            acc[item._id] = {
                count: item.count,
                totalSelectCount: item.totalSelectCount
            };
            return acc;
        }, {})
    };
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Program courses statistics retrieved successfully'));
}));
//# sourceMappingURL=course.controllers.js.map