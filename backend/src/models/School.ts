import mongoose, { Schema } from 'mongoose';
import { ISchool, ISchoolDocument } from '../types/Academic';

const schoolSchema = new Schema<ISchoolDocument>({
    name: {
        type: String,
        required: [true, 'School name is required'],
        trim: true,
        maxlength: [100, 'School name cannot exceed 100 characters']
    },
    code: {
        type: String,
        required: [true, 'School code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: [10, 'School code cannot exceed 10 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Website must be a valid URL'
        }
    },
    color: {
        type: String,
        default: '#3B82F6',
        validate: {
            validator: function (v: string) {
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: 'Color must be a valid hex color'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// schoolSchema.index({ code: 1 });
schoolSchema.index({ name: 1 });
schoolSchema.index({ isActive: 1 });

// Virtual for programs
schoolSchema.virtual('programs', {
    ref: 'Program',
    localField: '_id',
    foreignField: 'school'
});

export const School = mongoose.model<ISchoolDocument>('School', schoolSchema);