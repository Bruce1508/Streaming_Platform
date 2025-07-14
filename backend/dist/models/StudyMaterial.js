"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyMaterial = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Format_utils_1 = require("../utils/Format.utils");
// Streamlined schema
const studyMaterialSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'School',
            required: [true, 'School is required']
        },
        program: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Program',
            required: [true, 'Program is required']
        },
        course: {
            type: String,
            required: [true, 'Course is required'],
            trim: true,
            maxlength: [100, 'Course name cannot exceed 100 characters']
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
                validator: function (v) {
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
                    validator: function (v) {
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
                type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
studyMaterialSchema.virtual('commentCount').get(function () {
    return this.comments ? this.comments.length : 0;
});
// ✅ Formatted title virtual field
studyMaterialSchema.virtual('formattedTitle').get(function () {
    return (0, Format_utils_1.capitalize)(this.title);
});
// ✅ Truncated description virtual field
studyMaterialSchema.virtual('shortDescription').get(function () {
    return (0, Format_utils_1.truncate)(this.description, 100);
});
// ✅ Total file size virtual field
studyMaterialSchema.virtual('totalFileSize').get(function () {
    if (!this.attachments || this.attachments.length === 0)
        return '0 B';
    const totalBytes = this.attachments.reduce((sum, attachment) => sum + attachment.size, 0);
    return (0, Format_utils_1.formatFileSize)(totalBytes);
});
// ✅ File count virtual field
studyMaterialSchema.virtual('fileCount').get(function () {
    return this.attachments ? this.attachments.length : 0;
});
// ✅ Rating percentage virtual field
studyMaterialSchema.virtual('ratingPercentage').get(function () {
    if (this.averageRating === 0)
        return '0%';
    return (0, Format_utils_1.formatPercentage)(this.averageRating, 5);
});
// ✅ Academic info virtual field  
studyMaterialSchema.virtual('academicInfo').get(function () {
    var _a, _b, _c;
    const semester = (_a = this.academic) === null || _a === void 0 ? void 0 : _a.semester;
    const semesterText = semester ? `${(0, Format_utils_1.capitalize)(semester.term)} ${semester.year}` : 'Unknown Semester';
    return {
        semesterText,
        difficulty: (0, Format_utils_1.capitalize)(((_b = this.metadata) === null || _b === void 0 ? void 0 : _b.difficulty) || 'unknown'),
        category: ((_c = this.category) === null || _c === void 0 ? void 0 : _c.replace('-', ' ').split(' ').map(word => (0, Format_utils_1.capitalize)(word)).join(' ')) || 'Other'
    };
});
// ✅ Engagement stats virtual field
studyMaterialSchema.virtual('engagementStats').get(function () {
    const total = this.views + this.saves + this.totalRatings;
    return {
        total,
        viewsPercentage: total > 0 ? (0, Format_utils_1.formatPercentage)(this.views, total) : '0%',
        savesPercentage: total > 0 ? (0, Format_utils_1.formatPercentage)(this.saves, total) : '0%',
        ratingsPercentage: total > 0 ? (0, Format_utils_1.formatPercentage)(this.totalRatings, total) : '0%'
    };
});
// Pre-save middleware for rating calculation
studyMaterialSchema.pre('save', function (next) {
    if (this.ratings && this.ratings.length > 0) {
        const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        this.averageRating = Math.round((totalRating / this.ratings.length) * 10) / 10;
        this.totalRatings = this.ratings.length;
    }
    else {
        this.averageRating = 0;
        this.totalRatings = 0;
    }
    next();
});
// Static methods
studyMaterialSchema.statics.findByCategory = function (category, options = {}) {
    return this.find(Object.assign({ category, status: 'published', isPublic: true }, options.filter))
        .populate('author', 'fullName profilePic')
        .populate('academic.program', 'name')
        .sort(options.sort || { averageRating: -1, createdAt: -1 })
        .limit(options.limit || 20);
};
studyMaterialSchema.statics.findByCourse = function (courseId, options = {}) {
    return this.find(Object.assign({ 'academic.course': courseId, status: 'published', isPublic: true }, options.filter))
        .populate('author', 'fullName profilePic')
        .sort(options.sort || { averageRating: -1, createdAt: -1 })
        .limit(options.limit || 20);
};
studyMaterialSchema.statics.findByProgram = function (programId, options = {}) {
    return this.find(Object.assign({ 'academic.program': programId, status: 'published', isPublic: true }, options.filter))
        .populate('author', 'fullName profilePic')
        .populate('academic.program', 'name')
        .sort(options.sort || { averageRating: -1, createdAt: -1 })
        .limit(options.limit || 20);
};
studyMaterialSchema.statics.findFeatured = function (limit = 10) {
    return this.find({
        isFeatured: true,
        status: 'published',
        isPublic: true
    })
        .populate('author', 'fullName profilePic')
        .sort({ averageRating: -1, views: -1 })
        .limit(limit);
};
studyMaterialSchema.statics.getPopularMaterials = function (limit = 10) {
    return this.find({
        status: 'published',
        isPublic: true
    })
        .sort({ views: -1, averageRating: -1 })
        .limit(limit)
        .populate('author', 'fullName profilePic');
};
// Instance methods
studyMaterialSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};
studyMaterialSchema.methods.addRating = function (userId, rating) {
    this.ratings = this.ratings.filter(r => !r.user.equals(userId));
    this.ratings.push({
        user: userId,
        rating: rating,
        createdAt: new Date()
    });
    return this.save();
};
studyMaterialSchema.methods.removeRating = function (userId) {
    this.ratings = this.ratings.filter(r => !r.user.equals(userId));
    return this.save();
};
exports.StudyMaterial = mongoose_1.default.model('StudyMaterial', studyMaterialSchema);
exports.default = exports.StudyMaterial;
//# sourceMappingURL=StudyMaterial.js.map