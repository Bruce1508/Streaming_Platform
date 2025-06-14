import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StudyMaterial, IStudyMaterial } from '../models/Material';
import User, { IUser } from '../models/User';

type AuthenticatedRequest = Request & {
    user?: IUser;
};

// Interface for query parameters
interface StudyMaterialQuery {
    category?: string;
    language?: string;
    level?: string;
    tags?: string;
    author?: string;
    sort?: string;
    page?: string;
    limit?: string;
    search?: string;
}

//get general material
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

        const material = await StudyMaterial.findById(id)
            .populate('author', 'username profilePicture')
            .populate('comments.user', 'username profilePicture')
            .exec();

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // Check if material is public or user is the author
        if (!material.isPublic && (!authReq.user || !material.author.equals(authReq.user._id))) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this study material'
            });
        }

        // Increment views (async, don't wait)
        material.incrementViews().catch(console.error);

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

//get material by category
export const getMaterialsByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { category } = req.params;
        const { language, level, limit = '20' } = req.query as StudyMaterialQuery; //just language, limit, level

        const materials = await StudyMaterial.findByCategory(category, {
            filter: {
                ...(language && { language: language.toLowerCase() }),
                ...(level && { level })
            },
            limit: parseInt(limit),
            sort: { averageRating: -1, views: -1 }
        });

        const totalCount = await StudyMaterial.countDocuments({
            category,
            status: 'published',
            isPublic: true,
            ...(language && { language: language.toLowerCase() }),
            ...(level && { level })
        })

        const avgRatingResult = await StudyMaterial.aggregate([
            {
                $match: {
                    category,
                    status: 'published',
                    isPublic: true,
                    ...(language && { language: language.toLowerCase() }),
                    ...(level && { level })
                }
            },
            { $group: { _id: null, avgRating: { $avg: '$averageRating' } } }
        ]);

        return res.json({
            success: true,
            data: {
                category,
                materials,
                stats: {
                    totalMaterials: totalCount,
                    averageRating: avgRatingResult[0]?.avgRating || 0
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

//Save study material
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

        // Check if already saved
        if (authReq.user.savedMaterials.includes(new mongoose.Types.ObjectId(id))) {
            return res.status(400).json({
                success: false,
                message: 'Material already saved'
            });
        }

        // Save material
        await authReq.user.saveMaterial(new mongoose.Types.ObjectId(id));

        // Increment saves count
        material.saves += 1;
        await material.save();

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

//Remove saved study material
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

        //check if material is saved 
        if (!authReq.user.savedMaterials.includes(new mongoose.Types.ObjectId(id))) {
            return res.status(400).json({
                success: false,
                message: 'Material not in saved list'
            });
        }

        await authReq.user.unsaveMaterial(new mongoose.Types.ObjectId(id));

        // Decrement saves count
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
        console.error("Error in removing saved material: ", error);
        return res.status(500).json({
            success: false,
            message: 'Error removing saved materials',
            error: error.message
        });
    }
}

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

        // Can't rate own material
        if (material.author.equals(authReq.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot rate your own study material'
            });
        }

        if (!authReq.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user session'
            });
        }

        // Add/update rating
        await material.addRating(authReq.user._id, parseInt(rating));

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

export const addComment = async (req: Request, res: Response): Promise<Response|any> => {
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
            return res.status(404).json({
                success: false,
                message: "Comment content is required"
            });
        }

        const material = await StudyMaterial.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material is not found'
            });
        }

        material.comments.push({
            user: authReq.user._id,
            content: content.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await material.save();

        // Populate the new comment
        const updatedMaterial = await StudyMaterial.findById(id)
            .populate('comments.user', 'username profilePicture')
            .exec();

        const newComment = updatedMaterial?.comments[updatedMaterial.comments.length - 1];

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        });
    } catch (error: any) {
        console.error("Fail to add comment from backend server: ", error);
        return res.status(500).json({
            success: false,
            message: "Error adding comment from backend server",
            error: error.message
        })
    }
}

export const getUserSavedMaterials = async (req: Request, res: Response): Promise <Response|any> => {
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
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                },
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
        console.error("Fail to get user saved materials from backend server: ", error);
        return res.status(500).json({
            success: false,
            message: "Error get saved materials from backend server",
            error: error.message
        })
    }
}

//  Get user's uploaded materials
export const getUserUploadedMaterials = async (req: Request, res: Response): Promise<Response|any> => {
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
            .populate('author', 'username profilePicture')
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

export const getStudyMaterials = async (req: Request, res: Response): Promise <Response|any> => {
    try {
        const {
            page = '1',
            limit = '12',
            search,
            category,
            language,
            level,
            tags,
            author,
            sort = 'createdAt'
        } = req.query as StudyMaterialQuery;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const filter: any = {
            status: 'published',
            isPublic: true
        };

        // Add search functionality
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Add category filter
        if (category) {
            filter.category = category;
        }

        // Add language filter
        if (language) {
            filter.language = language.toLowerCase();
        }

        // Add level filter
        if (level) {
            filter.level = level;
        }

        // Add tags filter
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filter.tags = { $in: tagArray };
        }

        // Add author filter
        if (author) {
            filter.author = author;
        }

        // Build sort object
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
            default:
                sortObj = { createdAt: -1 };
        }

        // Execute query with pagination
        const materials = await StudyMaterial.find(filter)
            .populate('author', 'username profilePicture')
            .sort(sortObj)
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .exec();

        // Get total count for pagination
        const total = await StudyMaterial.countDocuments(filter);

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
                },
                stats: stats[0] || {
                    totalMaterials: 0,
                    avgRating: 0,
                    totalViews: 0,
                    totalSaves: 0
                },
                filters: {
                    search,
                    category,
                    language,
                    level,
                    tags,
                    author,
                    sort
                }
            }
        });


    } catch (error: any) {
        console.error("Error in getUserStudyMaterials from backend server: ", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching study materials",
            error: error.message
        });
    }
}

export const createStudyMaterial = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const {
            title,
            description,
            category,
            language,
            level,
            tags,
            fileUrl,
            fileType,
            fileSize,
            isPublic = true
        } = req.body;

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Validate required fields
        if (!title || !description || !category || !language || !level) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, category, language, and level are required'
            });
        }

        // Validate file if provided
        if (fileUrl && (!fileType || !fileSize)) {
            return res.status(400).json({
                success: false,
                message: 'File type and size are required when file is provided'
            });
        }

        // Process tags
        const processedTags = tags ? 
            tags.split(',').map((tag: string) => tag.trim().toLowerCase()).filter((tag: string) => tag.length > 0) : 
            [];

        // Create new study material
        const newMaterial = new StudyMaterial({
            title: title.trim(),
            description: description.trim(),
            category: category.toLowerCase(),
            language: language.toLowerCase(),
            level,
            tags: processedTags,
            author: authReq.user._id,
            fileUrl: fileUrl || null,
            fileType: fileType || null,
            fileSize: fileSize || null,
            isPublic,
            status: 'published', // or 'draft' based on your needs
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newMaterial.save();

        // Populate author info
        const populatedMaterial = await StudyMaterial.findById(newMaterial._id)
            .populate('author', 'username profilePicture')
            .exec();

        return res.status(201).json({
            success: true,
            message: 'Study material created successfully',
            data: populatedMaterial
        });

    } catch (error: any) {
        console.error('Error creating study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating study material',
            error: error.message
        });
    }
};

export const updateStudyMaterial = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id } = req.params;
        const {
            title,
            description,
            category,
            language,
            level,
            tags,
            fileUrl,
            fileType,
            fileSize,
            isPublic
        } = req.body;

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

        // Check if user is the author
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only edit your own materials'
            });
        }

        // Update fields if provided
        const updateData: any = {
            updatedAt: new Date()
        };

        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (category) updateData.category = category.toLowerCase();
        if (language) updateData.language = language.toLowerCase();
        if (level) updateData.level = level;
        if (tags) {
            updateData.tags = tags.split(',').map((tag: string) => tag.trim().toLowerCase()).filter((tag: string) => tag.length > 0);
        }
        if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
        if (fileType !== undefined) updateData.fileType = fileType;
        if (fileSize !== undefined) updateData.fileSize = fileSize;
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        const updatedMaterial = await StudyMaterial.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'username profilePicture');

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

        // Check if user is the author
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own materials'
            });
        }

        // Remove material from all users' saved lists
        await User.updateMany(
            { savedMaterials: id },
            { $pull: { savedMaterials: id } }
        );

        // Delete the material
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





