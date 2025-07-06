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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookmark = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookmarkSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    studyMaterial: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'StudyMaterial',
        required: [true, 'Study material is required']
    },
    folder: {
        type: String,
        trim: true,
        maxlength: [50, 'Folder name cannot exceed 50 characters'],
        validate: {
            validator: function (v) {
                return !v || /^[a-zA-Z0-9\s\-_]+$/.test(v);
            },
            message: 'Folder name can only contain letters, numbers, spaces, hyphens, and underscores'
        }
    },
    tags: [{
            type: String,
            trim: true,
            lowercase: true,
            maxlength: [30, 'Tag cannot exceed 30 characters']
        }],
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        trim: true
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: 'Priority must be low, medium, or high'
        },
        default: 'medium'
    },
    reminderDate: {
        type: Date,
        validate: {
            validator: function (v) {
                return !v || v > new Date();
            },
            message: 'Reminder date must be in the future'
        }
    },
    accessCount: {
        type: Number,
        default: 0,
        min: [0, 'Access count cannot be negative']
    },
    lastAccessedAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes for better performance
bookmarkSchema.index({ user: 1, createdAt: -1 });
bookmarkSchema.index({ user: 1, folder: 1 });
bookmarkSchema.index({ user: 1, studyMaterial: 1 }, { unique: true }); // One bookmark per user per material
bookmarkSchema.index({ user: 1, priority: 1 });
bookmarkSchema.index({ user: 1, reminderDate: 1 });
bookmarkSchema.index({ tags: 1 });
// Virtual for time since last access
bookmarkSchema.virtual('daysSinceLastAccess').get(function () {
    if (!this.lastAccessedAt)
        return null;
    const diffTime = Math.abs(new Date().getTime() - this.lastAccessedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
// Virtual for reminder status
bookmarkSchema.virtual('reminderStatus').get(function () {
    if (!this.reminderDate)
        return 'none';
    const now = new Date();
    const diff = this.reminderDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (daysLeft < 0)
        return 'overdue';
    if (daysLeft === 0)
        return 'today';
    if (daysLeft <= 3)
        return 'soon';
    return 'upcoming';
});
// Pre-save middleware to update material saves count
bookmarkSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew) {
            // Increment saves count on StudyMaterial
            yield mongoose_1.default.model('StudyMaterial').findByIdAndUpdate(this.studyMaterial, { $inc: { saves: 1 } });
        }
        next();
    });
});
// Pre-remove middleware to decrement material saves count
bookmarkSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Decrement saves count on StudyMaterial
        yield mongoose_1.default.model('StudyMaterial').findByIdAndUpdate(this.studyMaterial, { $inc: { saves: -1 } });
        next();
    });
});
// Static methods
bookmarkSchema.statics.findByUser = function (userId, options = {}) {
    const query = { user: userId };
    if (options.folder) {
        query.folder = options.folder;
    }
    if (options.priority) {
        query.priority = options.priority;
    }
    if (options.tags && options.tags.length > 0) {
        query.tags = { $in: options.tags };
    }
    return this.find(query)
        .populate('studyMaterial', 'title description category academic.course averageRating views')
        .populate('studyMaterial.academic.course', 'code name')
        .sort(options.sort || { createdAt: -1 })
        .limit(options.limit || 50);
};
bookmarkSchema.statics.findByFolder = function (userId, folder) {
    return this.find({ user: userId, folder })
        .populate('studyMaterial', 'title description category academic.course averageRating')
        .sort({ createdAt: -1 });
};
bookmarkSchema.statics.getUserFolders = function (userId) {
    return this.distinct('folder', {
        user: userId,
        folder: { $nin: [null, ''] }
    });
};
bookmarkSchema.statics.getMostAccessed = function (userId, limit = 10) {
    return this.find({ user: userId })
        .populate('studyMaterial', 'title description category')
        .sort({ accessCount: -1, lastAccessedAt: -1 })
        .limit(limit);
};
bookmarkSchema.statics.getUpcomingReminders = function (userId) {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.find({
        user: userId,
        reminderDate: {
            $gte: now,
            $lte: nextWeek
        }
    })
        .populate('studyMaterial', 'title description category')
        .sort({ reminderDate: 1 });
};
// Instance methods
bookmarkSchema.methods.markAccessed = function () {
    this.accessCount += 1;
    this.lastAccessedAt = new Date();
    return this.save();
};
bookmarkSchema.methods.updateFolder = function (newFolder) {
    this.folder = newFolder;
    return this.save();
};
bookmarkSchema.methods.addTags = function (newTags) {
    const uniqueTags = [...new Set([...this.tags, ...newTags])];
    this.tags = uniqueTags;
    return this.save();
};
bookmarkSchema.methods.removeTags = function (tagsToRemove) {
    this.tags = this.tags.filter(tag => !tagsToRemove.includes(tag));
    return this.save();
};
exports.Bookmark = mongoose_1.default.model('Bookmark', bookmarkSchema);
exports.default = exports.Bookmark;
//# sourceMappingURL=BookMark.js.map