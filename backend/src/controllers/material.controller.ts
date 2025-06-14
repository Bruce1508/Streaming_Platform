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

// ✅ Get user's uploaded materials
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



