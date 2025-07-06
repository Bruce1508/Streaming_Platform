import mongoose, { Document } from 'mongoose';
export interface IFile extends Document {
    originalName: string;
    filename: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
    category: 'image' | 'pdf' | 'document';
    isPublic: boolean;
    tags?: string[];
    description?: string;
}
export declare const File: mongoose.Model<IFile, {}, {}, {}, mongoose.Document<unknown, {}, IFile, {}> & IFile & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default File;
//# sourceMappingURL=File.d.ts.map