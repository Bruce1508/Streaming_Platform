import { Request, Response } from 'express';
import { Program } from '../models/Program';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { 
    extractPagination, 
    extractSortOptions,
    createPaginatedResponse,
    logApiRequest 
} from '../utils/Api.utils';
import { 
    getCachedPrograms, 
    cachePrograms,
    generateCacheKey 
} from '../utils/Cache.utils';
import { logger } from '../utils/logger.utils';
import mongoose from 'mongoose';

// ===== INTERFACE DEFINITIONS =====
interface ProgramQuery {
    page?: number;
    limit?: number;
    search?: string;
    school?: string;
    level?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ===== PROGRAM CONTROLLERS =====

/**
 * @desc    Get all programs with filtering support for onBoarding
 * @route   GET /api/programs
 * @access  Public
 */
export const getPrograms = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const {
        search,
        school,
        level,
        isActive = true,
        sortBy = 'name',
        sortOrder = 'asc'
    }: ProgramQuery = req.query;

    // ✅ Use pagination utils
    const { page, limit, skip } = extractPagination(req);
    
    // ✅ Use sort utils
    const sortOptions = extractSortOptions(req, { [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    // ✅ Generate cache key
    const cacheKey = generateCacheKey('programs_list', JSON.stringify(req.query));
    const cached = await getCachedPrograms(cacheKey);
    
    if (cached) {
        logger.info('Programs retrieved from cache');
        return res.status(200).json(cached);
    }

    // Build filter object
    const filter: any = {};
    
    if (isActive !== undefined) filter.isActive = isActive;

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    if (school) {
        // Support both ObjectId and school code
        if (mongoose.Types.ObjectId.isValid(school)) {
            filter.school = school;
        } else {
            // Need to lookup school by code first - will implement populate alternative
            filter['school.code'] = school.toUpperCase();
        }
    }
    
    if (level) filter.level = level;

    try {
        // Execute query with school population
        const [programs, total] = await Promise.all([
            Program.find(filter)
                .populate('school', 'name code type province')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            Program.countDocuments(filter)
        ]);

        // ✅ Create paginated response
        const response = createPaginatedResponse(
            programs,
            total,
            page,
            limit,
            'Programs retrieved successfully'
        );

        // ✅ Cache the response (5 minutes)
        await cachePrograms(cacheKey, response, 300);

        logger.info('Programs retrieved successfully', {
            total,
            page,
            limit,
            filters: { search, school, level, isActive }
        });

        res.status(200).json(response);

    } catch (error: any) {
        logger.error('Error retrieving programs:', error);
        throw new ApiError(500, 'Failed to retrieve programs');
    }
});

/**
 * @desc    Get programs by school (for onBoarding dropdown)
 * @route   GET /api/programs/school/:schoolId
 * @access  Public
 */
export const getProgramsBySchool = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { schoolId } = req.params;
    const { level, limit = 50 } = req.query;

    // Validate schoolId
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
        throw new ApiError(400, 'Invalid school ID');
    }

    // ✅ Try cache first
    const cacheKey = generateCacheKey('programs_by_school', schoolId, level as string);
    const cached = await getCachedPrograms(cacheKey);
    
    if (cached) {
        return res.status(200).json(cached);
    }

    const filter: any = { 
        school: schoolId,
        isActive: true 
    };

    if (level) filter.level = level;

    try {
        const programs = await Program.find(filter)
            .select('name code level duration totalCredits description')
            .populate('school', 'name code')
            .sort({ name: 1 })
            .limit(parseInt(limit as string))
            .lean();

        const response = new ApiResponse(
            200, 
            {
                programs,
                school: programs[0]?.school || null,
                total: programs.length
            }, 
            'Programs retrieved successfully'
        );

        // ✅ Cache the response (10 minutes)
        await cachePrograms(cacheKey, response, 600);

        logger.info('Programs retrieved by school', {
            schoolId,
            level,
            count: programs.length
        });

        res.status(200).json(response);

    } catch (error: any) {
        logger.error('Error retrieving programs by school:', error);
        throw new ApiError(500, 'Failed to retrieve programs by school');
    }
});

/**
 * @desc    Get single program by ID or code
 * @route   GET /api/programs/:identifier
 * @access  Public
 */
export const getProgramById = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { identifier } = req.params;

    // ✅ Try cache first
    const cacheKey = generateCacheKey('program_detail', identifier);
    const cached = await getCachedPrograms(cacheKey);
    
    if (cached) {
        return res.status(200).json(cached);
    }

    let program;

    // Check if identifier is ObjectId or code
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        // It's an ObjectId
        program = await Program.findById(identifier)
            .populate('school', 'name code type province website')
            .populate('courses', 'name code credits level')
            .lean();
    } else {
        // It's a code
        program = await Program.findOne({ code: identifier.toUpperCase() })
            .populate('school', 'name code type province website')
            .populate('courses', 'name code credits level')
            .lean();
    }

    if (!program) {
        throw new ApiError(404, 'Program not found');
    }

    const response = new ApiResponse(200, program, 'Program retrieved successfully');

    // ✅ Cache the program (10 minutes)
    await cachePrograms(cacheKey, response, 600);

    logger.info('Program retrieved by identifier', {
        identifier,
        programName: program.name
    });

    res.status(200).json(response);
});

/**
 * @desc    Get available program levels
 * @route   GET /api/programs/levels
 * @access  Public
 */
export const getProgramLevels = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const cacheKey = 'program_levels_list';
    const cached = await getCachedPrograms(cacheKey);
    
    if (cached) {
        return res.status(200).json(cached);
    }

    try {
        const levels = await Program.distinct('level', { isActive: true });
        
        // Sort levels by educational hierarchy
        const levelOrder = ['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Graduate Certificate'];
        const sortedLevels = levels.sort((a, b) => {
            const indexA = levelOrder.indexOf(a);
            const indexB = levelOrder.indexOf(b);
            return indexA - indexB;
        });

        const response = new ApiResponse(
            200, 
            { levels: sortedLevels }, 
            'Program levels retrieved successfully'
        );

        // ✅ Cache for 1 hour
        await cachePrograms(cacheKey, response, 3600);

        logger.info('Program levels retrieved', {
            count: sortedLevels.length
        });

        res.status(200).json(response);

    } catch (error: any) {
        logger.error('Error retrieving program levels:', error);
        throw new ApiError(500, 'Failed to retrieve program levels');
    }
});

/**
 * @desc    Search programs for onBoarding autocomplete
 * @route   GET /api/programs/search
 * @access  Public
 */
export const searchPrograms = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { q, school, level, limit = 10 } = req.query;

    if (!q || (q as string).length < 2) {
        throw new ApiError(400, 'Search query must be at least 2 characters');
    }

    // ✅ Try cache first
    const cacheKey = generateCacheKey('program_search', q as string, school as string, level as string);
    const cached = await getCachedPrograms(cacheKey);
    
    if (cached) {
        return res.status(200).json(cached);
    }

    const filter: any = {
        isActive: true,
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { code: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ]
    };

    if (school && mongoose.Types.ObjectId.isValid(school as string)) {
        filter.school = school;
    }
    
    if (level) filter.level = level;

    try {
        const programs = await Program.find(filter)
            .select('name code level school')
            .populate('school', 'name code')
            .sort({ name: 1 })
            .limit(parseInt(limit as string))
            .lean();

        const response = new ApiResponse(
            200, 
            {
                programs,
                query: q,
                total: programs.length
            }, 
            'Program search completed'
        );

        // ✅ Cache for 5 minutes
        await cachePrograms(cacheKey, response, 300);

        logger.info('Program search completed', {
            query: q,
            school,
            level,
            results: programs.length
        });

        res.status(200).json(response);

    } catch (error: any) {
        logger.error('Error searching programs:', error);
        throw new ApiError(500, 'Failed to search programs');
    }
});

// ===== ADMIN CONTROLLERS (Future) =====

/**
 * @desc    Create new program (Admin only)
 * @route   POST /api/programs
 * @access  Admin
 */
export const createProgram = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { name, code, school, level, duration, totalCredits, description } = req.body;

    // Validate school exists
    if (!mongoose.Types.ObjectId.isValid(school)) {
        throw new ApiError(400, 'Invalid school ID');
    }

    // Check if program with same code exists
    const existingProgram = await Program.findOne({ code: code.toUpperCase() });
    if (existingProgram) {
        throw new ApiError(400, 'Program with this code already exists');
    }

    const program = new Program({
        name,
        code: code.toUpperCase(),
        school,
        level,
        duration,
        totalCredits,
        description,
        isActive: true
    });

    const savedProgram = await program.save();
    await savedProgram.populate('school', 'name code');

    logger.info('New program created', {
        programId: savedProgram._id,
        code: savedProgram.code,
        name: savedProgram.name,
        school: savedProgram.school
    });

    res.status(201).json(
        new ApiResponse(201, savedProgram, 'Program created successfully')
    );
});

/**
 * @desc    Update program (Admin only)
 * @route   PUT /api/programs/:id
 * @access  Admin
 */
export const updateProgram = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid program ID');
    }

    const program = await Program.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
    ).populate('school', 'name code');

    if (!program) {
        throw new ApiError(404, 'Program not found');
    }

    logger.info('Program updated', {
        programId: program._id,
        code: program.code
    });

    res.status(200).json(
        new ApiResponse(200, program, 'Program updated successfully')
    );
});

/**
 * @desc    Delete program (Admin only)
 * @route   DELETE /api/programs/:id
 * @access  Admin
 */
export const deleteProgram = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid program ID');
    }

    const program = await Program.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!program) {
        throw new ApiError(404, 'Program not found');
    }

    logger.info('Program soft deleted', {
        programId: program._id,
        code: program.code
    });

    res.status(200).json(
        new ApiResponse(200, program, 'Program deleted successfully')
    );
}); 