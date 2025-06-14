import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Định nghĩa interface cho user document
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; 
    id: string;  
    fullName: string;
    email: string;
    password?: string; // Make optional for OAuth users
    bio: string;
    profilePic: string;
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
    isOnboarded: boolean;
    friends: mongoose.Types.ObjectId[] | IUser[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    authProvider: "local" | "google" | "github" | "facebook";
    providerId?: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
    // Study Material related fields
    savedMaterials: mongoose.Types.ObjectId[];
    uploadedMaterials: mongoose.Types.ObjectId[];
    preferredLanguages: string[];
    currentLevel: Map<string, 'beginner' | 'intermediate' | 'advanced'>;
    studyStats: IStudyStats;
    // New study material methods
    saveMaterial(materialId: mongoose.Types.ObjectId): Promise<IUser>;
    unsaveMaterial(materialId: mongoose.Types.ObjectId): Promise<IUser>;
}

export interface IStudyStats {
    materialsViewed: number;
    materialsSaved: number;
    materialsCreated: number;
    ratingsGiven: number;
}

// Định nghĩa schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function (this: IUser): boolean {
            return this.authProvider === "local"; // Password only required for local auth
        },
        minlength: 6,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
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
        default: ""
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },

    //trường friend được viết theo kiểu tham chiếu (chỉ lưu ID của đối tượng con = khóa ngoại trong sql)
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
    // Study Material related fields
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
    }
}, { timestamps: true });

// Middleware trước khi lưu
userSchema.pre("save", async function (next) {
    //nếu password không thay đổi hoặc không có password (OAuth) thì bỏ qua
    if (!this.isModified("password") || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        console.error("Error: ", error);
        next(error);
    }
});

// Method để so sánh password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    if (!this.password) return false; // OAuth users don't have password
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

// Tạo model với generic type
const User = mongoose.model<IUser>("User", userSchema);

export default User;