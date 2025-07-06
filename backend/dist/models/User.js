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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const Format_utils_1 = require("../utils/Format.utils");
const Random_utils_1 = require("../utils/Random.utils");
// ✅ CLEANED Academic-focused schema
const userSchema = new mongoose_1.default.Schema({
    // ===== CORE USER FIELDS =====
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Full name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email address'
        }
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === "local";
        },
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Don't include in queries by default
    },
    bio: {
        type: String,
        default: "",
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    profilePic: {
        type: String,
        default: "",
        validate: {
            validator: function (v) {
                return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v);
            },
            message: 'Profile picture must be a valid image URL'
        }
    },
    location: {
        type: String,
        default: "",
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    website: {
        type: String,
        default: "",
        validate: {
            validator: function (v) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Website must be a valid URL'
        }
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    authProvider: {
        type: String,
        enum: ["local", "google", "github", "facebook"],
        default: "local"
    },
    providerId: {
        type: String,
        default: ""
    },
    lastLogin: {
        type: Date
    },
    // ===== STUDY MATERIAL FIELDS =====
    savedMaterials: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'StudyMaterial'
        }],
    uploadedMaterials: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'StudyMaterial'
        }],
    studyStats: {
        materialsViewed: {
            type: Number,
            default: 0,
            min: [0, 'Materials viewed cannot be negative']
        },
        materialsSaved: {
            type: Number,
            default: 0,
            min: [0, 'Materials saved cannot be negative']
        },
        materialsCreated: {
            type: Number,
            default: 0,
            min: [0, 'Materials created cannot be negative']
        },
        ratingsGiven: {
            type: Number,
            default: 0,
            min: [0, 'Ratings given cannot be negative']
        }
    },
    // ===== ACADEMIC FIELDS =====
    role: {
        type: String,
        enum: {
            values: ['student', 'professor', 'admin', 'guest'],
            message: '{VALUE} is not a valid role'
        },
        default: 'student'
    },
    academic: {
        studentId: {
            type: String,
            trim: true,
            uppercase: true,
            maxlength: [20, 'Student ID cannot exceed 20 characters'],
            validate: {
                validator: function (v) {
                    return !v || /^[A-Z0-9]+$/.test(v);
                },
                message: 'Student ID can only contain letters and numbers'
            }
        },
        school: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'School'
        },
        program: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Program'
        },
        currentSemester: {
            type: Number,
            min: [1, 'Current semester must be at least 1'],
            max: [8, 'Current semester cannot exceed 8']
        },
        enrollmentYear: {
            type: Number,
            min: [2020, 'Enrollment year must be 2020 or later'],
            max: [new Date().getFullYear() + 1, 'Enrollment year cannot be in the future']
        },
        completedCourses: [{
                type: String,
                uppercase: true,
                validate: {
                    validator: function (v) {
                        return /^[A-Z]{3}[0-9]{3}$/.test(v);
                    },
                    message: 'Course code must follow format: 3 letters + 3 numbers (e.g., IPC144)'
                }
            }],
        status: {
            type: String,
            enum: {
                values: ['active', 'graduated', 'suspended'],
                message: '{VALUE} is not a valid academic status'
            },
            default: 'active'
        }
    },
    // ===== USER PREFERENCES =====
    preferences: {
        theme: {
            type: String,
            enum: {
                values: ['light', 'dark', 'system'],
                message: '{VALUE} is not a valid theme'
            },
            default: 'system'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            newMaterials: {
                type: Boolean,
                default: true
            },
            courseUpdates: {
                type: Boolean,
                default: true
            }
        },
        privacy: {
            showProfile: {
                type: Boolean,
                default: true
            },
            showActivity: {
                type: Boolean,
                default: false
            }
        }
    },
    // ===== ACTIVITY TRACKING =====
    activity: {
        loginCount: {
            type: Number,
            default: 0,
            min: [0, 'Login count cannot be negative']
        },
        uploadCount: {
            type: Number,
            default: 0,
            min: [0, 'Upload count cannot be negative']
        },
        downloadCount: {
            type: Number,
            default: 0,
            min: [0, 'Download count cannot be negative']
        },
        contributionScore: {
            type: Number,
            default: 0,
            min: [0, 'Contribution score cannot be negative']
        }
    },
    // ===== STATUS FIELDS =====
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // ===== SECURITY FIELDS =====
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    emailVerificationToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.passwordResetToken;
            delete ret.passwordResetExpires;
            delete ret.emailVerificationToken;
            return ret;
        }
    },
    toObject: { virtuals: true }
});
// ===== INDEXES FOR PERFORMANCE =====
userSchema.index({ 'academic.studentId': 1 });
userSchema.index({ 'academic.program': 1 });
userSchema.index({ 'academic.school': 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, isVerified: 1 });
userSchema.index({ fullName: 'text', email: 'text', bio: 'text' });
// Compound indexes for common queries
userSchema.index({ 'academic.school': 1, 'academic.program': 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'activity.contributionScore': -1, lastLogin: -1 });
// ===== VIRTUAL FIELDS =====
userSchema.virtual('academicInfo').get(function () {
    var _a;
    if (!((_a = this.academic) === null || _a === void 0 ? void 0 : _a.program))
        return null;
    return {
        program: this.academic.program,
        school: this.academic.school,
        semester: this.academic.currentSemester,
        year: this.academic.enrollmentYear,
        status: this.academic.status,
        studentId: this.academic.studentId
    };
});
userSchema.virtual('contributionLevel').get(function () {
    const score = this.activity.contributionScore;
    if (score >= 1000)
        return 'Expert';
    if (score >= 500)
        return 'Advanced';
    if (score >= 100)
        return 'Intermediate';
    if (score >= 10)
        return 'Beginner';
    return 'Newcomer';
});
userSchema.virtual('isStudent').get(function () {
    return this.role === 'student';
});
userSchema.virtual('isProfessor').get(function () {
    return this.role === 'professor';
});
userSchema.virtual('isAdmin').get(function () {
    return this.role === 'admin';
});
// ===== MIDDLEWARE =====
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password") || !this.password)
            return next();
        try {
            const salt = yield bcryptjs_1.default.genSalt(12);
            this.password = yield bcryptjs_1.default.hash(this.password, salt);
            next();
        }
        catch (error) {
            console.error("Password hashing error:", error);
            next(error);
        }
    });
});
// Update contribution score when materials are created
userSchema.pre("save", function (next) {
    if (this.isModified('studyStats.materialsCreated') &&
        this.studyStats &&
        this.activity) {
        // Award points for material creation
        const materialsCreated = this.studyStats.materialsCreated || 0;
        this.activity.contributionScore = Math.max(this.activity.contributionScore || 0, materialsCreated * 10 // 10 points per material
        );
    }
    next();
});
// ✅ Enhanced pre-save hooks for data formatting
userSchema.pre("save", function (next) {
    var _a;
    // ✅ Format full name with proper capitalization
    if (this.isModified('fullName') && this.fullName) {
        this.fullName = this.fullName
            .split(' ')
            .map(name => (0, Format_utils_1.capitalize)(name.trim()))
            .filter(name => name.length > 0)
            .join(' ');
    }
    // ✅ Format location with proper capitalization
    if (this.isModified('location') && this.location) {
        this.location = (0, Format_utils_1.capitalize)(this.location.trim());
    }
    // ✅ Clean and validate bio content
    if (this.isModified('bio') && this.bio) {
        this.bio = this.bio.trim();
        // Remove excessive whitespace
        this.bio = this.bio.replace(/\s+/g, ' ');
    }
    // ✅ Generate student ID if student role and no ID exists
    if (this.role === 'student' && this.academic && !this.academic.studentId) {
        this.academic.studentId = (0, Random_utils_1.generateStudentId)();
    }
    // ✅ Uppercase student ID if provided
    if (this.isModified('academic.studentId') && ((_a = this.academic) === null || _a === void 0 ? void 0 : _a.studentId)) {
        this.academic.studentId = this.academic.studentId.toUpperCase().trim();
    }
    // ✅ Validate and format website URL
    if (this.isModified('website') && this.website) {
        this.website = this.website.trim();
        if (this.website && !this.website.startsWith('http://') && !this.website.startsWith('https://')) {
            this.website = 'https://' + this.website;
        }
    }
    next();
});
// ✅ Pre-save hook for academic data validation
userSchema.pre("save", function (next) {
    // Validate academic consistency
    if (this.role === 'student') {
        // Ensure students have academic information
        if (!this.academic) {
            this.academic = {
                completedCourses: [],
                status: 'active'
            };
        }
        // Set default enrollment year if not provided
        if (!this.academic.enrollmentYear) {
            this.academic.enrollmentYear = new Date().getFullYear();
        }
        // Set default current semester if not provided
        if (!this.academic.currentSemester) {
            this.academic.currentSemester = 1;
        }
    }
    next();
});
// ===== INSTANCE METHODS =====
userSchema.methods.matchPassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.password)
            return false;
        return yield bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
userSchema.methods.saveMaterial = function (materialId) {
    if (!this.savedMaterials.includes(materialId)) {
        this.savedMaterials.push(materialId);
        this.studyStats.materialsSaved += 1;
    }
    return this.save();
};
userSchema.methods.unsaveMaterial = function (materialId) {
    this.savedMaterials = this.savedMaterials.filter(id => !id.equals(materialId));
    if (this.studyStats.materialsSaved > 0) {
        this.studyStats.materialsSaved -= 1;
    }
    return this.save();
};
userSchema.methods.generateAuthToken = function () {
    const payload = {
        id: this._id,
        email: this.email,
        role: this.role
    };
    const secret = process.env.JWT_SECRET_KEY || 'fallback-secret';
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d')
    };
    return jwt.sign(payload, secret, options);
};
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    this.activity.loginCount += 1;
    return this.save();
};
userSchema.methods.incrementUploadCount = function () {
    this.activity.uploadCount += 1;
    this.activity.contributionScore += 10; // 10 points per upload
    this.studyStats.materialsCreated += 1;
    return this.save();
};
userSchema.methods.incrementDownloadCount = function () {
    this.activity.downloadCount += 1;
    this.activity.contributionScore += 1; // 1 point per download
    return this.save();
};
// Academic-specific methods
userSchema.methods.addCompletedCourse = function (courseCode) {
    if (!this.academic) {
        this.academic = {
            completedCourses: [],
            status: 'active'
        };
    }
    if (!this.academic.completedCourses.includes(courseCode.toUpperCase())) {
        this.academic.completedCourses.push(courseCode.toUpperCase());
        this.activity.contributionScore += 5; // 5 points per completed course
    }
    return this.save();
};
userSchema.methods.updateAcademicStatus = function (status) {
    if (!this.academic) {
        this.academic = {
            completedCourses: [],
            status: 'active'
        };
    }
    this.academic.status = status;
    return this.save();
};
// ===== STATIC METHODS =====
userSchema.statics.findByProgram = function (programId) {
    return this.find({
        'academic.program': programId,
        isActive: true,
        isVerified: true
    }).select('fullName email academic.currentSemester academic.status profilePic activity.contributionScore');
};
userSchema.statics.findBySchool = function (schoolId) {
    return this.find({
        'academic.school': schoolId,
        isActive: true,
        isVerified: true
    }).select('fullName email academic activity.contributionScore role');
};
userSchema.statics.getTopContributors = function (limit = 10) {
    return this.find({
        isActive: true,
        'activity.contributionScore': { $gt: 0 }
    }).sort({ 'activity.contributionScore': -1 })
        .limit(limit)
        .select('fullName profilePic activity.contributionScore activity.uploadCount role academic');
};
userSchema.statics.findStudentsInSemester = function (semester, programId) {
    const query = {
        role: 'student',
        'academic.currentSemester': semester,
        isActive: true
    };
    if (programId) {
        query['academic.program'] = programId;
    }
    return this.find(query)
        .populate('academic.program', 'name code')
        .populate('academic.school', 'name')
        .select('fullName email academic profilePic activity.contributionScore');
};
// Create model with clean interface
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map