"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewLike = exports.ProgramReview = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const programReviewSchema = new mongoose_1.Schema({
    program: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Program', required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    currentSemester: { type: String, required: true },
    ratings: {
        instructorRating: { type: Number, min: 0, max: 100, required: true },
        contentQualityRating: { type: Number, min: 0, max: 100, required: true },
        practicalValueRating: { type: Number, min: 0, max: 100, required: true }
    },
    takeTheCourseAgain: { type: Boolean, required: true },
    author: {
        fullName: { type: String, required: true },
        email: { type: String, required: true }
    },
    comment: { type: String, maxlength: 500 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
}, { timestamps: true });
const reviewLikeSchema = new mongoose_1.Schema({
    review: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ProgramReview', required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'dislike'], required: true },
}, { timestamps: true });
programReviewSchema.index({ program: 1, user: 1 }, { unique: true });
reviewLikeSchema.index({ review: 1, user: 1 }, { unique: true });
exports.ProgramReview = mongoose_1.default.model('ProgramReview', programReviewSchema);
exports.ReviewLike = mongoose_1.default.model('ReviewLike', reviewLikeSchema);
//# sourceMappingURL=ProgramReviews.js.map