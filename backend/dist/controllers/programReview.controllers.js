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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dislikeReview = exports.likeReview = exports.getUserReviewForProgram = exports.deleteReview = exports.updateReview = exports.getProgramReviews = exports.createReview = void 0;
const ProgramReviews_1 = require("../models/ProgramReviews");
const Program_1 = require("../models/Program");
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const notification_controllers_1 = require("./notification.controllers");
const gradeCalculator_1 = require("../utils/gradeCalculator");
// ===== CREATE REVIEW =====
exports.createReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { programId, currentSemester, ratings, takeTheCourseAgain, comment } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // Validate required fields
    if (!programId || !currentSemester || !ratings || takeTheCourseAgain === undefined) {
        throw new ApiError_1.ApiError(400, 'Program ID, current s868emester, ratings, and takeTheCourseAgain are required');
    }
    // Validate program exists (find by code instead of _id)
    const program = yield Program_1.Program.findOne({ code: programId });
    if (!program) {
        throw new ApiError_1.ApiError(404, 'Program not found');
    }
    // Get user info for author
    const user = yield User_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    // Check if user already reviewed this program (use program ObjectId)
    const existingReview = yield ProgramReviews_1.ProgramReview.findOne({
        program: program._id,
        user: userId
    });
    if (existingReview) {
        throw new ApiError_1.ApiError(400, 'You have already reviewed this program. Use update instead.');
    }
    // Validate ratings
    const { instructorRating, contentQualityRating, practicalValueRating } = ratings;
    if (!instructorRating || instructorRating < 0 || instructorRating > 100) {
        throw new ApiError_1.ApiError(400, 'Instructor rating must be between 0 and 100');
    }
    if (!contentQualityRating || contentQualityRating < 0 || contentQualityRating > 100) {
        throw new ApiError_1.ApiError(400, 'Content quality rating must be between 0 and 100');
    }
    if (!practicalValueRating || practicalValueRating < 0 || practicalValueRating > 100) {
        throw new ApiError_1.ApiError(400, 'Practical value rating must be between 0 and 100');
    }
    // Create review (use program ObjectId)
    const review = yield ProgramReviews_1.ProgramReview.create({
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
    yield updateProgramReviewStats(program._id.toString());
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
    // Validate program exists (find by code instead of _id)
    const program = yield Program_1.Program.findOne({ code: programId });
    if (!program) {
        throw new ApiError_1.ApiError(404, 'Program not found');
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    // Get reviews and calculate averages (use program ObjectId)
    const [reviews, total, averages, userLikes] = yield Promise.all([
        ProgramReviews_1.ProgramReview.find({ program: program._id })
            .populate('user', 'fullName profilePic academic')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        ProgramReviews_1.ProgramReview.countDocuments({ program: program._id }),
        calculateCriteriaAverages(program._id.toString()),
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
    const { currentSemester, ratings, takeTheCourseAgain, comment } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const review = yield ProgramReviews_1.ProgramReview.findOne({
        _id: reviewId,
        user: userId
    });
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found or you are not authorized to update it');
    }
    // Validate ratings if provided
    if (ratings) {
        const { instructorRating, contentQualityRating, practicalValueRating } = ratings;
        if (instructorRating !== undefined && (instructorRating < 0 || instructorRating > 100)) {
            throw new ApiError_1.ApiError(400, 'Instructor rating must be between 0 and 100');
        }
        if (contentQualityRating !== undefined && (contentQualityRating < 0 || contentQualityRating > 100)) {
            throw new ApiError_1.ApiError(400, 'Content quality rating must be between 0 and 100');
        }
        if (practicalValueRating !== undefined && (practicalValueRating < 0 || practicalValueRating > 100)) {
            throw new ApiError_1.ApiError(400, 'Practical value rating must be between 0 and 100');
        }
    }
    // Update review
    const updatedReview = yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, Object.assign(Object.assign(Object.assign(Object.assign({}, (currentSemester && { currentSemester })), (ratings && { ratings })), (takeTheCourseAgain !== undefined && { takeTheCourseAgain })), (comment !== undefined && { comment })), { new: true, runValidators: true }).populate('user', 'fullName profilePic');
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
    // Find program by code first
    const program = yield Program_1.Program.findOne({ code: programId });
    if (!program) {
        throw new ApiError_1.ApiError(404, 'Program not found');
    }
    const review = yield ProgramReviews_1.ProgramReview.findOne({
        program: program._id,
        user: userId
    }).populate('user', 'fullName profilePic');
    if (!review) {
        return res.status(404).json(new ApiResponse_1.ApiResponse(404, null, 'No review found for this program'));
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, review, 'User review retrieved successfully'));
}));
// ===== HELPER FUNCTIONS =====
// Calculate criteria averages for a program
function calculateCriteriaAverages(programId) {
    return __awaiter(this, void 0, void 0, function* () {
        const reviews = yield ProgramReviews_1.ProgramReview.find({ program: programId });
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                instructorAverage: 0,
                contentQualityAverage: 0,
                practicalValueAverage: 0,
                gradeDistribution: (0, gradeCalculator_1.calculateGradeDistribution)([]),
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
            gradeDistribution: (0, gradeCalculator_1.calculateGradeDistribution)(reviews),
            totalReviews: reviews.length,
            takeAgainPercentage
        };
    });
}
// Update program review statistics
function updateProgramReviewStats(programId) {
    return __awaiter(this, void 0, void 0, function* () {
        // This function can be used to update cached statistics if needed
        // For now, we calculate on-demand in getProgramReviews
        return;
    });
}
// ===== LIKE/DISLIKE FUNCTIONS =====
exports.likeReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const review = yield ProgramReviews_1.ProgramReview.findById(reviewId);
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found');
    }
    // Check if user already liked/disliked this review
    const existingLike = yield ProgramReviews_1.ReviewLike.findOne({ review: reviewId, user: userId });
    if (existingLike) {
        if (existingLike.type === 'like') {
            // Remove like
            yield ProgramReviews_1.ReviewLike.findByIdAndDelete(existingLike._id);
            yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: -1 }
            });
        }
        else {
            // Change from dislike to like
            yield ProgramReviews_1.ReviewLike.findByIdAndUpdate(existingLike._id, { type: 'like' });
            yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: 1, dislikes: -1 }
            });
        }
    }
    else {
        // Add new like
        yield ProgramReviews_1.ReviewLike.create({ review: reviewId, user: userId, type: 'like' });
        yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
            $inc: { likes: 1 }
        });
        // Create notification for review author
        yield (0, notification_controllers_1.createNotification)({
            recipient: review.user.toString(),
            sender: userId === null || userId === void 0 ? void 0 : userId.toString(),
            type: 'like',
            title: 'Your review received a like',
            message: 'Someone liked your program review',
            relatedId: reviewId,
            relatedModel: 'ProgramReview'
        });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Review liked successfully'));
}));
exports.dislikeReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const review = yield ProgramReviews_1.ProgramReview.findById(reviewId);
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found');
    }
    // Check if user already liked/disliked this review
    const existingLike = yield ProgramReviews_1.ReviewLike.findOne({ review: reviewId, user: userId });
    if (existingLike) {
        if (existingLike.type === 'dislike') {
            // Remove dislike
            yield ProgramReviews_1.ReviewLike.findByIdAndDelete(existingLike._id);
            yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { dislikes: -1 }
            });
        }
        else {
            // Change from like to dislike
            yield ProgramReviews_1.ReviewLike.findByIdAndUpdate(existingLike._id, { type: 'dislike' });
            yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
                $inc: { likes: -1, dislikes: 1 }
            });
        }
    }
    else {
        // Add new dislike
        yield ProgramReviews_1.ReviewLike.create({ review: reviewId, user: userId, type: 'dislike' });
        yield ProgramReviews_1.ProgramReview.findByIdAndUpdate(reviewId, {
            $inc: { dislikes: 1 }
        });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Review disliked successfully'));
}));
//# sourceMappingURL=programReview.controllers.js.map