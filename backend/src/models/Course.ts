import mongoose, { Schema } from 'mongoose';
import { ICourse, ICourseDocument } from '../types/Academic';

const courseSchema = new Schema<ICourseDocument>({
    code: {
        type: String,
        required: [true, 'Course code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: [10, 'Course code cannot exceed 10 characters'],
        validate: {
            validator: function (v: string) {
                return /^[A-Z]{3}[0-9]{3}$/.test(v);
            },
            message: 'Course code must follow format: 3 letters + 3 numbers (e.g., IPC144)'
        }
    },
    name: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true,
        maxlength: [150, 'Course name cannot exceed 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    credits: {
        type: Number,
        required: [true, 'Credits is required'],
        min: [0.5, 'Credits must be at least 0.5'],
        max: [6, 'Credits cannot exceed 6']
    },
    hours: {
        lecture: {
            type: Number,
            default: 0,
            min: [0, 'Lecture hours cannot be negative']
        },
        lab: {
            type: Number,
            default: 0,
            min: [0, 'Lab hours cannot be negative']
        },
        tutorial: {
            type: Number,
            default: 0,
            min: [0, 'Tutorial hours cannot be negative']
        },
        total: {
            type: Number,
            required: [true, 'Total hours is required'],
            min: [1, 'Total hours must be at least 1'],
            max: [10, 'Total hours cannot exceed 10']
        }
    },
    prerequisites: [{
        type: String,
        trim: true,
        uppercase: true,
        validate: {
            validator: function (v: string) {
                return /^[A-Z]{3}[0-9]{3}$/.test(v);
            },
            message: 'Prerequisite must be a valid course code'
        }
    }],
    corequisites: [{
        type: String,
        trim: true,
        uppercase: true,
        validate: {
            validator: function (v: string) {
                return /^[A-Z]{3}[0-9]{3}$/.test(v);
            },
            message: 'Corequisite must be a valid course code'
        }
    }],
    programs: [{
        program: {
            type: Schema.Types.ObjectId,
            ref: 'Program',
            required: true
        },
        semester: {
            type: Number,
            required: true,
            min: [1, 'Semester must be at least 1'],
            max: [8, 'Semester cannot exceed 8']
        },
        isCore: {
            type: Boolean,
            default: true
        },
        isElective: {
            type: Boolean,
            default: false
        }
    }],
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required']
    },
    department: {
        type: String,
        trim: true,
        maxlength: [100, 'Department name cannot exceed 100 characters']
    },
    level: {
        type: String,
        enum: {
            values: ['1', '2', '3', '4', 'graduate', 'undergraduate'],
            message: '{VALUE} is not a valid course level'
        },
        required: [true, 'Course level is required']
    },
    delivery: [{
        type: String,
        enum: {
            values: ['in-person', 'online', 'hybrid', 'blended'],
            message: '{VALUE} is not a valid delivery method'
        }
    }],
    language: {
        type: String,
        enum: {
            values: ['english', 'french', 'bilingual'],
            message: '{VALUE} is not a valid language'
        },
        default: 'english'
    },
    difficulty: {
        type: String,
        enum: {
            values: ['beginner', 'intermediate', 'advanced'],
            message: '{VALUE} is not a valid difficulty level'
        },
        default: 'intermediate'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    learningOutcomes: [{
        type: String,
        trim: true
    }],
    assessmentMethods: [{
        type: String,
        trim: true
    }],
    textbooks: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        },
        isbn: {
            type: String,
            trim: true,
            validate: {
                validator: function (v: string) {
                    return !v || /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(v);
                },
                message: 'ISBN must be a valid format'
            }
        },
        required: {
            type: Boolean,
            default: true
        }
    }],
    professors: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v: string) {
                    return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Email must be valid'
            }
        },
        rating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        }
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
        materialCount: {
            type: Number,
            default: 0,
            min: [0, 'Material count cannot be negative']
        },
        rating: {
            average: {
                type: Number,
                default: 0,
                min: [0, 'Average rating cannot be negative'],
                max: [5, 'Average rating cannot exceed 5']
            },
            count: {
                type: Number,
                default: 0,
                min: [0, 'Rating count cannot be negative']
            }
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// courseSchema.index({ code: 1 });
courseSchema.index({ 'programs.program': 1 });
courseSchema.index({ school: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ difficulty: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ name: 'text', description: 'text' });
courseSchema.index({ tags: 1 });

// Compound indexes for common queries
courseSchema.index({ 'programs.program': 1, 'programs.semester': 1 });
courseSchema.index({ school: 1, level: 1 });

// Virtual for full course identifier
courseSchema.virtual('fullCode').get(function (this: ICourseDocument) {
    return this.code;
});

// Method to get program codes
courseSchema.methods.getProgramCodes = function (this: ICourseDocument): string[] {
    return this.programs.map(p => p.program.toString());
};

// Virtual for materials
courseSchema.virtual('materials', {
    ref: 'StudyMaterial',
    localField: '_id',
    foreignField: 'academic.course'
});

export const Course = mongoose.model<ICourseDocument>('Course', courseSchema);