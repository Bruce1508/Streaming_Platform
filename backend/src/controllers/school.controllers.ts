import { Request, Response } from 'express';
import { School } from '../models/School';
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
    getCachedSchools, 
    cacheSchools,
    generateCacheKey 
} from '../utils/Cache.utils';
import { logger } from '../utils/logger.utils';
import { canadianSchools } from '../lib/schoolData';

// ===== INTERFACE DEFINITIONS =====
interface SchoolQuery {
    page?: number;
    limit?: number;
    search?: string;
    province?: string;
    type?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ===== SCHOOL CONTROLLERS =====

/**
 * @desc    Get all schools with filtering support for onBoarding
 * @route   GET /api/schools
 * @access  Public
 */
export const getSchools = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const {
        search,
        province,
        type,
        isActive = true,
        sortBy = 'name',
        sortOrder = 'asc'
    }: SchoolQuery = req.query;

    // ✅ Use pagination utils
    const { page, limit, skip } = extractPagination(req);
    
    // ✅ Use sort utils
    const sortOptions = extractSortOptions(req, { [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    // ✅ Generate cache key
    const cacheKey = generateCacheKey('schools_list', JSON.stringify(req.query));
    const cached = await getCachedSchools(cacheKey);
    
    if (cached) {
        logger.info('Schools retrieved from cache');
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

    if (province) filter.province = province;
    if (type) filter.type = type;

    try {
        // Execute query
        const [schools, total] = await Promise.all([
            School.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            School.countDocuments(filter)
        ]);

        // ✅ Create paginated response
        const response = createPaginatedResponse(
            schools,
            total,
            page,
            limit,
            'Schools retrieved successfully'
        );

        // ✅ Cache the response (5 minutes)
        await cacheSchools(cacheKey, response, 300);

        logger.info('Schools retrieved successfully', {
            total,
            page,
            limit,
            filters: { search, province, type, isActive }
        });

        res.status(200).json(response);

    } catch (error: any) {
        logger.error('Error retrieving schools:', error);
        throw new ApiError(500, 'Failed to retrieve schools');
    }
});

/**
 * @desc    Get single school by ID or code
 * @route   GET /api/schools/:identifier
 * @access  Public
 */
export const getSchoolById = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { identifier } = req.params;

    // ✅ Try cache first
    const cacheKey = generateCacheKey('school_detail', identifier);
    const cached = await getCachedSchools(cacheKey);
    
    if (cached) {
        return res.status(200).json(cached);
    }

    let school;

    // Check if identifier is ObjectId or code
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        // It's an ObjectId
        school = await School.findById(identifier)
            .populate('programs', 'name code level totalCredits')
            .lean();
    } else {
        // It's a code
        school = await School.findOne({ code: identifier.toUpperCase() })
            .populate('programs', 'name code level totalCredits')
            .lean();
    }

    if (!school) {
        throw new ApiError(404, 'School not found');
    }

    const response = new ApiResponse(200, school, 'School retrieved successfully');

    // ✅ Cache the school (10 minutes)
    await cacheSchools(cacheKey, response, 600);

    logger.info('School retrieved by identifier', {
        identifier,
        schoolName: school.name
    });

    res.status(200).json(response);
});

/**
 * @desc    Get schools by province (for onBoarding dropdown)
 * @route   GET /api/schools/province/:province
 * @access  Public
 */
export const getSchoolsByProvince = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { province } = req.params;
    const { type, limit = 50 } = req.query;

    // ✅ Try cache first
    const cacheKey = generateCacheKey('schools_by_province', province, type as string);
    const cached = await getCachedSchools(cacheKey);
    
    if (cached) {
        return res.status(200).json(cached);
    }

    const filter: any = { 
        province: province,
        isActive: true 
    };

    if (type) filter.type = type;

    try {
        const schools = await School.find(filter)
            .select('name code type website established')
            .sort({ name: 1 })
            .limit(parseInt(limit as string))
            .lean();

        const response = new ApiResponse(
            200, 
            {
                schools,
                province,
                total: schools.length
            }, 
            `Schools in ${province} retrieved successfully`
        );

        // ✅ Cache the response (15 minutes)
        await cacheSchools(cacheKey, response, 900);

        logger.info('Schools retrieved by province', {
            province,
            type,
            count: schools.length
        });

        res.status(200).json(response);

    } catch (error: any) {
        logger.error('Error retrieving schools by province:', error);
        throw new ApiError(500, 'Failed to retrieve schools by province');
    }
});

/**
 * @desc    Get available provinces list
 * @route   GET /api/schools/provinces
 * @access  Public
 */
export const getProvinces = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const cacheKey = 'schools_provinces_list';
    const cached = await getCachedSchools(cacheKey);
    
    if (cached) {
        return res.status(200).json(cached);
    }

    try {
        const provinces = await School.distinct('province', { isActive: true });
        
        // Sort provinces alphabetically
        provinces.sort();

        const response = new ApiResponse(
            200, 
            { provinces }, 
            'Provinces retrieved successfully'
        );

        // ✅ Cache for 1 hour
        await cacheSchools(cacheKey, response, 3600);

        logger.info('Provinces list retrieved', {
            count: provinces.length
        });

        res.status(200).json(response);

    } catch (error: any) {
        logger.error('Error retrieving provinces:', error);
        throw new ApiError(500, 'Failed to retrieve provinces');
    }
});

/**
 * @desc    Seed schools from schoolData.ts (Admin only)
 * @route   POST /api/schools/seed
 * @access  Admin
 */
export const seedSchools = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    try {
        // Clear existing schools (optional - can be made safer)
        const existingCount = await School.countDocuments();
        
        if (existingCount > 0) {
            throw new ApiError(400, 'Schools already exist. Use force=true to override');
        }

        // Insert schools from schoolData
        const schoolsToInsert = canadianSchools.map(school => ({
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

        const insertedSchools = await School.insertMany(schoolsToInsert);

        logger.info('Schools seeded successfully', {
            count: insertedSchools.length
        });

        res.status(201).json(
            new ApiResponse(
                201, 
                { 
                    inserted: insertedSchools.length,
                    schools: insertedSchools.slice(0, 5) // Return first 5 as sample
                }, 
                'Schools seeded successfully'
            )
        );

    } catch (error: any) {
        logger.error('Error seeding schools:', error);
        throw new ApiError(500, 'Failed to seed schools');
    }
});

// ===== ADMIN CONTROLLERS (Future) =====

/**
 * @desc    Create new school (Admin only)
 * @route   POST /api/schools
 * @access  Admin
 */
export const createSchool = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { name, code, type, province, website, description } = req.body;

    // Check if school with same code exists
    const existingSchool = await School.findOne({ code: code.toUpperCase() });
    if (existingSchool) {
        throw new ApiError(400, 'School with this code already exists');
    }

    const school = new School({
        name,
        code: code.toUpperCase(),
        type,
        province,
        website,
        description,
        isActive: true
    });

    const savedSchool = await school.save();

    logger.info('New school created', {
        schoolId: savedSchool._id,
        code: savedSchool.code,
        name: savedSchool.name
    });

    res.status(201).json(
        new ApiResponse(201, savedSchool, 'School created successfully')
    );
});

/**
 * @desc    Update school (Admin only)  
 * @route   PUT /api/schools/:id
 * @access  Admin
 */
export const updateSchool = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { id } = req.params;
    const updates = req.body;

    const school = await School.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
    );

    if (!school) {
        throw new ApiError(404, 'School not found');
    }

    logger.info('School updated', {
        schoolId: school._id,
        code: school.code
    });

    res.status(200).json(
        new ApiResponse(200, school, 'School updated successfully')
    );
});

/**
 * @desc    Delete school (Admin only)
 * @route   DELETE /api/schools/:id  
 * @access  Admin
 */
export const deleteSchool = asyncHandler(async (req: Request, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const { id } = req.params;

    const school = await School.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!school) {
        throw new ApiError(404, 'School not found');
    }

    logger.info('School soft deleted', {
        schoolId: school._id,
        code: school.code
    });

    res.status(200).json(
        new ApiResponse(200, school, 'School deleted successfully')
    );
}); 