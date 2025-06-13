import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StudyMaterial, IStudyMaterial } from '../models/StudyMaterial';
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
export const getStudyMaterial = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { id } = req.params;
        const authRequest = req as AuthenticatedRequest;

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
            return res.json({
                success: false,
                message: "Study material not found"
            });
        }

        //check if material is public or user is the author
        if (!material.isPublic && (!authRequest.user || !material.author.equals(authRequest.user._id))) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this study material'
            });
        }

        material.incrementViews().catch(console.error);

        return res.json({
            success: true,
            data: material
        })
    } catch (error: any) {
        console.error('Error fetching study material:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching study material',
            error: error.message
        });
    }
}

//get material by category
export const getMaterialsByCategory = async (req: Request, res: Response): Promise<Respone | void> => {
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
}



