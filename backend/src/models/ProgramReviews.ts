import mongoose, { Schema, Document } from 'mongoose';

export interface IProgramReview extends Document {
    program: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    year: number; // Năm học hoặc năm tốt nghiệp
    criteriaRatings: {
        TeachingQuality: number;      // 1-5
        FacultySupport: number;       // 1-5
        LearningEnvironment: number;  // 1-5
        LibraryResources: number;     // 1-5
        StudentSupport: number;       // 1-5
        CampusLife: number;           // 1-5
        OverallExperience: number;    // 1-5
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
    year: { type: Number, required: true },
    criteriaRatings: {
        TeachingQuality: { type: Number, min: 1, max: 5, required: true },
        FacultySupport: { type: Number, min: 1, max: 5, required: true },
        LearningEnvironment: { type: Number, min: 1, max: 5, required: true },
        LibraryResources: { type: Number, min: 1, max: 5, required: true },
        StudentSupport: { type: Number, min: 1, max: 5, required: true },
        CampusLife: { type: Number, min: 1, max: 5, required: true },
        OverallExperience: { type: Number, min: 1, max: 5, required: true },
    },
    comment: { type: String, maxlength: 2000 },
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
