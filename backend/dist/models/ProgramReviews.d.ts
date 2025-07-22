import mongoose, { Document } from 'mongoose';
export interface IProgramReview extends Document {
    program: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    currentSemester: string;
    ratings: {
        instructorRating: number;
        contentQualityRating: number;
        practicalValueRating: number;
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
export declare const ProgramReview: mongoose.Model<IProgramReview, {}, {}, {}, mongoose.Document<unknown, {}, IProgramReview, {}> & IProgramReview & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const ReviewLike: mongoose.Model<IReviewLike, {}, {}, {}, mongoose.Document<unknown, {}, IReviewLike, {}> & IReviewLike & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ProgramReviews.d.ts.map