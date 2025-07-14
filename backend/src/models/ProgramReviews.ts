import mongoose, { Schema, Document } from 'mongoose';

export interface IProgramReview extends Document {
    program: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    currentSemester: string; // e.g., "Fall 2024"
    ratings: {
        instructorRating: number;        // 0-100
        contentQualityRating: number;    // 0-100
        practicalValueRating: number;    // 0-100
    };
    takeTheCourseAgain: boolean;
    author: {
        fullName: string;
        email: string;
    };
    comment?: string;
    likes: number;
    dislikes: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReviewLike extends Document {
    review: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    type: 'like' | 'dislike';
    createdAt: Date;
}

const programReviewSchema = new Schema<IProgramReview>({
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

const reviewLikeSchema = new Schema<IReviewLike>({
    review: { type: Schema.Types.ObjectId, ref: 'ProgramReview', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'dislike'], required: true },
}, { timestamps: true });

programReviewSchema.index({ program: 1, user: 1 }, { unique: true });
reviewLikeSchema.index({ review: 1, user: 1 }, { unique: true });

export const ProgramReview = mongoose.model<IProgramReview>('ProgramReview', programReviewSchema);
export const ReviewLike = mongoose.model<IReviewLike>('ReviewLike', reviewLikeSchema);
