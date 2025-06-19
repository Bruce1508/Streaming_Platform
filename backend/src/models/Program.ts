import mongoose, { Schema } from 'mongoose';
import { IProgram, IProgramDocument } from '../types/Academic';

const programSchema = new Schema<IProgramDocument>({
    name: {
        type: String,
        required: [true, 'Program name is required'],
        trim: true,
        maxlength: [100, 'Program name cannot exceed 100 characters']
    },
    code: {
        type: String,
        required: [true, 'Program code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: [10, 'Program code cannot exceed 10 characters']
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required']
    },
    level: {
        type: String,
        enum: {
            values: ['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Graduate Certificate'],
            message: '{VALUE} is not a valid program level'
        },
        required: [true, 'Program level is required']
    },
    duration: {
        semesters: {
            type: Number,
            required: [true, 'Duration in semesters is required'],
            min: [1, 'Duration must be at least 1 semester'],
            max: [12, 'Duration cannot exceed 12 semesters']
        },
        years: {
            type: Number,
            required: [true, 'Duration in years is required'],
            min: [0.5, 'Duration must be at least 0.5 years'],
            max: [6, 'Duration cannot exceed 6 years']
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    requirements: {
        academic: [{
            type: String,
            trim: true
        }],
        english: {
            type: String,
            trim: true
        },
        other: [{
            type: String,
            trim: true
        }]
    },
    careerOutcomes: [{
        type: String,
        trim: true
    }],
    totalCredits: {
        type: Number,
        required: [true, 'Total credits is required'],
        min: [10, 'Total credits must be at least 10'],
        max: [200, 'Total credits cannot exceed 200']
    },
    tuition: {
        domestic: {
            type: Number,
            min: [0, 'Tuition cannot be negative']
        },
        international: {
            type: Number,
            min: [0, 'Tuition cannot be negative']
        },
        currency: {
            type: String,
            default: 'CAD',
            uppercase: true,
            maxlength: [3, 'Currency code cannot exceed 3 characters']
        }
    },
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
        graduationRate: {
            type: Number,
            min: [0, 'Graduation rate cannot be negative'],
            max: [100, 'Graduation rate cannot exceed 100%']
        },
        employmentRate: {
            type: Number,
            min: [0, 'Employment rate cannot be negative'],
            max: [100, 'Employment rate cannot exceed 100%']
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// programSchema.index({ code: 1 });
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