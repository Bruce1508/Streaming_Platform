import { Request, Response } from 'express';
import { ProgramReview, ReviewLike } from '../models/ProgramReviews';
import { Program } from '../models/Program';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { createNotification } from './notification.controllers';
import mongoose from 'mongoose';

// ===== CREATE REVIEW =====
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { programId, year, criteriaRatings, comment } = req.body;
    const userId = req.user?._id;

    // Validate required fields
    if (!programId || !year || !criteriaRatings) {
        throw new ApiError(400, 'Program ID, year, and criteria ratings are required');
    }

    // Validate program exists
    const program = await Program.findById(programId);
    if (!program) {
        throw new ApiError(404, 'Program not found');
    }

    // Check if user already reviewed this program
    const existingReview = await ProgramReview.findOne({ 
        program: programId, 
        user: userId 
    });
    
    if (existingReview) {
        throw new ApiError(400, 'You have already reviewed this program. Use update instead.');
    }

    // Validate criteria ratings
    const requiredCriteria = [
        'TeachingQuality', 'FacultySupport', 'LearningEnvironment', 
        'LibraryResources', 'StudentSupport', 'CampusLife', 'OverallExperience'
    ];
    
    for (const criteria of requiredCriteria) {
        if (!criteriaRatings[criteria] || criteriaRatings[criteria] < 1 || criteriaRatings[criteria] > 5) {
            throw new ApiError(400, `${criteria} rating must be between 1 and 5`);
        }
    }

    // Create review
    const review = await ProgramReview.create({
        program: programId,
        user: userId,
        year,
        criteriaRatings,
        comment: comment || ''
    });

    // Update program review statistics
    await updateProgramReviewStats(programId);

    // Populate user info for response
    const populatedReview = await ProgramReview.findById(review._id)
        .populate('user', 'fullName profilePic')
        .populate('program', 'name code');

    res.status(201).json(
        new ApiResponse(201, populatedReview, 'Review created successfully')
    );
});

// ===== GET PROGRAM REVIEWS =====
export const getProgramReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { programId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const userId = req.user?._id; // For checking user's likes/dislikes

    // Validate program exists
    const program = await Program.findById(programId);
    if (!program) {
        throw new ApiError(404, 'Program not found');
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const sortOption: { [key: string]: 1 | -1 } = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

    // Get reviews and calculate averages
    const [reviews, total, averages, userLikes] = await Promise.all([
        ProgramReview.find({ program: programId })
            .populate('user', 'fullName profilePic academic')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        
        ProgramReview.countDocuments({ program: programId }),
        
        calculateCriteriaAverages(programId),
        
        // Get user's likes/dislikes for these reviews
        userId ? ReviewLike.find({ user: userId }).lean() : []
    ]);

    // Add user interaction info to reviews
    const reviewsWithUserInfo = reviews.map(review => {
        const userLike = userLikes.find(like => like.review.toString() === review._id.toString());
        return {
            ...review,
            userLiked: userLike?.type === 'like',
            userDisliked: userLike?.type === 'dislike'
        };
    });

    res.status(200).json(
        new ApiResponse(200, {
            reviews: reviewsWithUserInfo,
            averages,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        }, 'Reviews retrieved successfully')
    );
});

// ===== UPDATE REVIEW =====
export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reviewId } = req.params;
    const { year, criteriaRatings, comment } = req.body;
    const userId = req.user?._id;

    const review = await ProgramReview.findOne({ 
        _id: reviewId, 
        user: userId 
    });

    if (!review) {
        throw new ApiError(404, 'Review not found or you are not authorized to update it');
    }

    // Validate criteria ratings if provided
    if (criteriaRatings) {
        const requiredCriteria = [
            'TeachingQuality', 'FacultySupport', 'LearningEnvironment', 
            'LibraryResources', 'StudentSupport', 'CampusLife', 'OverallExperience'
        ];
        
        for (const criteria of requiredCriteria) {
            if (criteriaRatings[criteria] && (criteriaRatings[criteria] < 1 || criteriaRatings[criteria] > 5)) {
                throw new ApiError(400, `${criteria} rating must be between 1 and 5`);
            }
        }
    }

    // Update review
    const updatedReview = await ProgramReview.findByIdAndUpdate(
        reviewId,
        {
            ...(year && { year }),
            ...(criteriaRatings && { criteriaRatings }),
            ...(comment !== undefined && { comment })
        },
        { new: true, runValidators: true }
    ).populate('user', 'fullName profilePic');

    // Update program review statistics
    await updateProgramReviewStats(review.program.toString());

    res.status(200).json(
        new ApiResponse(200, updatedReview, 'Review updated successfully')
    );
});

// ===== DELETE REVIEW =====
export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user?._id;

    const review = await ProgramReview.findOne({ 
        _id: reviewId, 
        user: userId 
    });

    if (!review) {
        throw new ApiError(404, 'Review not found or you are not authorized to delete it');
    }

    const programId = review.program.toString();
    await ProgramReview.findByIdAndDelete(reviewId);

    // Update program review statistics
    await updateProgramReviewStats(programId);

    res.status(200).json(
        new ApiResponse(200, null, 'Review deleted successfully')
    );
});

// ===== GET USER'S REVIEW FOR PROGRAM =====
export const getUserReviewForProgram = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { programId } = req.params;
    const userId = req.user?._id;

    const review = await ProgramReview.findOne({
        program: programId,
        user: userId
    }).populate('user', 'fullName profilePic');

    if (!review) {
        return res.status(404).json(
            new ApiResponse(404, null, 'No review found for this program')
        );
    }

    res.status(200).json(
        new ApiResponse(200, review, 'User review retrieved successfully')
    );
});

// ===== HELPER FUNCTIONS =====

/**
 * Calculate average ratings for each criteria for a program
 */
async function calculateCriteriaAverages(programId: string) {
    const reviews = await ProgramReview.find({ program: programId });
    
    if (reviews.length === 0) {
        return {
            TeachingQuality: 0,
            FacultySupport: 0,
            LearningEnvironment: 0,
            LibraryResources: 0,
            StudentSupport: 0,
            CampusLife: 0,
            OverallExperience: 0,
            totalReviews: 0
        };
    }

    const criteria = [
        'TeachingQuality', 'FacultySupport', 'LearningEnvironment', 
        'LibraryResources', 'StudentSupport', 'CampusLife', 'OverallExperience'
    ];

    const averages: any = { totalReviews: reviews.length };

    criteria.forEach(criterion => {
        const sum = reviews.reduce((acc, review) => 
            acc + (review.criteriaRatings[criterion as keyof typeof review.criteriaRatings] || 0), 0
        );
        averages[criterion] = Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
    });

    return averages;
}

/**
 * Update program's review statistics (optional - for caching)
 */
async function updateProgramReviewStats(programId: string) {
    const averages = await calculateCriteriaAverages(programId);
    
    // You can store these averages in Program model for faster queries
    // For now, we'll just recalculate on each request
    
    // Optional: Update Program model with review stats
    // await Program.findByIdAndUpdate(programId, {
    //     'reviewStats.averages': averages,
    //     'reviewStats.totalReviews': averages.totalReviews,
    //     'reviewStats.lastUpdated': new Date()
    // });
}

// ===== LIKE/DISLIKE REVIEW =====
export const likeReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user?._id;
    const action = 'like';

    // Validate review exists
    const review = await ProgramReview.findById(reviewId);
    if (!review) {
        throw new ApiError(404, 'Review not found');
    }

    // Check if user already liked/disliked this review
    const existingLike = await ReviewLike.findOne({ 
        review: reviewId, 
        user: userId 
    });

    if (existingLike) {
        if (existingLike.type === action) {
            // Remove like
            await ReviewLike.findByIdAndDelete(existingLike._id);
            await ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: -1 }
            });
            
            return res.status(200).json(
                new ApiResponse(200, null, 'Like removed successfully')
            );
        } else {
            // Change dislike to like
            existingLike.type = action;
            await existingLike.save();
            
            await ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: 1, dislikes: -1 }
            });
            
            return res.status(200).json(
                new ApiResponse(200, null, 'Changed to like successfully')
            );
        }
    } else {
        // Create new like
        await ReviewLike.create({
            review: reviewId,
            user: userId,
            type: action
        });
        
        await ProgramReview.findByIdAndUpdate(reviewId, {
            $inc: { likes: 1 }
        });

        // Send notification to review author
        if (review.user.toString() !== userId?.toString()) {
            await createNotification({
                recipient: review.user.toString(),
                sender: userId?.toString(),
                type: 'like',
                title: 'Your review was liked',
                message: 'Someone liked your program review.',
                relatedId: reviewId,
                relatedModel: 'ProgramReview'
            });
        }
        
        return res.status(200).json(
            new ApiResponse(200, null, 'Review liked successfully')
        );
    }
});

export const dislikeReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user?._id;
    const action = 'dislike';

    // Validate review exists
    const review = await ProgramReview.findById(reviewId);
    if (!review) {
        throw new ApiError(404, 'Review not found');
    }

    // Check if user already liked/disliked this review
    const existingLike = await ReviewLike.findOne({ 
        review: reviewId, 
        user: userId 
    });

    if (existingLike) {
        if (existingLike.type === action) {
            // Remove dislike
            await ReviewLike.findByIdAndDelete(existingLike._id);
            await ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { dislikes: -1 }
            });
            
            return res.status(200).json(
                new ApiResponse(200, null, 'Dislike removed successfully')
            );
        } else {
            // Change like to dislike
            existingLike.type = action;
            await existingLike.save();
            
            await ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { dislikes: 1, likes: -1 }
            });
            
            return res.status(200).json(
                new ApiResponse(200, null, 'Changed to dislike successfully')
            );
        }
    } else {
        // Create new dislike
        await ReviewLike.create({
            review: reviewId,
            user: userId,
            type: action
        });
        
        await ProgramReview.findByIdAndUpdate(reviewId, {
            $inc: { dislikes: 1 }
        });
        
        return res.status(200).json(
            new ApiResponse(200, null, 'Review disliked successfully')
        );
    }
}); 