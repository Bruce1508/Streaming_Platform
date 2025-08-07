import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { 
    capitalize, 
    truncate,
    maskEmail 
} from '../utils/Format.utils';
import { generateStudentId } from '../utils/Random.utils';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; 
    id: string;  
    fullName: string;
    email: string;
    password?: string;
    bio: string;
    profilePic: string;
    location: string;
    website: string;
    isOnboarded: boolean;
    friends: mongoose.Types.ObjectId[] | IUser[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    authProvider: "local" | "google" | "github" | "facebook";
    providerId?: string;
    
    // ===== STUDY MATERIAL FIELDS =====
    uploadedMaterials: mongoose.Types.ObjectId[];
    studyStats: IStudyStats;
    
    // ===== FORUM FIELDS =====
    savedPosts: mongoose.Types.ObjectId[];
    
    // ===== ACADEMIC FIELDS =====
    role: 'student' | 'professor' | 'admin' | 'guest';
    academic?: {
        studentId?: string;
        school?: mongoose.Types.ObjectId;
        program?: mongoose.Types.ObjectId;
        currentSemester?: number;
        enrollmentYear?: number;
        completedCourses: string[];
        status: 'active' | 'graduated' | 'suspended';
    };
    
    // ===== PREFERENCES =====
    preferences: {
        theme: 'light' | 'dark' | 'system';
        notifications: {
            email: boolean;
            push: boolean;
            newMaterials: boolean;
            courseUpdates: boolean;
        };
        privacy: {
            showProfile: boolean;
            showActivity: boolean;
        };
    };
    
    // ===== ACTIVITY TRACKING =====
    activity: {
        loginCount: number;
        uploadCount: number;
        downloadCount: number;
        contributionScore: number;
    };
    
    isActive: boolean;
    isVerified: boolean;
    verificationStatus: 'unverified' | 'email-verified' | 'edu-verified' | 'manual-verified' | 'non-student';
    verificationMethod: 'none' | 'email-link' | 'edu-domain' | 'edu-pattern' | 'admin-manual' | 'oauth-pending' | 'magic-link';
    hasTemporaryPassword: boolean; // ✅ Track if user has temporary password from magic link
    institutionInfo: {
        name: string;
        domain: string;
        type: 'university' | 'college' | 'polytechnic' | 'institute' | '';
    };
    
    // ===== METHODS =====
    matchPassword(enteredPassword: string): Promise<boolean>;
    savePost(postId: mongoose.Types.ObjectId): Promise<IUser>;
    unsavePost(postId: mongoose.Types.ObjectId): Promise<IUser>;
    generateAuthToken(): string;
    updateLastLogin(): Promise<IUser>;
    incrementUploadCount(): Promise<IUser>;
    incrementDownloadCount(): Promise<IUser>;
    
    // ===== VIRTUAL FIELDS =====
    contributionLevel?: string;
    academicInfo?: any;
}

export interface IStudyStats {
    materialsViewed: number;
    materialsCreated: number;
    ratingsGiven: number;
}

// ✅ CLEANED Academic-focused schema
const userSchema = new mongoose.Schema({
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
            validator: function(v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email address'
        }
    },
    password: {
        type: String,
        required: function (this: IUser): boolean {
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
            validator: function(v: string) {
                // Allow empty string or valid HTTPS/HTTP URLs (including Google, GitHub, etc.)
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Profile picture must be a valid URL'
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
            validator: function(v: string) {
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
        type: mongoose.Schema.Types.ObjectId,
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
    uploadedMaterials: [{
        type: Schema.Types.ObjectId,
        ref: 'StudyMaterial'
    }],
    
    // ===== FORUM FIELDS =====
    savedPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'ForumPost'
    }],
    studyStats: {
        materialsViewed: {
            type: Number,
            default: 0,
            min: [0, 'Materials viewed cannot be negative']
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
                validator: function(v: string) {
                    return !v || /^[A-Z0-9]+$/.test(v);
                },
                message: 'Student ID can only contain letters and numbers'
            }
        },
        school: {
            type: Schema.Types.ObjectId,
            ref: 'School'
        },
        program: {
            type: Schema.Types.ObjectId,
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
                validator: function(v: string) {
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
    verificationStatus: {
        type: String,
        enum: {
            values: ['unverified', 'email-verified', 'edu-verified', 'manual-verified', 'non-student'],
            message: '{VALUE} is not a valid verification status'
        },
        default: 'unverified'
    },
    verificationMethod: {
        type: String,
        enum: {
            values: ['none', 'email-link', 'edu-domain', 'edu-pattern', 'admin-manual', 'oauth-pending', 'magic-link'],
            message: '{VALUE} is not a valid verification method'
        },
        default: 'none'
    },
    hasTemporaryPassword: {
        type: Boolean,
        default: false
    },
    institutionInfo: {
        name: {
            type: String,
            default: ''
        },
        domain: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            enum: ['university', 'college', 'polytechnic', 'institute', ''],
            default: ''
        }
    },
    
    // ===== SECURITY FIELDS =====
    emailVerificationToken: {
        type: String,
        select: false
    }
}, { 
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
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
userSchema.virtual('academicInfo').get(function(this: IUser) {
    if (!this.academic?.program) return null;
    return {
        program: this.academic.program,
        school: this.academic.school,
        semester: this.academic.currentSemester,
        year: this.academic.enrollmentYear,
        status: this.academic.status,
        studentId: this.academic.studentId
    };
});

userSchema.virtual('contributionLevel').get(function(this: IUser) {
    const score = this.activity.contributionScore;
    if (score >= 1000) return 'Expert';
    if (score >= 500) return 'Advanced';
    if (score >= 100) return 'Intermediate';
    if (score >= 10) return 'Beginner';
    return 'Newcomer';
});

userSchema.virtual('isStudent').get(function(this: IUser) {
    return this.role === 'student';
});

userSchema.virtual('isProfessor').get(function(this: IUser) {
    return this.role === 'professor';
});

userSchema.virtual('isAdmin').get(function(this: IUser) {
    return this.role === 'admin';
});

// ===== MIDDLEWARE =====
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        console.error("Password hashing error:", error);
        next(error);
    }
});

// Update contribution score when materials are created
userSchema.pre("save", function (next) {
    if (
        this.isModified('studyStats.materialsCreated') &&
        this.studyStats &&
        this.activity
    ) {
        // Award points for material creation
        const materialsCreated = this.studyStats.materialsCreated || 0;
        this.activity.contributionScore = Math.max(
            this.activity.contributionScore || 0,
            materialsCreated * 10 // 10 points per material
        );
    }
    next();
});

// ✅ Enhanced pre-save hooks for data formatting
userSchema.pre("save", function (next) {
    // ✅ Format full name with proper capitalization
    if (this.isModified('fullName') && this.fullName) {
        this.fullName = this.fullName
            .split(' ')
            .map(name => capitalize(name.trim()))
            .filter(name => name.length > 0)
            .join(' ');
    }
    
    // ✅ Format location with proper capitalization
    if (this.isModified('location') && this.location) {
        this.location = capitalize(this.location.trim());
    }
    
    // ✅ Clean and validate bio content
    if (this.isModified('bio') && this.bio) {
        this.bio = this.bio.trim();
        // Remove excessive whitespace
        this.bio = this.bio.replace(/\s+/g, ' ');
    }
    
    // ✅ Generate student ID if student role and no ID exists
    if (this.role === 'student' && this.academic && !this.academic.studentId) {
        this.academic.studentId = generateStudentId();
    }
    
    // ✅ Uppercase student ID if provided
    if (this.isModified('academic.studentId') && this.academic?.studentId) {
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
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// ===== FORUM POST METHODS =====
userSchema.methods.savePost = function(
    this: IUser,
    postId: mongoose.Types.ObjectId
): Promise<IUser> {
    if (!this.savedPosts.includes(postId)) {
        this.savedPosts.push(postId);
    }
    return this.save();
};

userSchema.methods.unsavePost = function(
    this: IUser,
    postId: mongoose.Types.ObjectId
): Promise<IUser> {
    this.savedPosts = this.savedPosts.filter(id => !id.equals(postId));
    return this.save();
};

userSchema.methods.generateAuthToken = function(this: IUser): string {
    const payload: jwt.JwtPayload = {
        id: this._id,
        email: this.email,
        role: this.role
    };
    const secret = process.env.JWT_SECRET_KEY || 'fallback-secret';
    const options: jwt.SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
    };
    return jwt.sign(payload, secret, options);
};

userSchema.methods.updateLastLogin = function(this: IUser): Promise<IUser> {
    this.lastLogin = new Date();
    this.activity.loginCount += 1;
    return this.save();
};

userSchema.methods.incrementUploadCount = function(this: IUser): Promise<IUser> {
    this.activity.uploadCount += 1;
    this.activity.contributionScore += 10; // 10 points per upload
    this.studyStats.materialsCreated += 1;
    return this.save();
};

userSchema.methods.incrementDownloadCount = function(this: IUser): Promise<IUser> {
    this.activity.downloadCount += 1;
    this.activity.contributionScore += 1; // 1 point per download
    return this.save();
};

// Academic-specific methods
userSchema.methods.addCompletedCourse = function(this: IUser, courseCode: string): Promise<IUser> {
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

userSchema.methods.updateAcademicStatus = function(
    this: IUser, 
    status: 'active' | 'graduated' | 'suspended'
): Promise<IUser> {
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
userSchema.statics.findByProgram = function(programId: string) {
    return this.find({ 
        'academic.program': programId,
        isActive: true,
        isVerified: true
    }).select('fullName email academic.currentSemester academic.status profilePic activity.contributionScore');
};

userSchema.statics.findBySchool = function(schoolId: string) {
    return this.find({ 
        'academic.school': schoolId,
        isActive: true,
        isVerified: true
    }).select('fullName email academic activity.contributionScore role');
};

userSchema.statics.getTopContributors = function(limit: number = 10) {
    return this.find({
        isActive: true,
        'activity.contributionScore': { $gt: 0 }
    }).sort({ 'activity.contributionScore': -1 })
        .limit(limit)
        .select('fullName profilePic activity.contributionScore activity.uploadCount role academic');
};

userSchema.statics.findStudentsInSemester = function(semester: number, programId?: string) {
    const query: any = {
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
const User = mongoose.model<IUser>("User", userSchema);

export default User;