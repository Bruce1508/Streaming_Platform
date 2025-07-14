"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dislikeReview = exports.likeReview = exports.getUserReviewForProgram = exports.deleteReview = exports.updateReview = exports.getProgramReviews = exports.createReview = void 0;
const ProgramReviews_1 = require("../models/ProgramReviews");
const Program_1 = require("../models/Program");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const notification_controllers_1 = require("./notification.controllers");
// ===== CREATE REVIEW =====
exports.createReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { programId, year, criteriaRatings, comment } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // Validate required fields
    if (!programId || !year || !criteriaRatings) {
        throw new ApiError_1.ApiError(400, 'Program ID, year, and criteria ratings are required');
    }
    // Validate program exists
    const program = yield Program_1.Program.findById(programId);
    if (!program) {
        throw new ApiError_1.ApiError(404, 'Program not found');
    }
    // Check if user already reviewed this program
    const existingReview = yield ProgramReviews_1.ProgramReview.findOne({
        program: programId,
        user: userId
    });
    if (existingReview) {
        throw new ApiError_1.ApiError(400, 'You have already reviewed this program. Use update instead.');
    }
    // Validate criteria ratings
    const requiredCriteria = [
        'TeachingQuality', 'FacultySupport', 'LearningEnvironment',
        'LibraryResources', 'StudentSupport', 'CampusLife', 'OverallExperience'
    ];
    for (const criteria of requiredCriteria) {
        if (!criteriaRatings[criteria] || criteriaRatings[criteria] < 1 || criteriaRatings[criteria] > 5) {
            throw new ApiError_1.ApiError(400, `${criteria} rating must be between 1 and 5`);
        }
    }
    // Create review
    const review = yield ProgramReviews_1.ProgramReview.create({
        program: programId,
        user: userId,
        year,
        criteriaRatings,
        comment: comment || ''
    });
    // Update program review statistics
    yield updateProgramReviewStats(programId);
    // Populate user info for response
    const populatedReview = yield ProgramReviews_1.ProgramReview.findById(review._id)
        .populate('user', 'fullName profilePic')
        .populate('program', 'name code');
    res.status(201).json(new ApiResponse_1.ApiResponse(201, populatedReview, 'Review created successfully'));
}));
// ===== GET PROGRAM REVIEWS =====
exports.getProgramReviews = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { programId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // For checking user's likes/dislikes
    // Validate program exists
    const program = yield Program_1.Program.findById(programId);
    if (!program) {
        throw new ApiError_1.ApiError(404, 'Program not found');
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    // Get reviews and calculate averages
    const [reviews, total, averages, userLikes] = yield Promise.all([
        ProgramReviews_1.ProgramReview.find({ program: programId })
            .populate('user', 'fullName profilePic academic')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        ProgramReviews_1.ProgramReview.countDocuments({ program: programId }),
        calculateCriteriaAverages(programId),
        // Get user's likes/dislikes for these reviews
        userId ? ProgramReviews_1.ReviewLike.find({ user: userId }).lean() : []
    ]);
    // Add user interaction info to reviews
    const reviewsWithUserInfo = reviews.map(review => {
        const userLike = userLikes.find(like => like.review.toString() === review._id.toString());
        return Object.assign(Object.assign({}, review), { userLiked: (userLike === null || userLike === void 0 ? void 0 : userLike.type) === 'like', userDisliked: (userLike === null || userLike === void 0 ? void 0 : userLike.type) === 'dislike' });
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        reviews: reviewsWithUserInfo,
        averages,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    }, 'Reviews retrieved successfully'));
}));
// ===== UPDATE REVIEW =====
exports.updateReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const { year, criteriaRatings, comment } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const review = yield ProgramReviews_1.ProgramReview.findOne({
        _id: reviewId,
        user: userId
    });
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found or you are not authorized to update it');
    }
    // Validate criteria ratings if provided
    if (criteriaRatings) {
        const requiredCriteria = [
            'TeachingQuality', 'FacultySupport', 'LearningEnvironment',
            'LibraryResources', 'StudentSupport', 'CampusLife', 'OverallExperience'
        ];
        for (const criteria of requiredCriteria) {
            if (criteriaRatings[criteria] && (criteriaRatings[criteria] < 1 || criteriaRatings[criteria] > 5)) {
                throw new ApiError_1.ApiError(400, `${criteria} rating must be between 1 and 5`);
            }
        }
    }
    // Update review
    const updatedReview = yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, Object.assign(Object.assign(Object.assign({}, (year && { year })), (criteriaRatings && { criteriaRatings })), (comment !== undefined && { comment })), { new: true, runValidators: true }).populate('user', 'fullName profilePic');
    // Update program review statistics
    yield updateProgramReviewStats(review.program.toString());
    res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedReview, 'Review updated successfully'));
}));
// ===== DELETE REVIEW =====
exports.deleteReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const review = yield ProgramReviews_1.ProgramReview.findOne({
        _id: reviewId,
        user: userId
    });
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found or you are not authorized to delete it');
    }
    const programId = review.program.toString();
    yield ProgramReviews_1.ProgramReview.findByIdAndDelete(reviewId);
    // Update program review statistics
    yield updateProgramReviewStats(programId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Review deleted successfully'));
}));
// ===== GET USER'S REVIEW FOR PROGRAM =====
exports.getUserReviewForProgram = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { programId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const review = yield ProgramReviews_1.ProgramReview.findOne({
        program: programId,
        user: userId
    }).populate('user', 'fullName profilePic');
    if (!review) {
        return res.status(404).json(new ApiResponse_1.ApiResponse(404, null, 'No review found for this program'));
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, review, 'User review retrieved successfully'));
}));
// ===== HELPER FUNCTIONS =====
/**
 * Calculate average ratings for each criteria for a program
 */
function calculateCriteriaAverages(programId) {
    return __awaiter(this, void 0, void 0, function* () {
        const reviews = yield ProgramReviews_1.ProgramReview.find({ program: programId });
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
        const averages = { totalReviews: reviews.length };
        criteria.forEach(criterion => {
            const sum = reviews.reduce((acc, review) => acc + (review.criteriaRatings[criterion] || 0), 0);
            averages[criterion] = Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
        });
        return averages;
    });
}
/**
 * Update program's review statistics (optional - for caching)
 */
function updateProgramReviewStats(programId) {
    return __awaiter(this, void 0, void 0, function* () {
        const averages = yield calculateCriteriaAverages(programId);
        // You can store these averages in Program model for faster queries
        // For now, we'll just recalculate on each request
        // Optional: Update Program model with review stats
        // await Program.findByIdAndUpdate(programId, {
        //     'reviewStats.averages': averages,
        //     'reviewStats.totalReviews': averages.totalReviews,
        //     'reviewStats.lastUpdated': new Date()
        // });
    });
}
// ===== LIKE/DISLIKE REVIEW =====
exports.likeReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const action = 'like';
    // Validate review exists
    const review = yield ProgramReviews_1.ProgramReview.findById(reviewId);
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found');
    }
    // Check if user already liked/disliked this review
    const existingLike = yield ProgramReviews_1.ReviewLike.findOne({
        review: reviewId,
        user: userId
    });
    if (existingLike) {
        if (existingLike.type === action) {
            // Remove like
            yield ProgramReviews_1.ReviewLike.findByIdAndDelete(existingLike._id);
            yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: -1 }
            });
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Like removed successfully'));
        }
        else {
            // Change dislike to like
            existingLike.type = action;
            yield existingLike.save();
            yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: 1, dislikes: -1 }
            });
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Changed to like successfully'));
        }
    }
    else {
        // Create new like
        yield ProgramReviews_1.ReviewLike.create({
            review: reviewId,
            user: userId,
            type: action
        });
        yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
            $inc: { likes: 1 }
        });
        // Send notification to review author
        if (review.user.toString() !== (userId === null || userId === void 0 ? void 0 : userId.toString())) {
            yield (0, notification_controllers_1.createNotification)({
                recipient: review.user.toString(),
                sender: userId === null || userId === void 0 ? void 0 : userId.toString(),
                type: 'like',
                title: 'Your review was liked',
                message: 'Someone liked your program review.',
                relatedId: reviewId,
                relatedModel: 'ProgramReview'
            });
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Review liked successfully'));
    }
}));
exports.dislikeReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const action = 'dislike';
    // Validate review exists
    const review = yield ProgramReviews_1.ProgramReview.findById(reviewId);
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found');
    }
    // Check if user already liked/disliked this review
    const existingLike = yield ProgramReviews_1.ReviewLike.findOne({
        review: reviewId,
        user: userId
    });
    if (existingLike) {
        if (existingLike.type === action) {
            // Remove dislike
            yield ProgramReviews_1.ReviewLike.findByIdAndDelete(existingLike._id);
            yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { dislikes: -1 }
            });
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Dislike removed successfully'));
        }
        else {
            // Change like to dislike
            existingLike.type = action;
            yield existingLike.save();
            yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { dislikes: 1, likes: -1 }
            });
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Changed to dislike successfully'));
        }
    }
    else {
        // Create new dislike
        yield ProgramReviews_1.ReviewLike.create({
            review: reviewId,
            user: userId,
            type: action
        });
        yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
            $inc: { dislikes: 1 }
        });
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Review disliked successfully'));
    }
}));
//# sourceMappingURL=programReview.controllers.js.map