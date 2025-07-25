import mongoose, { Schema } from 'mongoose';
import { IProgram, IProgramDocument } from '../types/Academic';

const programSchema = new Schema<IProgramDocument>({
    // Simplified schema with standardized fields
    id: {
        type: String,
        required: [true, 'Program ID is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Program code is required'],
        uppercase: true,
        trim: true,
        maxlength: [50, 'Program code cannot exceed 50 characters']
    },
    name: {
        type: String,
        required: [true, 'Program name is required'],
        trim: true,
        maxlength: [200, 'Program name cannot exceed 200 characters']
    },
    duration: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Duration cannot exceed 100 characters']
    },
    campus: [{
        type: String,
        trim: true
    }],
    credential: {
        type: String,
        required: [true, 'Credential is required'],
        enum: ['bachelor', 'diploma', 'advanced diploma', 'certificate'],
        lowercase: true
    },
    
    // Optional legacy fields for backward compatibility
    programId: {
        type: String,
        trim: true,
        lowercase: true
    },
    overview: {
        type: String,
        required: false,
        trim: true,
        maxlength: [2000, 'Overview cannot exceed 2000 characters']
    },
    delivery: {
        type: String,
        trim: true,
        maxlength: [200, 'Delivery cannot exceed 200 characters']
    },
    school: {
        type: String,
        trim: true,
        maxlength: [200, 'School name cannot exceed 200 characters']
    },
    url: {
        type: String,
        trim: true,
        validate: {
            validator: function(v: string) {
                // Allow empty string or valid URLs
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'URL must be a valid HTTP or HTTPS URL'
        },
        maxlength: [500, 'URL cannot exceed 500 characters']
    },
    level: {
        type: String,
        enum: [
            'Certificate', 
            'Diploma', 
            'Advanced Diploma', 
            'Bachelor', 
            'Graduate Certificate', 
            'Honours Bachelor Degree', 
            'Honours Bachelor', 
            'Seneca Certificate of Standing', 
            'Certificate of Apprenticeship, Ontario College Certificate'
        ]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
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
    },
    // Semester and course structure for imported data
    semesters: [{
        id: {
            type: String,
            trim: true
        },
        name: {
            type: String,
            trim: true
        },
        courses: [{
            id: {
                type: String,
                trim: true
            },
            code: {
                type: String,
                uppercase: true,
                trim: true
            },
            name: {
                type: String,
                trim: true
            }
        }]
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// Note: programId and code already have unique indexes from field definitions
programSchema.index({ school: 1 });
programSchema.index({ level: 1 });
programSchema.index({ isActive: 1 });
programSchema.index({ name: 'text', overview: 'text', description: 'text' });

// Virtual for courses - commented out until Course model is properly implemented
// programSchema.virtual('courses', {
//     ref: 'Course',
//     localField: '_id',
//     foreignField: 'programs.program'
// });

export const Program = mongoose.model<IProgramDocument>('Program', programSchema);