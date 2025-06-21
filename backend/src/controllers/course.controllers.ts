import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';
import { StudyMaterial } from '../models/StudyMaterial';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import mongoose from 'mongoose';

// ===== INTERFACE DEFINITIONS =====
interface AuthRequest extends Request {
    user?: {
        _id: string;
        role: 'student' | 'professor' | 'admin' | 'guest';
        academic?: {
            program?: string;
            school?: string;
        };
    };
}

interface CourseQuery {
    page?: number;
    limit?: number;
    search?: string;
    program?: string;
    school?: string;
    level?: string;
    difficulty?: string;
    language?: string;
    delivery?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ===== COURSE CRUD OPERATIONS =====

/**
 * @desc    Get all courses with advanced filtering
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
    const {
        page = 1,
        limit = 20,
        search,
        program,
        school,
        level,
        difficulty,
        language,
        delivery,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    }: CourseQuery = req.query;

    // Build filter object
    const filter: any = { isActive: true };

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];
    }

    if (program) filter['programs.program'] = program;
    if (school) filter.school = school;
    if (level) filter.level = level;
    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.language = language;
    if (delivery) filter.delivery = { $in: [delivery] };

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with population
    const [courses, total] = await Promise.all([
        Course.find(filter)
            .populate('school', 'name shortName')
            .populate('programs.program', 'name code')
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Course.countDocuments(filter)
    ]);

    const pagination = {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCourses: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
    };

    res.status(200).json(
        new ApiResponse(200, {
            courses,
            pagination
        }, 'Courses retrieved successfully')
    );
});

/**
 * @desc    Get single course by ID with detailed info
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid course ID');
    }

    const course = await Course.findById(id)
        .populate('school', 'name shortName location')
        .populate('programs.program', 'name code duration')
        .populate('materials')
        .lean();

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    // Get related statistics
    const [enrollmentCount, materialCount, averageRating] = await Promise.all([
        Enrollment.countDocuments({
            'courses.course': id,
            'courses.status': { $in: ['enrolled', 'in-progress'] }
        }),
        StudyMaterial.countDocuments({
            'academic.course': id,
            status: 'published'
        }),
        StudyMaterial.aggregate([
            { $match: { 'academic.course': new mongoose.Types.ObjectId(id) } },
            { $group: { _id: null, avgRating: { $avg: '$averageRating' } } }
        ])
    ]);

    const courseWithStats = {
        ...course,
        stats: {
            ...course.stats,
            enrollmentCount,
            materialCount,
            averageRating: averageRating[0]?.avgRating || 0
        }
    };

    res.status(200).json(
        new ApiResponse(200, courseWithStats, 'Course retrieved successfully')
    );
});

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Admin only
 */
export const createCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Check permission
    if (req.user?.role !== 'admin') {
        throw new ApiError(403, 'Only admins can create courses');
    }

    const courseData = req.body;

    // Validate required fields
    const requiredFields = ['code', 'name', 'description', 'credits', 'school', 'level', 'programs'];
    for (const field of requiredFields) {
        if (!courseData[field]) {
            throw new ApiError(400, `${field} is required`);
        }
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code: courseData.code.toUpperCase() });
    if (existingCourse) {
        throw new ApiError(400, 'Course code already exists');
    }

    // Validate prerequisites if provided
    if (courseData.prerequisites && courseData.prerequisites.length > 0) {
        const validPrerequisites = await Course.find({
            code: { $in: courseData.prerequisites },
            isActive: true
        });

        if (validPrerequisites.length !== courseData.prerequisites.length) {
            throw new ApiError(400, 'One or more prerequisites are invalid');
        }
    }

    // Create course
    const course = await Course.create({
        ...courseData,
        code: courseData.code.toUpperCase()
    });

    const populatedCourse = await Course.findById(course._id)
        .populate('school', 'name shortName')
        .populate('programs.program', 'name code');

    res.status(201).json(
        new ApiResponse(201, populatedCourse, 'Course created successfully')
    );
});

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Admin only
 */
export const updateCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'admin') {
        throw new ApiError(403, 'Only admins can update courses');
    }

    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid course ID');
    }

    const course = await Course.findById(id);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    // If updating code, check uniqueness
    if (updateData.code && updateData.code.toUpperCase() !== course.code) {
        const existingCourse = await Course.findOne({ 
            code: updateData.code.toUpperCase(),
            _id: { $ne: id }
        });
        if (existingCourse) {
            throw new ApiError(400, 'Course code already exists');
        }
        updateData.code = updateData.code.toUpperCase();
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    )
    .populate('school', 'name shortName')
    .populate('programs.program', 'name code');

    res.status(200).json(
        new ApiResponse(200, updatedCourse, 'Course updated successfully')
    );
});

/**
 * @desc    Delete course (soft delete)
 * @route   DELETE /api/courses/:id
 * @access  Admin only
 */
export const deleteCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'admin') {
        throw new ApiError(403, 'Only admins can delete courses');
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid course ID');
    }

    const course = await Course.findById(id);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    // Check if there are active enrollments
    const activeEnrollments = await Enrollment.countDocuments({
        'courses.course': id,
        'courses.status': { $in: ['enrolled', 'in-progress'] }
    });

    if (activeEnrollments > 0) {
        throw new ApiError(400, 'Cannot delete course with active enrollments');
    }

    // Soft delete
    await Course.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json(
        new ApiResponse(200, null, 'Course deleted successfully')
    );
});

// ===== ENROLLMENT MANAGEMENT =====

/**
 * @desc    Enroll student in course
 * @route   POST /api/courses/:id/enroll
 * @access  Students only
 */
export const enrollInCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;
    const { semester, year, term } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, 'Authentication required');
    }

    if (req.user?.role !== 'student') {
        throw new ApiError(403, 'Only students can enroll in courses');
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
        throw new ApiError(404, 'Course not found or inactive');
    }

    // Get user's enrollment record
    let enrollment = await Enrollment.findOne({ user: userId });
    if (!enrollment) {
        throw new ApiError(400, 'Student enrollment record not found');
    }

    // Check if already enrolled in this course
    const existingEnrollment = enrollment.courses.find(c => 
        c.course.toString() === courseId && 
        c.status === 'enrolled'
    );

    if (existingEnrollment) {
        throw new ApiError(400, 'Already enrolled in this course');
    }

    // Check prerequisites
    if (course.prerequisites && course.prerequisites.length > 0) {
        const completedCourses = enrollment.courses
            .filter(c => c.status === 'completed')
            .map(c => c.course.toString());

        const prerequisiteCourses = await Course.find({
            code: { $in: course.prerequisites }
        }).select('_id');

        const prerequisiteIds = prerequisiteCourses.map(c => c._id.toString());
        const hasAllPrerequisites = prerequisiteIds.every(id => 
            completedCourses.includes(id)
        );

        if (!hasAllPrerequisites) {
            throw new ApiError(400, 'Prerequisites not met');
        }
    }

    // Add course to enrollment
    enrollment.courses.push({
        course: new mongoose.Types.ObjectId(courseId),
        semester: semester || enrollment.currentSemester,
        year: year || new Date().getFullYear(),
        term: term || 'fall',
        status: 'enrolled',
        credits: course.credits,
        enrolledAt: new Date()
    });

    await enrollment.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
        $inc: { 'stats.enrollmentCount': 1 }
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
        .populate('courses.course', 'code name credits');

    res.status(200).json(
        new ApiResponse(200, populatedEnrollment, 'Successfully enrolled in course')
    );
});

/**
 * @desc    Unenroll from course
 * @route   POST /api/courses/:id/unenroll
 * @access  Students only
 */
export const unenrollFromCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, 'Authentication required');
    }

    if (req.user?.role !== 'student') {
        throw new ApiError(403, 'Only students can unenroll from courses');
    }

    const enrollment = await Enrollment.findOne({ user: userId });
    if (!enrollment) {
        throw new ApiError(404, 'Enrollment record not found');
    }

    const courseIndex = enrollment.courses.findIndex(c => 
        c.course.toString() === courseId && 
        c.status === 'enrolled'
    );

    if (courseIndex === -1) {
        throw new ApiError(400, 'Not enrolled in this course');
    }

    // Update course status to dropped
    enrollment.courses[courseIndex].status = 'dropped';
    await enrollment.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
        $inc: { 'stats.enrollmentCount': -1 }
    });

    res.status(200).json(
        new ApiResponse(200, null, 'Successfully unenrolled from course')
    );
});

/**
 * @desc    Get course enrollments (for professors/admins)
 * @route   GET /api/courses/:id/enrollments
 * @access  Professor/Admin only
 */
export const getCourseEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    if (req.user?.role === 'student') {
        throw new ApiError(403, 'Access denied');
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, 'Invalid course ID');
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    // Build query
    const matchQuery: any = {
        'courses.course': new mongoose.Types.ObjectId(courseId)
    };

    if (status) {
        matchQuery['courses.status'] = status;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const enrollments = await Enrollment.aggregate([
        { $match: matchQuery },
        { $unwind: '$courses' },
        { $match: { 'courses.course': new mongoose.Types.ObjectId(courseId) } },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'student',
                pipeline: [
                    { $project: { fullName: 1, email: 1, academic: 1 } }
                ]
            }
        },
        { $unwind: '$student' },
        {
            $project: {
                student: 1,
                courseInfo: '$courses',
                currentSemester: 1,
                gpa: 1
            }
        },
        { $sort: { 'courseInfo.enrolledAt': -1 } },
        { $skip: skip },
        { $limit: limitNum }
    ]);

    const total = await Enrollment.aggregate([
        { $match: matchQuery },
        { $unwind: '$courses' },
        { $match: { 'courses.course': new mongoose.Types.ObjectId(courseId) } },
        { $count: 'total' }
    ]);

    const pagination = {
        currentPage: pageNum,
        totalPages: Math.ceil((total[0]?.total || 0) / limitNum),
        totalEnrollments: total[0]?.total || 0
    };

    res.status(200).json(
        new ApiResponse(200, {
            enrollments,
            pagination,
            course: {
                _id: course._id,
                code: course.code,
                name: course.name
            }
        }, 'Course enrollments retrieved successfully')
    );
});

// ===== COURSE MATERIALS MANAGEMENT =====

/**
 * @desc    Get course materials
 * @route   GET /api/courses/:id/materials
 * @access  Public
 */
export const getCourseMaterials = asyncHandler(async (req: Request, res: Response) => {
    const { id: courseId } = req.params;
    const { 
        page = 1, 
        limit = 20, 
        category, 
        week,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, 'Invalid course ID');
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    // Build filter
    const filter: any = {
        'academic.course': courseId,
        status: 'published',
        isPublic: true
    };

    if (category) filter.category = category;
    if (week) filter['academic.week'] = Number(week);

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const [materials, total] = await Promise.all([
        StudyMaterial.find(filter)
            .populate('author', 'fullName profilePic')
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        StudyMaterial.countDocuments(filter)
    ]);

    const pagination = {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalMaterials: total
    };

    res.status(200).json(
        new ApiResponse(200, {
            materials,
            pagination,
            course: {
                _id: course._id,
                code: course.code,
                name: course.name
            }
        }, 'Course materials retrieved successfully')
    );
});

/**
 * @desc    Get my enrolled courses
 * @route   GET /api/courses/my-courses
 * @access  Students only
 */
export const getMyCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, 'Authentication required');
    }

    if (req.user?.role !== 'student') {
        throw new ApiError(403, 'Only students can access this endpoint');
    }

    const enrollment = await Enrollment.findOne({ user: userId })
        .populate({
            path: 'courses.course',
            select: 'code name credits description difficulty stats',
            populate: {
                path: 'school',
                select: 'name shortName'
            }
        });

    if (!enrollment) {
        return res.status(200).json(
            new ApiResponse(200, { courses: [] }, 'No enrollment found')
        );
    }

    // Group courses by status
    const coursesByStatus = {
        enrolled: enrollment.courses.filter(c => c.status === 'enrolled'),
        inProgress: enrollment.courses.filter(c => c.status === 'in-progress'),
        completed: enrollment.courses.filter(c => c.status === 'completed'),
        dropped: enrollment.courses.filter(c => c.status === 'dropped')
    };

    const summary = {
        totalCredits: enrollment.totalCredits,
        completedCredits: enrollment.completedCredits,
        currentSemester: enrollment.currentSemester,
        gpa: enrollment.gpa,
        completionPercentage: enrollment.completionPercentage
    };

    res.status(200).json(
        new ApiResponse(200, {
            courses: coursesByStatus,
            summary
        }, 'My courses retrieved successfully')
    );
});

// ===== COURSE ANALYTICS =====

/**
 * @desc    Get course statistics
 * @route   GET /api/courses/:id/stats
 * @access  Professor/Admin only
 */
export const getCourseStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: courseId } = req.params;

    if (req.user?.role === 'student') {
        throw new ApiError(403, 'Access denied');
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, 'Invalid course ID');
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    // Get comprehensive statistics
    const [
        enrollmentStats,
        gradeDistribution,
        materialStats,
        weeklyActivity
    ] = await Promise.all([
        // Enrollment statistics
        Enrollment.aggregate([
            { $unwind: '$courses' },
            { $match: { 'courses.course': new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: '$courses.status',
                    count: { $sum: 1 }
                }
            }
        ]),

        // Grade distribution
        Enrollment.aggregate([
            { $unwind: '$courses' },
            { 
                $match: { 
                    'courses.course': new mongoose.Types.ObjectId(courseId),
                    'courses.grade': { $exists: true }
                }
            },
            {
                $group: {
                    _id: '$courses.grade',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]),

        // Material statistics
        StudyMaterial.aggregate([
            { $match: { 'academic.course': new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgRating: { $avg: '$averageRating' },
                    totalViews: { $sum: '$views' }
                }
            }
        ]),

        // Weekly activity
        StudyMaterial.aggregate([
            { $match: { 'academic.course': new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: '$academic.week',
                    materialCount: { $sum: 1 },
                    totalViews: { $sum: '$views' }
                }
            },
            { $sort: { _id: 1 } }
        ])
    ]);

    const stats = {
        enrollment: enrollmentStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {} as Record<string, number>),
        
        gradeDistribution,
        
        materials: {
            byCategory: materialStats,
            total: materialStats.reduce((sum, stat) => sum + stat.count, 0)
        },
        
        weeklyActivity,
        
        course: {
            _id: course._id,
            code: course.code,
            name: course.name,
            stats: course.stats
        }
    };

    res.status(200).json(
        new ApiResponse(200, stats, 'Course statistics retrieved successfully')
    );
});

// ===== EXPORT ALL FUNCTIONS =====
export default {
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
};