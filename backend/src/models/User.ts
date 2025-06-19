import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; 
    id: string;  
    fullName: string;
    email: string;
    password?: string;
    bio: string;
    profilePic: string;
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
    website: string;
    isOnboarded: boolean;
    friends: mongoose.Types.ObjectId[] | IUser[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    authProvider: "local" | "google" | "github" | "facebook";
    providerId?: string;
    
    // ===== EXISTING STUDY MATERIAL FIELDS =====
    savedMaterials: mongoose.Types.ObjectId[];
    uploadedMaterials: mongoose.Types.ObjectId[];
    preferredLanguages: string[];
    currentLevel: Map<string, 'beginner' | 'intermediate' | 'advanced'>;
    studyStats: IStudyStats;
    
    // ===== NEW ACADEMIC FIELDS =====
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
    
    // ===== NEW PREFERENCES =====
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
    
    // ===== ENHANCED ACTIVITY TRACKING =====
    activity: {
        loginCount: number;
        uploadCount: number;
        downloadCount: number;
        contributionScore: number;
    };
    
    isActive: boolean;
    isVerified: boolean;
    
    // ===== EXISTING METHODS =====
    matchPassword(enteredPassword: string): Promise<boolean>;
    saveMaterial(materialId: mongoose.Types.ObjectId): Promise<IUser>;
    unsaveMaterial(materialId: mongoose.Types.ObjectId): Promise<IUser>;
    
    // ===== NEW METHODS =====
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
    materialsSaved: number;
    materialsCreated: number;
    ratingsGiven: number;
}

// Enhanced schema - merge with existing
const userSchema = new mongoose.Schema({
    // ===== EXISTING FIELDS =====
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
                return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v);
            },
            message: 'Profile picture must be a valid image URL'
        }
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
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
    
    // ===== EXISTING STUDY MATERIAL FIELDS =====
    savedMaterials: [{
        type: Schema.Types.ObjectId,
        ref: 'StudyMaterial'
    }],
    uploadedMaterials: [{
        type: Schema.Types.ObjectId,
        ref: 'StudyMaterial'
    }],
    preferredLanguages: [{
        type: String,
        lowercase: true
    }],
    currentLevel: {
        type: Map,
        of: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced']
        }
    },
    studyStats: {
        materialsViewed: {
            type: Number,
            default: 0
        },
        materialsSaved: {
            type: Number,
            default: 0
        },
        materialsCreated: {
            type: Number,
            default: 0
        },
        ratingsGiven: {
            type: Number,
            default: 0
        }
    },
    
    // ===== NEW ACADEMIC FIELDS =====
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
            maxlength: [20, 'Student ID cannot exceed 20 characters']
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
                message: 'Course code must follow format: 3 letters + 3 numbers'
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
    
    // ===== NEW PREFERENCES =====
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
    
    // ===== ENHANCED ACTIVITY TRACKING =====
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
    
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    
    // Password reset fields
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    
    // Email verification
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
            delete ret.passwordResetToken;
            delete ret.passwordResetExpires;
            delete ret.emailVerificationToken;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// ===== INDEXES =====
// userSchema.index({ email: 1 });
userSchema.index({ 'academic.studentId': 1 });
userSchema.index({ 'academic.program': 1 });
userSchema.index({ 'academic.school': 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, isVerified: 1 });
userSchema.index({ fullName: 'text', email: 'text' });

// ===== VIRTUALS =====
userSchema.virtual('academicInfo').get(function(this: IUser) {
    if (!this.academic?.program) return null;
    return {
        program: this.academic.program,
        semester: this.academic.currentSemester,
        year: this.academic.enrollmentYear,
        status: this.academic.status
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

// ===== EXISTING MIDDLEWARE =====
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(12); // Increased from 10 to 12
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        console.error("Error: ", error);
        next(error);
    }
});

// ===== EXISTING METHODS =====
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.saveMaterial = function(
    this: IUser, 
    materialId: mongoose.Types.ObjectId
): Promise<IUser> {
    if (!this.savedMaterials.includes(materialId)) {
        this.savedMaterials.push(materialId);
        this.studyStats.materialsSaved += 1;
    }
    return this.save();
};

userSchema.methods.unsaveMaterial = function(
    this: IUser, 
    materialId: mongoose.Types.ObjectId
): Promise<IUser> {
    this.savedMaterials = this.savedMaterials.filter(id => !id.equals(materialId));
    if (this.studyStats.materialsSaved > 0) {
        this.studyStats.materialsSaved -= 1;
    }
    return this.save();
};

// ===== NEW METHODS =====
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
    this.studyStats.materialsCreated += 1; // Sync with existing studyStats
    return this.save();
};

userSchema.methods.incrementDownloadCount = function(this: IUser): Promise<IUser> {
    this.activity.downloadCount += 1;
    return this.save();
};

// ===== STATIC METHODS =====
userSchema.statics.findByProgram = function(programId: string) {
    return this.find({ 
        'academic.program': programId,
        isActive: true,
        isVerified: true
    }).select('fullName email academic.currentSemester academic.status');
};

userSchema.statics.getTopContributors = function(limit: number = 10) {
    return this.find({
        isActive: true,
        'activity.contributionScore': { $gt: 0 }
    }).sort({ 'activity.contributionScore': -1 })
        .limit(limit)
        .select('fullName profilePic activity.contributionScore activity.uploadCount');
};

// Create model with enhanced interface
const User = mongoose.model<IUser>("User", userSchema);

export default User;