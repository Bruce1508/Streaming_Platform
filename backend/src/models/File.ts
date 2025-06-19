import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
    originalName: string;
    filename: string; // S3 key
    mimeType: string;
    size: number;
    url: string; // S3 URL
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
    category: 'image' | 'pdf' | 'document';
    isPublic: boolean;
    tags?: string[];
    description?: string;
}

const fileSchema = new Schema<IFile>({
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true,
        unique: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['image', 'pdf', 'document'],
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        maxLength: 500
    }
}, {
    timestamps: true
});

export const File = mongoose.model<IFile>('File', fileSchema);
export default File;