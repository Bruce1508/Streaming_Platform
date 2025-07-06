// backend/src/controllers/material.controller.ts - ENHANCED WITH UTILS
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import StudyMaterial, { IStudyMaterial } from '../models/StudyMaterial';
import User, { IUser } from '../models/User';
import { 
    extractPagination, 
    buildMongoQuery, 
    createPaginatedResponse,
    logApiRequest 
} from '../utils/Api.utils';
import { 
    formatFileSize, 
    truncate,
    generateSlug,
    capitalize 
} from '../utils/Format.utils';
import { 
    cacheStats, 
    getCachedStats,
    generateCacheKey,
    cache 
} from '../utils/Cache.utils';
import { 
    searchMaterials as searchMaterialsUtil,
    buildAdvancedSearchQuery 
} from '../utils/Search.utils';
import { generateRandomFileName } from '../utils/Random.utils';

type AuthenticatedRequest = Request & {
    user?: IUser;
};

interface StudyMaterialQuery {
    category?: string;
    language?: string;
    difficulty?: string;
    tags?: string;
    author?: string;
    sort?: string;
    page?: string;
    limit?: string;
    search?: string;
    school?: string;
    program?: string;
    course?: string;
}

// ✅ Enhanced getStudyMaterialById with caching
export const getStudyMaterialById = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { id } = req.params;
        const authReq = req as AuthenticatedRequest;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        // ✅ Try cache first
        const cacheKey = generateCacheKey('material', id);
        const cachedMaterial = cache.get(cacheKey);
        
        if (cachedMaterial) {
            return res.json({
                success: true,
                data: cachedMaterial
            });
        }

        const material = await StudyMaterial.findById(id)
            .populate('author', 'fullName profilePic email')
            .populate('academic.school', 'name location')
            .populate('academic.program', 'name code')
            .populate('comments.user', 'fullName profilePic')
            .exec();

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // Check access permissions
        if (!material.isPublic && (!authReq.user || !material.author.equals(authReq.user._id))) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this study material'
            });
        }

        // Increment views using instance method
        await material.incrementViews();

        // ✅ Cache the material
        cache.set(cacheKey, material, 600); // 10 minutes

        return res.json({
            success: true,
            data: material
        });

    } catch (error: any) {
        console.error('Error fetching study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching study material',
            error: error.message
        });
    }
};

// ✅ Enhanced getAllMaterials with comprehensive utils integration
export const getStudyMaterials = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        // ✅ Log API request
        logApiRequest(authReq);

        const {
            page = '1',
            limit = '12',
            search,
            category,
            difficulty,
            tags,
            author,
            school,
            program,
            course,
            sort = 'createdAt'
        } = req.query as StudyMaterialQuery;

        // ✅ Extract pagination with utils
        const { page: pageNum, limit: limitNum, skip } = extractPagination(req);

        // ✅ Check cache first
        const cacheKey = generateCacheKey('materials_list', JSON.stringify(req.query));
        const cached = getCachedStats(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        // ✅ Build query with utils
        const baseQuery = buildMongoQuery(req, ['category', 'difficulty', 'school', 'program', 'course']);
        
        const filter: any = {
            status: 'published',
            isPublic: true,
            ...baseQuery
        };

        // ✅ Enhanced search functionality
        if (search) {
            filter.$text = { $search: search };
        }

        // Academic filters
        if (author) filter.author = author;

        // Tags filter
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filter['metadata.tags'] = { $in: tagArray };
        }

        // ✅ Build sort object with utils
        let sortObj: any = {};
        switch (sort) {
            case 'newest':
                sortObj = { createdAt: -1 };
                break;
            case 'oldest':
                sortObj = { createdAt: 1 };
                break;
            case 'popular':
                sortObj = { views: -1, averageRating: -1 };
                break;
            case 'rating':
                sortObj = { averageRating: -1, totalRatings: -1 };
                break;
            case 'title':
                sortObj = { title: 1 };
                break;
            case 'relevance':
                sortObj = search ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
                break;
            default:
                sortObj = { createdAt: -1 };
        }

        // Execute query with comprehensive population
        const [materials, total] = await Promise.all([
            StudyMaterial.find(filter)
                .populate('author', 'fullName profilePic')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .sort(sortObj)
                .limit(limitNum)
                .skip(skip)
                .exec(),
            StudyMaterial.countDocuments(filter)
        ]);

        // ✅ Enhanced materials with formatting
        const enhancedMaterials = materials.map((material: any) => ({
            ...material.toObject(),
            // Add formatted fields
            truncatedDescription: material.description ? truncate(material.description, 150) : "",
            slug: generateSlug(material.title),
            // Format any file sizes if they exist
            formattedFileSize: material.fileSize ? formatFileSize(material.fileSize) : null
        }));

        // Get aggregated stats
        const stats = await StudyMaterial.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalMaterials: { $sum: 1 },
                    avgRating: { $avg: '$averageRating' },
                    totalViews: { $sum: '$views' },
                    totalSaves: { $sum: '$saves' }
                }
            }
        ]);

        // ✅ Create paginated response with utils
        const response = createPaginatedResponse(
            enhancedMaterials,
            total,
            pageNum,
            limitNum,
            'Study materials retrieved successfully'
        );

        // Add stats to response
        response.data.stats = stats[0] || {
            totalMaterials: 0,
            avgRating: 0,
            totalViews: 0,
            totalSaves: 0
        };

        response.data.filters = {
            search, category, difficulty, tags, author, school, program, course, sort
        };

        // ✅ Cache the response
        cacheStats(cacheKey, response, 300); // 5 minutes

        return res.json(response);

    } catch (error: any) {
        console.error("Error fetching study materials:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching study materials",
            error: error.message
        });
    }
};

// ✅ NEW: Enhanced search materials endpoint
export const searchMaterials = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        logApiRequest(authReq);

        // ✅ Use search utils
        const results = await searchMaterialsUtil(StudyMaterial, req.query);
        
        // ✅ Format results
        const enhancedResults = results.map((material: any) => ({
            ...material,
            truncatedDescription: material.description ? truncate(material.description, 150) : "",
            formattedFileSize: material.fileSize ? formatFileSize(material.fileSize) : null
        }));

        return res.json({
            success: true,
            data: {
                materials: enhancedResults,
                total: enhancedResults.length
            },
            message: 'Search completed successfully'
        });

    } catch (error: any) {
        console.error('Error in search materials:', error);
        return res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};

// ✅ Enhanced createStudyMaterial with formatting and random filename
export const createStudyMaterial = async (req: Request, res: Response): Promise<any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        logApiRequest(authReq);

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const {
            title,
            description,
            content,
            category,
            attachments = [],
            isPublic = true,
            status = 'published',
            // Academic context - all required
            school,
            program,
            course,
            semester,
            week,
            professor,
            // Metadata
            difficulty = 'beginner',
            completionTime,
            grade
        } = req.body;

        // Required fields validation
        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (!description?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }

        // Academic context validation (required)
        if (!school || !program || !course || !semester) {
            return res.status(400).json({
                success: false,
                message: "Academic context (school, program, course, semester) is required"
            });
        }

        if (!semester.term || !semester.year) {
            return res.status(400).json({
                success: false,
                message: "Semester term and year are required"
            });
        }

        // Validate ObjectIds (except course which is now string)
        if (!mongoose.Types.ObjectId.isValid(school) ||
            !mongoose.Types.ObjectId.isValid(program)) {
            return res.status(400).json({
                success: false,
                message: "Invalid school or program ID"
            });
        }

        // Validate course is not empty string
        if (!course || course.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Course is required"
            });
        }

        // ✅ Enhanced attachments with utils
        const processedAttachments = attachments.map((attachment: any) => ({
            ...attachment,
            // Generate random filename if not provided
            filename: attachment.filename || generateRandomFileName(attachment.originalName?.split('.').pop() || 'txt'),
            // Format file size
            formattedSize: attachment.size ? formatFileSize(attachment.size) : null
        }));

        // ✅ Create material with enhanced data
        const newMaterial = new StudyMaterial({
            title: capitalize(title.trim()),
            description: description.trim(),
            content: content?.trim(),
            author: authReq.user._id,
            category,

            // Required academic context
            academic: {
                school: new mongoose.Types.ObjectId(school),
                program: new mongoose.Types.ObjectId(program),
                course: course,
                semester: {
                    term: semester.term,
                    year: parseInt(semester.year)
                },
                ...(week && { week: parseInt(week) }),
                ...(professor && { professor: professor.trim() })
            },

            // Metadata
            metadata: {
                difficulty,
                ...(completionTime && { completionTime: parseInt(completionTime) }),
                ...(grade && { grade: grade.trim() }),
                isVerified: false,
                qualityScore: 0
            },

            attachments: processedAttachments,
            isPublic: Boolean(isPublic),
            status: status === 'draft' ? 'draft' : 'published',
            views: 0,
            saves: 0,
            ratings: [],
            comments: [],
            isFeatured: false,
            isReported: false,
            reportCount: 0
        });

        const savedMaterial = await newMaterial.save();

        // Update user stats
        await authReq.user.incrementUploadCount();

        // Populate for response
        await savedMaterial.populate([
            { path: 'author', select: 'fullName profilePic email' },
            { path: 'academic.school', select: 'name location' },
            { path: 'academic.program', select: 'name code' }
        ]);

        console.log('✅ Study material created:', {
            id: savedMaterial._id,
            title: savedMaterial.title,
            author: authReq.user.fullName,
            category: savedMaterial.category,
            course: savedMaterial.academic.course
        });

        return res.status(201).json({
            success: true,
            message: "Study material created successfully",
            data: savedMaterial
        });

    } catch (error: any) {
        console.error('❌ Create study material error:', error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate material detected"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create study material",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// ✅ Get materials by category - using static method
export const getMaterialsByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { category } = req.params;
        const { difficulty, limit = '20' } = req.query as StudyMaterialQuery;

        const options = {
            filter: {
                ...(difficulty && { 'metadata.difficulty': difficulty })
            },
            limit: parseInt(limit),
            sort: { averageRating: -1, views: -1 }
        };

        // ✅ Use static method from schema
        const materials = await StudyMaterial.findByCategory(category, options);

        const totalCount = await StudyMaterial.countDocuments({
            category,
            status: 'published',
            isPublic: true,
            ...(difficulty && { 'metadata.difficulty': difficulty })
        });

        return res.json({
            success: true,
            data: {
                category,
                materials,
                stats: {
                    totalMaterials: totalCount
                }
            }
        });

    } catch (error: any) {
        console.error('Error fetching materials by category:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching materials by category',
            error: error.message
        });
    }
}

// ✅ Save material to user's collection
export const saveMaterial = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Check if already saved
        if (authReq.user.savedMaterials.includes(new mongoose.Types.ObjectId(id))) {
            return res.status(400).json({
                success: false,
                message: 'Material already saved'
            });
        }

        // ✅ Use User instance method to save material
        await authReq.user.saveMaterial(new mongoose.Types.ObjectId(id));

        // ✅ Increment saves count in material
        material.saves += 1;
        await material.save();

        // ✅ Clear relevant caches
        const userCacheKey = generateCacheKey('user', authReq.user._id.toString());
        cache.del(userCacheKey);

        return res.json({
            success: true,
            message: 'Study material saved successfully'
        });

    } catch (error: any) {
        console.error('Error saving study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error saving study material',
            error: error.message
        });
    }
};

// ✅ Remove saved material
export const removeSavedMaterial = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        // ✅ Check if material is saved 
        if (!authReq.user.savedMaterials.includes(new mongoose.Types.ObjectId(id))) {
            return res.status(400).json({
                success: false,
                message: 'Material not in saved list'
            });
        }

        // ✅ Use User instance method to unsave material
        await authReq.user.unsaveMaterial(new mongoose.Types.ObjectId(id));

        // ✅ Decrement saves count
        const material = await StudyMaterial.findById(id);
        if (material && material.saves > 0) {
            material.saves -= 1;
            await material.save();
        }

        return res.json({
            success: true,
            message: 'Study material removed from saved list'
        });
    } catch (error: any) {
        console.error("Error removing saved material:", error);
        return res.status(500).json({
            success: false,
            message: 'Error removing saved materials',
            error: error.message
        });
    }
}

// ✅ Rate material
export const rateMaterial = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;
        const { rating } = req.body;

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Can't rate own material
        if (material.author.equals(authReq.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot rate your own study material'
            });
        }

        // ✅ Use instance method to add rating
        await material.addRating(authReq.user._id, parseInt(rating));

        // ✅ Update user stats
        authReq.user.studyStats.ratingsGiven += 1;
        await authReq.user.save();

        return res.json({
            success: true,
            message: 'Rating added successfully',
            data: {
                averageRating: material.averageRating,
                totalRatings: material.totalRatings
            }
        });

    } catch (error: any) {
        console.error('Error rating study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error rating study material',
            error: error.message
        });
    }
};

// ✅ Add comment
export const addComment = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;
        const { content } = req.body;

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        if (content.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 500 characters"
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Add comment to material
        material.comments.push({
            user: authReq.user._id,
            content: content.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await material.save();

        // ✅ Populate the new comment
        const updatedMaterial = await StudyMaterial.findById(id)
            .populate('comments.user', 'fullName profilePic')
            .exec();

        const newComment = updatedMaterial?.comments[updatedMaterial.comments.length - 1];

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        });
    } catch (error: any) {
        console.error("Error adding comment:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding comment",
            error: error.message
        })
    }
}

// ✅ Get user's saved materials
export const getUserSavedMaterials = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { page = '1', limit = '12' } = req.query as { page?: string; limit?: string };

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const user = await User.findById(authReq.user._id)
            .populate({
                path: 'savedMaterials',
                populate: [
                    {
                        path: 'author',
                        select: 'fullName profilePic'
                    },
                    {
                        path: 'academic.course',
                        select: 'code name'
                    }
                ],
                options: {
                    limit: limitNum,
                    skip: (pageNum - 1) * limitNum,
                    sort: { createdAt: -1 }
                }
            });

        const totalSaved = authReq.user.savedMaterials.length;

        return res.json({
            success: true,
            data: {
                materials: user?.savedMaterials || [],
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalSaved / limitNum),
                    totalItems: totalSaved,
                    hasNext: pageNum * limitNum < totalSaved,
                    hasPrev: pageNum > 1
                }
            }
        })
    } catch (error: any) {
        console.error("Error getting user saved materials:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting saved materials",
            error: error.message
        })
    }
}

// ✅ Get user's uploaded materials
export const getUserUploadedMaterials = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { page = '1', limit = '12', status } = req.query as {
            page?: string;
            limit?: string;
            status?: string;
        };

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const filter: any = { author: authReq.user._id };
        if (status) filter.status = status;

        const materials = await StudyMaterial.find(filter)
            .populate('author', 'fullName profilePic')
            .populate('academic.program', 'name')
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .exec();

        const total = await StudyMaterial.countDocuments(filter);

        return res.json({
            success: true,
            data: {
                materials,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalItems: total,
                    hasNext: pageNum * limitNum < total,
                    hasPrev: pageNum > 1
                }
            }
        });

    } catch (error: any) {
        console.error('Error fetching uploaded materials:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching uploaded materials',
            error: error.message
        });
    }
};

// ✅ Update study material
export const updateStudyMaterial = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;
        const updateData = req.body;

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Check ownership
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only edit your own materials'
            });
        }

        // ✅ Update with validation
        const updatedMaterial = await StudyMaterial.findByIdAndUpdate(
            id,
            {
                ...updateData,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate([
            { path: 'author', select: 'fullName profilePic' },
            { path: 'academic.school', select: 'name location' },
            { path: 'academic.program', select: 'name code' }
        ]);

        return res.json({
            success: true,
            message: 'Study material updated successfully',
            data: updatedMaterial
        });

    } catch (error: any) {
        console.error('Error updating study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating study material',
            error: error.message
        });
    }
};

// ✅ Delete study material
export const deleteStudyMaterial = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Check ownership
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own materials'
            });
        }

        // ✅ Remove from all users' saved lists
        await User.updateMany(
            { savedMaterials: id },
            { $pull: { savedMaterials: id } }
        );

        // ✅ Delete the material
        await StudyMaterial.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: 'Study material deleted successfully'
        });

    } catch (error: any) {
        console.error('Error deleting study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting study material',
            error: error.message
        });
    }
};

// ✅ Get materials by course (using static method)
export const getMaterialsByCourse = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { courseId } = req.params;
        const { limit = '20', sort = 'newest' } = req.query as StudyMaterialQuery;

        // Validate course is not empty string (course is now string, not ObjectId)
        if (!courseId || courseId.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            popular: { views: -1, averageRating: -1 },
            rating: { averageRating: -1, totalRatings: -1 }
        };

        const options = {
            limit: parseInt(limit),
            sort: sortOptions[sort as keyof typeof sortOptions] || sortOptions.newest
        };

        // ✅ Use static method
        const materials = await StudyMaterial.findByCourse(courseId, options);

        return res.json({
            success: true,
            data: {
                courseId,
                materials,
                count: materials.length
            }
        });

    } catch (error: any) {
        console.error('Error fetching materials by course:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching materials by course',
            error: error.message
        });
    }
};

// ✅ Get featured materials (using static method)
export const getFeaturedMaterials = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { limit = '10' } = req.query as { limit?: string };

        // ✅ Use static method
        const materials = await StudyMaterial.findFeatured(parseInt(limit));

        return res.json({
            success: true,
            data: {
                materials,
                count: materials.length
            }
        });

    } catch (error: any) {
        console.error('Error fetching featured materials:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching featured materials',
            error: error.message
        });
    }
};

// ✅ Get popular materials (using static method)
export const getPopularMaterials = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { limit = '10' } = req.query as { limit?: string };

        // ✅ Use static method
        const materials = await StudyMaterial.getPopularMaterials(parseInt(limit));

        return res.json({
            success: true,
            data: {
                materials,
                count: materials.length
            }
        });

    } catch (error: any) {
        console.error('Error fetching popular materials:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching popular materials',
            error: error.message
        });
    }
};

// ✅ Get materials by program (using static method)
export const getMaterialsByProgram = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { programId } = req.params;
        const { limit = '20', category, difficulty } = req.query as StudyMaterialQuery;
        if (!mongoose.Types.ObjectId.isValid(programId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid program ID'
            });
        }

        const options = {
            filter: {
                ...(category && { category }),
                ...(difficulty && { 'metadata.difficulty': difficulty })
            },
            limit: parseInt(limit),
            sort: { averageRating: -1, createdAt: -1 }
        };

        // ✅ Use static method
        const materials = await StudyMaterial.findByProgram(programId, options);

        return res.json({
            success: true,
            data: {
                programId,
                materials,
                count: materials.length
            }
        });

    } catch (error: any) {
        console.error('Error fetching materials by program:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching materials by program',
            error: error.message
        });
    }
};

// ✅ Remove rating from material
export const removeRating = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Check if user has rated this material
        const hasRated = material.ratings.some(rating => rating.user.equals(authReq.user!._id));
        if (!hasRated) {
            return res.status(400).json({
                success: false,
                message: 'You have not rated this material'
            });
        }

        // ✅ Use instance method to remove rating
        await material.removeRating(authReq.user!._id);

        // ✅ Update user stats
        if (authReq.user.studyStats.ratingsGiven > 0) {
            authReq.user.studyStats.ratingsGiven -= 1;
            await authReq.user.save();
        }

        return res.json({
            success: true,
            message: 'Rating removed successfully',
            data: {
                averageRating: material.averageRating,
                totalRatings: material.totalRatings
            }
        });

    } catch (error: any) {
        console.error('Error removing rating:', error);
        return res.status(500).json({
            success: false,
            message: 'Error removing rating',
            error: error.message
        });
    }
};

// ✅ Delete comment
export const deleteComment = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id, commentId } = req.params;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid material or comment ID'
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Check ownership (user can delete own comments, author can delete any comment on their material)
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own comments'
            });
        }

        // ✅ Remove comment
        const index = material.comments.findIndex((c: any) => c._id?.toString() === commentId);
        if (index !== -1) {
            material.comments.splice(index, 1);
        }
        await material.save();

        return res.json({
            success: true,
            message: 'Comment deleted successfully'
        });

    } catch (error: any) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message
        });
    }
};

// ✅ Update comment
export const updateComment = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id, commentId } = req.params;
        const { content } = req.body;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        if (content.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot exceed 500 characters'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid material or comment ID'
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Check ownership
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only edit your own comments'
            });
        }

        // ✅ Update comment
        const comment = material.comments.find((c: any) => c._id?.toString() === commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        comment.content = content.trim();
        comment.updatedAt = new Date();
        await material.save();

        // ✅ Populate updated comment
        await material.populate('comments.user', 'fullName profilePic');
        const updatedComment = material.comments.find((c: any) => c._id?.toString() === commentId);

        return res.json({
            success: true,
            message: 'Comment updated successfully',
            data: updatedComment
        });

    } catch (error: any) {
        console.error('Error updating comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating comment',
            error: error.message
        });
    }
};

// ✅ Report material
export const reportMaterial = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;
        const { reason } = req.body;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!reason || reason.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Report reason is required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // ✅ Can't report own material
        if (material.author.equals(authReq.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot report your own study material'
            });
        }

        // ✅ Update report status
        material.isReported = true;
        material.reportCount += 1;
        await material.save();

        // TODO: In a real app, you might want to create a separate Report model
        // to track who reported what and for what reason

        return res.json({
            success: true,
            message: 'Study material reported successfully. Thank you for helping maintain quality content.'
        });

    } catch (error: any) {
        console.error('Error reporting material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error reporting material',
            error: error.message
        });
    }
};

// ✅ Get material statistics
export const getMaterialStats = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }

        const material = await StudyMaterial.findById(id)
            .select('views saves averageRating totalRatings commentCount')
            .exec();

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        return res.json({
            success: true,
            data: {
                views: material.views,
                saves: material.saves,
                averageRating: material.averageRating,
                totalRatings: material.totalRatings,
                commentCount: material.commentCount
            }
        });

    } catch (error: any) {
        console.error('Error fetching material stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching material stats',
            error: error.message
        });
    }
};