import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Định nghĩa interface cho user document
export interface IUser extends Document {
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
    languageLevel: {
        type: String,
        default: "beginner",
        enum: ['beginner', 'intermediate', 'advanced']
    },
    interests: [{
        type: String,
        enum: ['music', 'movies', 'books', 'games', 'sports', 'travel', 'food', 'tech', 'nature', 'art']
    }],
    timezone: {
        type: String,
        default: ""
    },
    availability: {
        preferredTime: [{
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night']
        }],
        weekdays: [Number], //0-6
    },
    learningGoals: {
        type: String,
        maxLength: 500
    },
    speakingPace: {
        type: String,
        enum: ['slow', 'normal', 'fast'],
        default: 'normal'
    },
    preferences: {
        ageRange: {
            min: { type: Number, default: 18 },
            max: { type: Number, default: 100 }
        },
        genderPreference: {
            type: String,
            enum: ['male', 'female', 'any'],
            default: 'any'
        }
    },
    location: {
        type: String,
        default: "",
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

// Tạo model với generic type
const User = mongoose.model<IUser>("User", userSchema);

export default User;