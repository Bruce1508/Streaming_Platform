import mongoose, { Schema } from 'mongoose';
import { IProgram, IProgramDocument } from '../types/Academic';

const programSchema = new Schema<IProgramDocument>({
    code: {
        type: String,
        required: [true, 'Program code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: [10, 'Program code cannot exceed 10 characters']
    },
    name: {
        type: String,
        required: [true, 'Program name is required'],
        trim: true,
        maxlength: [200, 'Program name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Program description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    school: {
        type: String,
        required: [true, 'School is required'],
        trim: true,
        maxlength: [200, 'School name cannot exceed 200 characters']
    },
    department: {
        type: String,
        trim: true,
        maxlength: [200, 'Department cannot exceed 200 characters']
    },
    level: {
        type: String,
        enum: {
            values: ['certificate', 'diploma', 'advanced_diploma', 'bachelor', 'graduate_certificate', 'master', 'phd'],
            message: '{VALUE} is not a valid program level'
        },
        required: [true, 'Program level is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 semester'],
        max: [12, 'Duration cannot exceed 12 semesters']
    },
    totalCredits: {
        type: Number,
        required: [true, 'Total credits is required'],
        min: [0, 'Total credits cannot be negative'],
        max: [200, 'Total credits cannot exceed 200']
    },
    delivery: [{
        type: String,
        enum: ['in-person', 'online', 'hybrid'],
        required: true
    }],
    language: {
        type: String,
        enum: ['english', 'french', 'bilingual'],
        required: [true, 'Language is required']
    },
    startDates: [{
        type: String,
        trim: true
    }],
    admissionRequirements: [{
        type: String,
        trim: true
    }],
    careerOutcomes: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    stats: {
        enrollmentCount: {
            type: Number,
            default: 0,
            min: [0, 'Enrollment count cannot be negative']
        },
        averageGrade: {
            type: Number,
            min: [0, 'Average grade cannot be negative'],
            max: [100, 'Average grade cannot exceed 100']
        },
        passRate: {
            type: Number,
            min: [0, 'Pass rate cannot be negative'],
            max: [100, 'Pass rate cannot exceed 100%']
        },
        courseCount: {
            type: Number,
            default: 0,
            min: [0, 'Course count cannot be negative']
        },
        materialCount: {
            type: Number,
            default: 0,
            min: [0, 'Material count cannot be negative']
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// code already has unique: true which creates index
programSchema.index({ school: 1 });
programSchema.index({ level: 1 });
programSchema.index({ isActive: 1 });
programSchema.index({ name: 'text', description: 'text' });

// Virtual for courses
programSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'programs.program'
});

export const Program = mongoose.model<IProgramDocument>('Program', programSchema);