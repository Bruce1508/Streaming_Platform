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
const Course_1 = require("../models/Course");
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
            yield Course_1.ProgramCourses.findOneAndUpdate({ programId: programData.programId }, programData, {
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
    const { search, programId, sortBy = 'programId', sortOrder = 'asc' } = req.query;
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
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    const [programCourses, total] = yield Promise.all([
        Course_1.ProgramCourses.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Course_1.ProgramCourses.countDocuments(filter)
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
    const programCourses = yield Course_1.ProgramCourses.findOne({
        programId: programId.toUpperCase()
    }).lean();
    if (!programCourses) {
        throw new ApiError_1.ApiError(404, `Program courses not found for program: ${programId}`);
    }
    // Calculate statistics
    const totalFixedCourses = programCourses.semesters.reduce((total, sem) => total + sem.courses.length, 0);
    const totalRequirements = programCourses.semesters.reduce((total, sem) => { var _a; return total + (((_a = sem.requirements) === null || _a === void 0 ? void 0 : _a.reduce((reqTotal, req) => reqTotal + req.count, 0)) || 0); }, 0);
    const stats = {
        totalSemesters: programCourses.semesters.length,
        totalFixedCourses,
        totalRequirements,
        totalCourses: totalFixedCourses + totalRequirements,
        coursesPerSemester: programCourses.semesters.map(sem => {
            var _a;
            return ({
                semester: sem.name,
                fixedCourses: sem.courses.length,
                requirements: ((_a = sem.requirements) === null || _a === void 0 ? void 0 : _a.reduce((reqTotal, req) => reqTotal + req.count, 0)) || 0,
                totalCourses: sem.totalCourses || sem.courses.length
            });
        })
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
    // Build match conditions
    const matchConditions = {};
    if (courseCode) {
        matchConditions['semesters.courses.code'] = {
            $regex: courseCode.toString(),
            $options: 'i'
        };
    }
    if (courseName) {
        matchConditions['semesters.courses.name'] = {
            $regex: courseName.toString(),
            $options: 'i'
        };
    }
    // Simple aggregation pipeline
    const results = yield Course_1.ProgramCourses.aggregate([
        { $match: matchConditions },
        { $unwind: '$semesters' },
        { $unwind: '$semesters.courses' },
        {
            $match: Object.assign(Object.assign({}, (courseCode && { 'semesters.courses.code': { $regex: courseCode.toString(), $options: 'i' } })), (courseName && { 'semesters.courses.name': { $regex: courseName.toString(), $options: 'i' } }))
        },
        {
            $group: {
                _id: '$semesters.courses.code',
                course: { $first: '$semesters.courses' },
                programs: {
                    $push: {
                        programId: '$programId',
                        programName: '$programName',
                        semester: '$semesters.name'
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
    const totalResults = yield Course_1.ProgramCourses.aggregate([
        { $match: matchConditions },
        { $unwind: '$semesters' },
        { $unwind: '$semesters.courses' },
        {
            $match: Object.assign(Object.assign({}, (courseCode && { 'semesters.courses.code': { $regex: courseCode.toString(), $options: 'i' } })), (courseName && { 'semesters.courses.name': { $regex: courseName.toString(), $options: 'i' } }))
        },
        {
            $group: {
                _id: '$semesters.courses.code'
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
    var _a, _b, _c, _d, _e, _f, _g;
    (0, Api_utils_1.logApiRequest)(req);
    // Get basic stats
    const basicStats = yield Course_1.ProgramCourses.aggregate([
        {
            $group: {
                _id: null,
                totalPrograms: { $sum: 1 },
                totalSemesters: { $sum: { $size: '$semesters' } }
            }
        }
    ]);
    // Get course counts
    const courseStats = yield Course_1.ProgramCourses.aggregate([
        { $unwind: '$semesters' },
        {
            $group: {
                _id: null,
                totalFixedCourses: { $sum: { $size: '$semesters.courses' } },
                totalRequirements: {
                    $sum: {
                        $reduce: {
                            input: { $ifNull: ['$semesters.requirements', []] },
                            initialValue: 0,
                            in: { $add: ['$$value', '$$this.count'] }
                        }
                    }
                }
            }
        }
    ]);
    // Get unique course codes
    const uniqueCourses = yield Course_1.ProgramCourses.aggregate([
        { $unwind: '$semesters' },
        { $unwind: '$semesters.courses' },
        { $group: { _id: '$semesters.courses.code' } },
        { $count: 'uniqueCourses' }
    ]);
    const result = {
        totalPrograms: ((_a = basicStats[0]) === null || _a === void 0 ? void 0 : _a.totalPrograms) || 0,
        totalSemesters: ((_b = basicStats[0]) === null || _b === void 0 ? void 0 : _b.totalSemesters) || 0,
        totalFixedCourses: ((_c = courseStats[0]) === null || _c === void 0 ? void 0 : _c.totalFixedCourses) || 0,
        totalRequirements: ((_d = courseStats[0]) === null || _d === void 0 ? void 0 : _d.totalRequirements) || 0,
        uniqueCourses: ((_e = uniqueCourses[0]) === null || _e === void 0 ? void 0 : _e.uniqueCourses) || 0,
        totalCourses: (((_f = courseStats[0]) === null || _f === void 0 ? void 0 : _f.totalFixedCourses) || 0) + (((_g = courseStats[0]) === null || _g === void 0 ? void 0 : _g.totalRequirements) || 0)
    };
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Program courses statistics retrieved successfully'));
}));
//# sourceMappingURL=course.controllers.js.map