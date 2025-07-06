import mongoose, { Document, Model } from 'mongoose';
export interface IAttachment {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: Date;
}
export interface IRating {
    user: mongoose.Types.ObjectId;
    rating: number;
    createdAt: Date;
}
export interface IComment {
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAcademicContext {
    school: mongoose.Types.ObjectId;
    program: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    semester: {
        term: 'fall' | 'winter' | 'summer';
        year: number;
    };
    week?: number;
    professor?: string;
}
export interface IStudyMaterial extends Document {
    title: string;
    description: string;
    content?: string;
    author: mongoose.Types.ObjectId;
    category: 'lecture-notes' | 'assignment' | 'lab-report' | 'project' | 'midterm-exam' | 'final-exam' | 'quiz' | 'presentation' | 'tutorial' | 'reference' | 'textbook' | 'cheat-sheet' | 'solution' | 'other';
    academic: IAcademicContext;
    metadata: {
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        completionTime?: number;
        grade?: string;
        isVerified: boolean;
        qualityScore: number;
    };
    attachments: IAttachment[];
    views: number;
    saves: number;
    ratings: IRating[];
    averageRating: number;
    totalRatings: number;
    comments: IComment[];
    status: 'draft' | 'published' | 'archived';
    isPublic: boolean;
    isFeatured: boolean;
    isReported: boolean;
    reportCount: number;
    createdAt: Date;
    updatedAt: Date;
    commentCount: number;
    incrementViews(): Promise<IStudyMaterial>;
    addRating(userId: mongoose.Types.ObjectId, rating: number): Promise<IStudyMaterial>;
    removeRating(userId: mongoose.Types.ObjectId): Promise<IStudyMaterial>;
}
export interface IStudyMaterialModel extends Model<IStudyMaterial> {
    findByCategory(category: string, options?: any): Promise<IStudyMaterial[]>;
    findByCourse(courseId: string, options?: any): Promise<IStudyMaterial[]>;
    findByProgram(programId: string, options?: any): Promise<IStudyMaterial[]>;
    findFeatured(limit?: number): Promise<IStudyMaterial[]>;
    getPopularMaterials(limit?: number): Promise<IStudyMaterial[]>;
}
export declare const StudyMaterial: IStudyMaterialModel;
export default StudyMaterial;
//# sourceMappingURL=StudyMaterial.d.ts.map