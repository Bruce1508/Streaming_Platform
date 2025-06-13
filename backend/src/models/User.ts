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
    receivedFriendRequests: Array<{
        sender: mongoose.Types.ObjectId;
        createdAt: Date;
    }>;
    sentFriendRequests: mongoose.Types.ObjectId[];
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
    receivedFriendRequests: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    sentFriendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
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