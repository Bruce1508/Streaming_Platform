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
exports.Enrollment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enrollmentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
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
    enrollmentDate: {
        type: Date,
        required: [true, 'Enrollment date is required'],
        default: Date.now
    },
    expectedGraduation: {
        type: Date,
        required: [true, 'Expected graduation date is required']
    },
    currentSemester: {
        type: Number,
        required: [true, 'Current semester is required'],
        min: [1, 'Semester must be at least 1'],
        max: [8, 'Semester cannot exceed 8']
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'completed', 'dropped', 'suspended', 'transferred'],
            message: 'Invalid enrollment status'
        },
        required: [true, 'Status is required'],
        default: 'active'
    },
    gpa: {
        type: Number,
        min: [0, 'GPA cannot be negative'],
        max: [4.0, 'GPA cannot exceed 4.0'],
        validate: {
            validator: function (v) {
                return !v || (v >= 0 && v <= 4.0);
            },
            message: 'GPA must be between 0 and 4.0'
        }
    },
    totalCredits: {
        type: Number,
        required: [true, 'Total credits is required'],
        min: [0, 'Credits cannot be negative']
    },
    completedCredits: {
        type: Number,
        required: [true, 'Completed credits is required'],
        default: 0,
        min: [0, 'Completed credits cannot be negative']
    },
    courses: [{
            course: {
                type: String,
                required: true,
                trim: true,
                maxlength: [100, 'Course name cannot exceed 100 characters']
            },
            semester: {
                type: Number,
                required: true,
                min: [1, 'Semester must be at least 1'],
                max: [8, 'Semester cannot exceed 8']
            },
            year: {
                type: Number,
                required: true,
                min: [2020, 'Year must be 2020 or later'],
                max: [new Date().getFullYear() + 5, 'Year cannot be more than 5 years in the future']
            },
            term: {
                type: String,
                enum: {
                    values: ['fall', 'winter', 'summer'],
                    message: 'Invalid term'
                },
                required: true
            },
            status: {
                type: String,
                enum: {
                    values: ['enrolled', 'completed', 'dropped', 'in-progress'],
                    message: 'Invalid course status'
                },
                required: true,
                default: 'enrolled'
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
            credits: {
                type: Number,
                required: true,
                min: [0.5, 'Credits must be at least 0.5'],
                max: [6, 'Credits cannot exceed 6']
            },
            enrolledAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            completedAt: {
                type: Date,
                validate: {
                    validator: function (v) {
                        return !v || v >= this.enrolledAt;
                    },
                    message: 'Completion date must be after enrollment date'
                }
            }
        }],
    isPublic: {
        type: Boolean,
        default: true
    },
    graduationYear: {
        type: Number,
        min: [2020, 'Graduation year must be 2020 or later'],
        max: [new Date().getFullYear() + 10, 'Graduation year cannot be more than 10 years in the future']
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes for better performance
enrollmentSchema.index({ user: 1 });
enrollmentSchema.index({ program: 1, status: 1 });
enrollmentSchema.index({ school: 1 });
enrollmentSchema.index({ user: 1, program: 1 }, { unique: true });
enrollmentSchema.index({ 'courses.course': 1 });
enrollmentSchema.index({ currentSemester: 1, status: 1 });
// Virtual for completion percentage
enrollmentSchema.virtual('completionPercentage').get(function () {
    if (this.totalCredits === 0)
        return 0;
    // Round to 2 decimal places
    const percentage = (this.completedCredits / this.totalCredits) * 100;
    return Math.round(percentage * 100) / 100;
});
// Virtual for active courses
enrollmentSchema.virtual('activeCourses').get(function () {
    return this.courses.filter(course => course.status === 'enrolled' || course.status === 'in-progress');
});
// Pre-save middleware to calculate completed credits
enrollmentSchema.pre('save', function (next) {
    this.completedCredits = this.courses
        .filter(course => course.status === 'completed')
        .reduce((total, course) => total + course.credits, 0);
    next();
});
// Static methods
enrollmentSchema.statics.findByUser = function (userId) {
    return this.find({ user: userId })
        .populate('school', 'name shortName')
        .populate('program', 'name code duration')
        .sort({ createdAt: -1 });
};
enrollmentSchema.statics.findByProgram = function (programId, options = {}) {
    const query = {
        program: programId,
        status: options.status || 'active',
        isPublic: true
    };
    return this.find(query)
        .populate('user', 'fullName profilePic')
        .sort(options.sort || { currentSemester: -1, createdAt: -1 })
        .limit(options.limit || 50);
};
enrollmentSchema.statics.findClassmates = function (userId, programId) {
    return this.find({
        program: programId,
        user: { $ne: userId },
        status: 'active',
        isPublic: true
    })
        .populate('user', 'fullName profilePic')
        .sort({ currentSemester: -1 });
};
enrollmentSchema.statics.getEnrollmentStats = function (programId) {
    return this.aggregate([
        { $match: { program: new mongoose_1.default.Types.ObjectId(programId) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                avgGpa: { $avg: '$gpa' },
                avgCompletionRate: { $avg: { $divide: ['$completedCredits', '$totalCredits'] } }
            }
        },
        { $sort: { count: -1 } }
    ]);
};
exports.Enrollment = mongoose_1.default.model('Enrollment', enrollmentSchema);
exports.default = exports.Enrollment;
//# sourceMappingURL=Enrollment.js.map