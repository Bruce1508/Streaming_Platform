import { Request, Response } from 'express';
import { ProgramReview, ReviewLike } from '../models/ProgramReviews';
import { Program } from '../models/Program';
import User from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { createNotification } from './notification.controllers';
import { calculateAverageRating, getGradeFromScore, calculateGradeDistribution } from '../utils/gradeCalculator';

// ===== CREATE REVIEW =====
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { programId, currentSemester, ratings, takeTheCourseAgain, comment } = req.body;
    const userId = req.user?._id;

    // Validate required fields
    if (!programId || !currentSemester || !ratings || takeTheCourseAgain === undefined) {
        throw new ApiError(400, 'Program ID, current s868emester, ratings, and takeTheCourseAgain are required');
    }

    // Validate program exists (find by code instead of _id)
    const program = await Program.findOne({ code: programId });
    if (!program) {
        throw new ApiError(404, 'Program not found');
    }

    // Get user info for author
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Check if user already reviewed this program (use program ObjectId)
    const existingReview = await ProgramReview.findOne({ 
        program: program._id, 
        user: userId 
    });
    
    if (existingReview) {
        throw new ApiError(400, 'You have already reviewed this program. Use update instead.');
    }

    // Validate ratings
    const { instructorRating, contentQualityRating, practicalValueRating } = ratings;
    
    if (!instructorRating || instructorRating < 0 || instructorRating > 100) {
        throw new ApiError(400, 'Instructor rating must be between 0 and 100');
    }
    if (!contentQualityRating || contentQualityRating < 0 || contentQualityRating > 100) {
        throw new ApiError(400, 'Content quality rating must be between 0 and 100');
    }
    if (!practicalValueRating || practicalValueRating < 0 || practicalValueRating > 100) {
        throw new ApiError(400, 'Practical value rating must be between 0 and 100');
    }

    // Create review (use program ObjectId)
    const review = await ProgramReview.create({
        program: program._id,
        user: userId,
        currentSemester,
        ratings: {
            instructorRating,
            contentQualityRating,
            practicalValueRating
        },
        takeTheCourseAgain,
        author: {
            fullName: user.fullName,
            email: user.email
        },
        comment: comment || ''
    });

    // Update program review statistics (use program ObjectId)
    await updateProgramReviewStats((program._id as any).toString());

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

    // Validate program exists (find by code instead of _id)
    const program = await Program.findOne({ code: programId });
    if (!program) {
        throw new ApiError(404, 'Program not found');
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const sortOption: { [key: string]: 1 | -1 } = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

    // Get reviews and calculate averages (use program ObjectId)
    const [reviews, total, averages, userLikes] = await Promise.all([
        ProgramReview.find({ program: program._id })
            .populate('user', 'fullName profilePic academic')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        
        ProgramReview.countDocuments({ program: program._id }),
        
        calculateCriteriaAverages((program._id as any).toString()),
        
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
    const { currentSemester, ratings, takeTheCourseAgain, comment } = req.body;
    const userId = req.user?._id;

    const review = await ProgramReview.findOne({ 
        _id: reviewId, 
        user: userId 
    });

    if (!review) {
        throw new ApiError(404, 'Review not found or you are not authorized to update it');
    }

    // Validate ratings if provided
    if (ratings) {
        const { instructorRating, contentQualityRating, practicalValueRating } = ratings;
        
        if (instructorRating !== undefined && (instructorRating < 0 || instructorRating > 100)) {
            throw new ApiError(400, 'Instructor rating must be between 0 and 100');
        }
        if (contentQualityRating !== undefined && (contentQualityRating < 0 || contentQualityRating > 100)) {
            throw new ApiError(400, 'Content quality rating must be between 0 and 100');
        }
        if (practicalValueRating !== undefined && (practicalValueRating < 0 || practicalValueRating > 100)) {
            throw new ApiError(400, 'Practical value rating must be between 0 and 100');
        }
    }

    // Update review
    const updatedReview = await ProgramReview.findByIdAndUpdate(
        reviewId,
        {
            ...(currentSemester && { currentSemester }),
            ...(ratings && { ratings }),
            ...(takeTheCourseAgain !== undefined && { takeTheCourseAgain }),
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

    // Find program by code first
    const program = await Program.findOne({ code: programId });
    if (!program) {
        throw new ApiError(404, 'Program not found');
    }

    const review = await ProgramReview.findOne({
        program: program._id,
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

// Calculate criteria averages for a program
async function calculateCriteriaAverages(programId: string) {
    const reviews = await ProgramReview.find({ program: programId });
    
    if (reviews.length === 0) {
        return {
            averageRating: 0,
            instructorAverage: 0,
            contentQualityAverage: 0,
            practicalValueAverage: 0,
            gradeDistribution: calculateGradeDistribution([]),
            totalReviews: 0,
            takeAgainPercentage: 0
        };
    }

    const totals = reviews.reduce((acc, review) => ({
        instructor: acc.instructor + review.ratings.instructorRating,
        contentQuality: acc.contentQuality + review.ratings.contentQualityRating,
        practicalValue: acc.practicalValue + review.ratings.practicalValueRating,
        takeAgain: acc.takeAgain + (review.takeTheCourseAgain ? 1 : 0)
    }), { instructor: 0, contentQuality: 0, practicalValue: 0, takeAgain: 0 });

    const instructorAverage = Math.round(totals.instructor / reviews.length);
    const contentQualityAverage = Math.round(totals.contentQuality / reviews.length);
    const practicalValueAverage = Math.round(totals.practicalValue / reviews.length);
    const overallAverage = Math.round((instructorAverage + contentQualityAverage + practicalValueAverage) / 3);
    const takeAgainPercentage = Math.round((totals.takeAgain / reviews.length) * 100);

    return {
        averageRating: overallAverage,
        instructorAverage,
        contentQualityAverage,
        practicalValueAverage,
        gradeDistribution: calculateGradeDistribution(reviews),
        totalReviews: reviews.length,
        takeAgainPercentage
    };
}

// Update program review statistics
async function updateProgramReviewStats(programId: string) {
    // This function can be used to update cached statistics if needed
    // For now, we calculate on-demand in getProgramReviews
    return;
}

// ===== LIKE/DISLIKE FUNCTIONS =====
export const likeReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user?._id;

    const review = await ProgramReview.findById(reviewId);
    if (!review) {
        throw new ApiError(404, 'Review not found');
    }

    // Check if user already liked/disliked this review
    const existingLike = await ReviewLike.findOne({ review: reviewId, user: userId });
    
    if (existingLike) {
        if (existingLike.type === 'like') {
            // Remove like
            await ReviewLike.findByIdAndDelete(existingLike._id);
            await ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: -1 }
            });
        } else {
            // Change from dislike to like
            await ReviewLike.findByIdAndUpdate(existingLike._id, { type: 'like' });
            await ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: 1, dislikes: -1 }
            });
        }
    } else {
        // Add new like
        await ReviewLike.create({ review: reviewId, user: userId, type: 'like' });
        await ProgramReview.findByIdAndUpdate(reviewId, {
            $inc: { likes: 1 }
        });

        // Create notification for review author
        await createNotification({
            recipient: review.user.toString(),
            sender: userId?.toString(),
            type: 'like',
            title: 'Your review received a like',
            message: 'Someone liked your program review',
            relatedId: reviewId,
            relatedModel: 'ProgramReview'
        });
    }

    res.status(200).json(
        new ApiResponse(200, null, 'Review liked successfully')
    );
});

export const dislikeReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user?._id;

    const review = await ProgramReview.findById(reviewId);
    if (!review) {
        throw new ApiError(404, 'Review not found');
    }

    // Check if user already liked/disliked this review
    const existingLike = await ReviewLike.findOne({ review: reviewId, user: userId });
    
    if (existingLike) {
        if (existingLike.type === 'dislike') {
            // Remove dislike
            await ReviewLike.findByIdAndDelete(existingLike._id);
            await ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { dislikes: -1 }
            });
        } else {
            // Change from like to dislike
            await ReviewLike.findByIdAndUpdate(existingLike._id, { type: 'dislike' });
            await ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: -1, dislikes: 1 }
            });
        }
    } else {
        // Add new dislike
        await ReviewLike.create({ review: reviewId, user: userId, type: 'dislike' });
        await ProgramReview.findByIdAndUpdate(reviewId, {
            $inc: { dislikes: 1 }
        });
    }

    res.status(200).json(
        new ApiResponse(200, null, 'Review disliked successfully')
    );
}); 