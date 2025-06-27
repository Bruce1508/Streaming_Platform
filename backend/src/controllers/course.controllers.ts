import { Request, Response } from 'express';
import { ProgramCourses, IProgramCourses } from '../models/Course';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { 
    extractPagination, 
    createPaginatedResponse,
    logApiRequest 
} from '../utils/Api.utils';
import { AuthRequest } from '../middleware/auth.middleware';

// ===== PROGRAM COURSES CONTROLLERS =====

/**
 * @desc    Bulk import program courses from scraped data
 * @route   POST /api/courses/program-courses/bulk-import
 * @access  Admin only
 */
export const bulkImportProgramCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    const { programCourses }: { programCourses: IProgramCourses[] } = req.body;

    if (!Array.isArray(programCourses) || programCourses.length === 0) {
        throw new ApiError(400, 'Program courses array is required');
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const programData of programCourses) {
        try {
            await ProgramCourses.findOneAndUpdate(
                { programId: programData.programId },
                programData,
                { 
                    upsert: true, 
                    new: true,
                    runValidators: true
                }
            );
            successCount++;
        } catch (error: any) {
            errorCount++;
            errors.push(`${programData.programId}: ${error.message}`);
        }
    }

    res.status(200).json(
        new ApiResponse(200, {
            successCount,
            errorCount,
            errors: errors.slice(0, 10),
            totalProcessed: programCourses.length
        }, `Bulk import completed: ${successCount} successful, ${errorCount} failed`)
    );
});

/**
 * @desc    Get all program courses with filtering
 * @route   GET /api/courses/program-courses
 * @access  Public
 */
export const getProgramCourses = asyncHandler(async (req: Request, res: Response) => {
    logApiRequest(req as any);

    const {
        search,
        programId,
        sortBy = 'programId',
        sortOrder = 'asc'
    } = req.query;

    const { page, limit, skip } = extractPagination(req);
    
    // Build filter
    const filter: any = {};

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
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const [programCourses, total] = await Promise.all([
        ProgramCourses.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        ProgramCourses.countDocuments(filter)
    ]);

    const response = createPaginatedResponse(
        programCourses,
        total,
        page,
        limit,
        'Program courses retrieved successfully'
    );

    res.status(200).json(response);
});

/**
 * @desc    Get program courses by program ID
 * @route   GET /api/courses/program-courses/:programId
 * @access  Public
 */
export const getProgramCoursesByProgramId = asyncHandler(async (req: Request, res: Response) => {
    logApiRequest(req as any);

    const { programId } = req.params;

    if (!programId) {
        throw new ApiError(400, 'Program ID is required');
    }

    const programCourses = await ProgramCourses.findOne({ 
        programId: programId.toUpperCase() 
    }).lean();

    if (!programCourses) {
        throw new ApiError(404, `Program courses not found for program: ${programId}`);
    }

    // Calculate statistics
    const totalFixedCourses = programCourses.semesters.reduce((total, sem) => total + sem.courses.length, 0);
    const totalRequirements = programCourses.semesters.reduce((total, sem) => 
        total + (sem.requirements?.reduce((reqTotal, req) => reqTotal + req.count, 0) || 0), 0);

    const stats = {
        totalSemesters: programCourses.semesters.length,
        totalFixedCourses,
        totalRequirements,
        totalCourses: totalFixedCourses + totalRequirements,
        coursesPerSemester: programCourses.semesters.map(sem => ({
            semester: sem.name,
            fixedCourses: sem.courses.length,
            requirements: sem.requirements?.reduce((reqTotal, req) => reqTotal + req.count, 0) || 0,
            totalCourses: sem.totalCourses || sem.courses.length
        }))
    };

    const responseData = {
        ...programCourses,
        stats
    };

    res.status(200).json(
        new ApiResponse(200, responseData, 'Program courses retrieved successfully')
    );
});

/**
 * @desc    Search courses across all programs
 * @route   GET /api/courses/program-courses/search
 * @access  Public
 */
export const searchCoursesAcrossPrograms = asyncHandler(async (req: Request, res: Response) => {
    logApiRequest(req as any);

    const { courseCode, courseName } = req.query;

    if (!courseCode && !courseName) {
        throw new ApiError(400, 'Either courseCode or courseName is required');
    }

    const { page, limit, skip } = extractPagination(req);

    // Build match conditions
    const matchConditions: any = {};

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
    const results = await ProgramCourses.aggregate([
        { $match: matchConditions },
        { $unwind: '$semesters' },
        { $unwind: '$semesters.courses' },
        {
            $match: {
                ...(courseCode && { 'semesters.courses.code': { $regex: courseCode.toString(), $options: 'i' } }),
                ...(courseName && { 'semesters.courses.name': { $regex: courseName.toString(), $options: 'i' } })
            }
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
    const totalResults = await ProgramCourses.aggregate([
        { $match: matchConditions },
        { $unwind: '$semesters' },
        { $unwind: '$semesters.courses' },
        {
            $match: {
                ...(courseCode && { 'semesters.courses.code': { $regex: courseCode.toString(), $options: 'i' } }),
                ...(courseName && { 'semesters.courses.name': { $regex: courseName.toString(), $options: 'i' } })
            }
        },
        {
            $group: {
                _id: '$semesters.courses.code'
            }
        },
        { $count: 'total' }
    ]);

    const total = totalResults[0]?.total || 0;

    const response = createPaginatedResponse(
        results,
        total,
        page,
        limit,
        'Course search completed successfully'
    );

    res.status(200).json(response);
});

/**
 * @desc    Get program courses statistics
 * @route   GET /api/courses/program-courses/stats
 * @access  Public
 */
export const getProgramCoursesStats = asyncHandler(async (req: Request, res: Response) => {
    logApiRequest(req as any);

    // Get basic stats
    const basicStats = await ProgramCourses.aggregate([
        {
            $group: {
                _id: null,
                totalPrograms: { $sum: 1 },
                totalSemesters: { $sum: { $size: '$semesters' } }
            }
        }
    ]);

    // Get course counts
    const courseStats = await ProgramCourses.aggregate([
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
    const uniqueCourses = await ProgramCourses.aggregate([
        { $unwind: '$semesters' },
        { $unwind: '$semesters.courses' },
        { $group: { _id: '$semesters.courses.code' } },
        { $count: 'uniqueCourses' }
    ]);

    const result = {
        totalPrograms: basicStats[0]?.totalPrograms || 0,
        totalSemesters: basicStats[0]?.totalSemesters || 0,
        totalFixedCourses: courseStats[0]?.totalFixedCourses || 0,
        totalRequirements: courseStats[0]?.totalRequirements || 0,
        uniqueCourses: uniqueCourses[0]?.uniqueCourses || 0,
        totalCourses: (courseStats[0]?.totalFixedCourses || 0) + (courseStats[0]?.totalRequirements || 0)
    };

    res.status(200).json(
        new ApiResponse(200, result, 'Program courses statistics retrieved successfully')
    );
}); 