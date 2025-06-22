import mongoose, { Document, Schema, Model } from 'mongoose';
import { 
    formatFileSize, 
    capitalize,
    truncate,
    formatPercentage 
} from '../utils/Format.utils';

// ✅ Keep essential interfaces only
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

// 🎯 Focused on academic context
export interface IAcademicContext {
    school: mongoose.Types.ObjectId; // Required for academic materials
    program: mongoose.Types.ObjectId; // Required
    course: mongoose.Types.ObjectId; // Required
    semester: {
        term: 'fall' | 'winter' | 'summer';
        year: number;
    };
    week?: number;
    professor?: string;
}

// Streamlined main interface
export interface IStudyMaterial extends Document {
    title: string;
    description: string;
    content?: string;
    author: mongoose.Types.ObjectId;

    // 🎯 ACADEMIC-ONLY CATEGORIES
    category: 'lecture-notes' | 'assignment' | 'lab-report' | 'project' |
    'midterm-exam' | 'final-exam' | 'quiz' | 'presentation' |
    'tutorial' | 'reference' | 'textbook' | 'cheat-sheet' | 'solution' | 'other';

    // 🎯 Academic context (required)
    academic: IAcademicContext;

    // Simplified metadata
    metadata: {
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        completionTime?: number; // in minutes
        grade?: string;
        isVerified: boolean;
        qualityScore: number;
    };

    // Essential engagement
    attachments: IAttachment[];
    views: number;
    saves: number;
    ratings: IRating[];
    averageRating: number;
    totalRatings: number;
    comments: IComment[];

    // Essential status
    status: 'draft' | 'published' | 'archived';
    isPublic: boolean;
    isFeatured: boolean;

    // Basic moderation
    isReported: boolean;
    reportCount: number;

    createdAt: Date;
    updatedAt: Date;

    // Virtual properties
    commentCount: number;

    // Instance methods
    incrementViews(): Promise<IStudyMaterial>;
    addRating(userId: mongoose.Types.ObjectId, rating: number): Promise<IStudyMaterial>;
    removeRating(userId: mongoose.Types.ObjectId): Promise<IStudyMaterial>;
}

// Focused static methods
export interface IStudyMaterialModel extends Model<IStudyMaterial> {
    findByCategory(category: string, options?: any): Promise<IStudyMaterial[]>;
    findByCourse(courseId: string, options?: any): Promise<IStudyMaterial[]>;
    findByProgram(programId: string, options?: any): Promise<IStudyMaterial[]>;
    findFeatured(limit?: number): Promise<IStudyMaterial[]>;
    getPopularMaterials(limit?: number): Promise<IStudyMaterial[]>;
}

// Streamlined schema
const studyMaterialSchema = new Schema<IStudyMaterial, IStudyMaterialModel>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxLength: [200, 'Title cannot exceed 200 characters']
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },

    content: {
        type: String,
        maxLength: [10000, 'Content cannot exceed 10000 characters']
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 🎯 ACADEMIC-FOCUSED CATEGORIES
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: [
                'lecture-notes', 'assignment', 'lab-report', 'project',
                'midterm-exam', 'final-exam', 'quiz', 'presentation',
                'tutorial', 'reference', 'textbook', 'cheat-sheet', 'solution', 'other'
            ],
            message: 'Invalid category'
        }
    },

    // 🎯 REQUIRED Academic context
    academic: {
        school: {
            type: Schema.Types.ObjectId,
            ref: 'School',
            required: [true, 'School is required']
        },
        program: {
            type: Schema.Types.ObjectId,
            ref: 'Program',
            required: [true, 'Program is required']
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required']
        },
        semester: {
            term: {
                type: String,
                enum: {
                    values: ['fall', 'winter', 'summer'],
                    message: '{VALUE} is not a valid term'
                },
                required: [true, 'Semester term is required']
            },
            year: {
                type: Number,
                required: [true, 'Semester year is required'],
                min: [2020, 'Year must be 2020 or later'],
                max: [new Date().getFullYear() + 2, 'Year cannot be more than 2 years in the future']
            }
        },
        week: {
            type: Number,
            min: [1, 'Week must be at least 1'],
            max: [16, 'Week cannot exceed 16']
        },
        professor: {
            type: String,
            trim: true,
            maxlength: [100, 'Professor name cannot exceed 100 characters']
        }
    },

    // Simplified metadata
    metadata: {
        difficulty: {
            type: String,
            enum: {
                values: ['beginner', 'intermediate', 'advanced'],
                message: '{VALUE} is not a valid difficulty level'
            },
            required: [true, 'Difficulty level is required']
        },
        completionTime: {
            type: Number,
            min: [1, 'Completion time must be at least 1 minute'],
            max: [480, 'Completion time cannot exceed 8 hours (480 minutes)']
        },
        grade: {
            type: String,
            trim: true,
            maxlength: [10, 'Grade cannot exceed 10 characters'],
            validate: {
                validator: function (v: string) {
                    return !v || /^[A-F][+-]?$|^[0-9]{1,3}(\.[0-9]{1,2})?%?$/.test(v);
                },
                message: 'Grade must be a valid format (A+, B-, 85%, etc.)'
            }
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        qualityScore: {
            type: Number,
            default: 0,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100']
        }
    },

    // File attachments
    attachments: [{
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true,
            validate: {
                validator: function (v: string) {
                    const allowedTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-powerpoint',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                        'text/plain',
                        'image/jpeg',
                        'image/png',
                        'image/gif'
                    ];
                    return allowedTypes.includes(v);
                },
                message: 'File type not supported'
            }
        },
        size: {
            type: Number,
            required: true,
            max: [50 * 1024 * 1024, 'File size cannot exceed 50MB']
        },
        url: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Engagement metrics
    views: {
        type: Number,
        default: 0
    },

    saves: {
        type: Number,
        default: 0
    },

    // Rating system
    ratings: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    totalRatings: {
        type: Number,
        default: 0
    },

    // Comments
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxLength: [500, 'Comment cannot exceed 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Status
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },

    isPublic: {
        type: Boolean,
        default: true
    },

    isFeatured: {
        type: Boolean,
        default: false
    },

    // Basic moderation
    isReported: {
        type: Boolean,
        default: false
    },

    reportCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Essential indexes only
studyMaterialSchema.index({ 'academic.course': 1, category: 1 });
studyMaterialSchema.index({ 'academic.program': 1 });
studyMaterialSchema.index({ 'academic.school': 1 });
studyMaterialSchema.index({ author: 1, status: 1 });
studyMaterialSchema.index({ averageRating: -1, views: -1 });
studyMaterialSchema.index({ createdAt: -1 });
studyMaterialSchema.index({ isPublic: 1, status: 1 });

// Text search for academic content
studyMaterialSchema.index({
    title: 'text',
    description: 'text',
    content: 'text',
    'academic.professor': 'text'
});

// ✅ Enhanced virtual fields with format utils
studyMaterialSchema.virtual('commentCount').get(function (this: IStudyMaterial) {
    return this.comments ? this.comments.length : 0;
});

// ✅ Formatted title virtual field
studyMaterialSchema.virtual('formattedTitle').get(function (this: IStudyMaterial) {
    return capitalize(this.title);
});

// ✅ Truncated description virtual field
studyMaterialSchema.virtual('shortDescription').get(function (this: IStudyMaterial) {
    return truncate(this.description, 100);
});

// ✅ Total file size virtual field
studyMaterialSchema.virtual('totalFileSize').get(function (this: IStudyMaterial) {
    if (!this.attachments || this.attachments.length === 0) return '0 B';
    const totalBytes = this.attachments.reduce((sum, attachment) => sum + attachment.size, 0);
    return formatFileSize(totalBytes);
});

// ✅ File count virtual field
studyMaterialSchema.virtual('fileCount').get(function (this: IStudyMaterial) {
    return this.attachments ? this.attachments.length : 0;
});

// ✅ Rating percentage virtual field
studyMaterialSchema.virtual('ratingPercentage').get(function (this: IStudyMaterial) {
    if (this.averageRating === 0) return '0%';
    return formatPercentage(this.averageRating, 5);
});

// ✅ Academic info virtual field  
studyMaterialSchema.virtual('academicInfo').get(function (this: IStudyMaterial) {
    const semester = this.academic?.semester;
    const semesterText = semester ? `${capitalize(semester.term)} ${semester.year}` : 'Unknown Semester';
    return {
        semesterText,
        difficulty: capitalize(this.metadata?.difficulty || 'unknown'),
        category: this.category?.replace('-', ' ').split(' ').map(word => capitalize(word)).join(' ') || 'Other'
    };
});

// ✅ Engagement stats virtual field
studyMaterialSchema.virtual('engagementStats').get(function (this: IStudyMaterial) {
    const total = this.views + this.saves + this.totalRatings;
    return {
        total,
        viewsPercentage: total > 0 ? formatPercentage(this.views, total) : '0%',
        savesPercentage: total > 0 ? formatPercentage(this.saves, total) : '0%',
        ratingsPercentage: total > 0 ? formatPercentage(this.totalRatings, total) : '0%'
    };
});

// Pre-save middleware for rating calculation
studyMaterialSchema.pre<IStudyMaterial>('save', function (next) {
    if (this.ratings && this.ratings.length > 0) {
        const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        this.averageRating = Math.round((totalRating / this.ratings.length) * 10) / 10;
        this.totalRatings = this.ratings.length;
    } else {
        this.averageRating = 0;
        this.totalRatings = 0;
    }
    next();
});

// Focused static methods
studyMaterialSchema.statics.findByCategory = function (
    category: string,
    options: any = {}
): Promise<IStudyMaterial[]> {
    return this.find({
        category,
        status: 'published',
        isPublic: true,
        ...options.filter
    })
        .populate('author', 'fullName profilePic')
        .populate('academic.course', 'code name')
        .populate('academic.program', 'name')
        .sort(options.sort || { averageRating: -1, createdAt: -1 })
        .limit(options.limit || 20);
};

studyMaterialSchema.statics.findByCourse = function (
    courseId: string,
    options: any = {}
): Promise<IStudyMaterial[]> {
    return this.find({
        'academic.course': courseId,
        status: 'published',
        isPublic: true,
        ...options.filter
    })
        .populate('author', 'fullName profilePic')
        .populate('academic.course', 'code name')
        .sort(options.sort || { averageRating: -1, createdAt: -1 })
        .limit(options.limit || 20);
};

studyMaterialSchema.statics.findByProgram = function (
    programId: string,
    options: any = {}
): Promise<IStudyMaterial[]> {
    return this.find({
        'academic.program': programId,
        status: 'published',
        isPublic: true,
        ...options.filter
    })
        .populate('author', 'fullName profilePic')
        .populate('academic.course', 'code name')
        .populate('academic.program', 'name')
        .sort(options.sort || { averageRating: -1, createdAt: -1 })
        .limit(options.limit || 20);
};

studyMaterialSchema.statics.findFeatured = function (
    limit: number = 10
): Promise<IStudyMaterial[]> {
    return this.find({
        isFeatured: true,
        status: 'published',
        isPublic: true
    })
        .populate('author', 'fullName profilePic')
        .populate('academic.course', 'code name')
        .sort({ averageRating: -1, views: -1 })
        .limit(limit);
};

studyMaterialSchema.statics.getPopularMaterials = function (
    limit: number = 10
): Promise<IStudyMaterial[]> {
    return this.find({
        status: 'published',
        isPublic: true
    })
        .sort({ views: -1, averageRating: -1 })
        .limit(limit)
        .populate('author', 'fullName profilePic')
        .populate('academic.course', 'code name');
};

// Instance methods
studyMaterialSchema.methods.incrementViews = function (this: IStudyMaterial): Promise<IStudyMaterial> {
    this.views += 1;
    return this.save();
};

studyMaterialSchema.methods.addRating = function (
    this: IStudyMaterial,
    userId: mongoose.Types.ObjectId,
    rating: number
): Promise<IStudyMaterial> {
    this.ratings = this.ratings.filter(r => !r.user.equals(userId));
    this.ratings.push({
        user: userId,
        rating: rating,
        createdAt: new Date()
    });
    return this.save();
};

studyMaterialSchema.methods.removeRating = function (
    this: IStudyMaterial,
    userId: mongoose.Types.ObjectId
): Promise<IStudyMaterial> {
    this.ratings = this.ratings.filter(r => !r.user.equals(userId));
    return this.save();
};

export const StudyMaterial = mongoose.model<IStudyMaterial, IStudyMaterialModel>('StudyMaterial', studyMaterialSchema);

export default StudyMaterial;