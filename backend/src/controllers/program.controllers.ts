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
import { AuthRequest } from '../middleware/auth.middleware';

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

interface RawProgram {
    id: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery: string;
    credential: string;
    school: string;
}

interface TransformedProgram {
    programId: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery?: string;
    credential: string;
    school: string;
    level: string;
    isActive: boolean;
    stats: {
        enrollmentCount: number;
        graduationRate?: number;
        employmentRate?: number;
    };
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
        // Execute query without school population since school is a string
        const [programs, total] = await Promise.all([
            Program.find(filter)
                // .populate('school', 'name code type province') // Removed - school is string
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
            // .populate('school', 'name code') // Removed - school is string
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
    const { identifier } = req.params;

    try {
        logger.info('=== Program API Call ===', {
            identifier,
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url
        });

        let program;

        // Check if identifier is ObjectId or code
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            // It's an ObjectId
            logger.info('Searching by ObjectId:', identifier);
            program = await Program.findById(identifier).lean();
        } else {
            // It's a code
            logger.info('Searching by code:', identifier.toUpperCase());
            program = await Program.findOne({ code: identifier.toUpperCase() }).lean();
        }

        if (!program) {
            logger.warn('Program not found:', identifier);
            throw new ApiError(404, 'Program not found');
        }

        // Type assertion for accessing potentially dynamic fields
        const programData = program as any;

        logger.info('Program found:', {
            _id: programData._id,
            code: programData.code,
            name: programData.name,
            hasSemesters: !!programData.semesters,
            semestersCount: programData.semesters ? programData.semesters.length : 0
        });

        // Ensure semesters data is properly formatted if it exists
        if (programData.semesters && Array.isArray(programData.semesters)) {
            // Sort semesters by name/id if needed
            programData.semesters = programData.semesters.sort((a: any, b: any) => {
                const nameA = a.name || a.id || '';
                const nameB = b.name || b.id || '';
                return nameA.localeCompare(nameB);
            });
            
            logger.info('Semesters processed:', {
                count: programData.semesters.length,
                semesters: programData.semesters.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    coursesCount: s.courses ? s.courses.length : 0
                }))
            });
        }

        const response = new ApiResponse(200, programData, 'Program retrieved successfully');
        
        logger.info('=== API Response Success ===', {
            identifier,
            success: true,
            dataKeys: Object.keys(programData)
        });
        
        res.status(200).json(response);

    } catch (error: any) {
        logger.error('=== API Error ===', {
            identifier,
            error: error.message,
            stack: error.stack,
            isApiError: error instanceof ApiError
        });
        
        if (error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(500, 'Failed to retrieve program details');
    }
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
            // .populate('school', 'name code') // Removed - school is string
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
    );

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

// ===== BULK IMPORT HELPERS =====

/**
 * Function to map credential to level
 */
function mapCredentialToLevel(credential: string): string {
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
function transformProgram(rawProgram: RawProgram): TransformedProgram {
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
export const bulkImportPrograms = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    const { programs }: { programs: RawProgram[] } = req.body;

    if (!Array.isArray(programs) || programs.length === 0) {
        throw new ApiError(400, 'Programs array is required');
    }

    logger.info(`Starting bulk import of ${programs.length} programs`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Transform programs first
    const transformedPrograms = programs.map(transformProgram);

    for (const programData of transformedPrograms) {
        try {
            await Program.findOneAndUpdate(
                { 
                    $or: [
                        { programId: programData.programId },
                        { code: programData.code }
                    ]
                },
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
            errors.push(`${programData.programId} (${programData.code}): ${error.message}`);
            logger.error(`Error importing program ${programData.programId}:`, error);
        }
    }

    logger.info(`Bulk import completed: ${successCount} successful, ${errorCount} failed`);

    res.status(200).json(
        new ApiResponse(200, {
            successCount,
            errorCount,
            errors: errors.slice(0, 10), // Only return first 10 errors
            totalProcessed: programs.length
        }, `Bulk import completed: ${successCount} successful, ${errorCount} failed`)
    );
}); 