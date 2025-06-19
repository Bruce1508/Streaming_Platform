import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBookmark extends Document {
    user: mongoose.Types.ObjectId;
    studyMaterial: mongoose.Types.ObjectId;
    
    // Bookmark organization
    folder?: string; // Custom folder name like "Midterm Prep", "Final Review"
    tags: string[];
    notes?: string; // Personal notes about this material
    
    // Metadata
    isPrivate: boolean;
    priority: 'low' | 'medium' | 'high';
    reminderDate?: Date; // Optional reminder to review this material
    
    // Usage tracking
    accessCount: number;
    lastAccessedAt?: Date;
    
    createdAt: Date;
    updatedAt: Date;
}

export interface IBookmarkModel extends Model<IBookmark> {
    findByUser(userId: string, options?: any): Promise<IBookmark[]>;
    findByFolder(userId: string, folder: string): Promise<IBookmark[]>;
    getUserFolders(userId: string): Promise<string[]>;
    getMostAccessed(userId: string, limit?: number): Promise<IBookmark[]>;
    getUpcomingReminders(userId: string): Promise<IBookmark[]>;
}

const bookmarkSchema = new Schema<IBookmark, IBookmarkModel>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    
    studyMaterial: {
        type: Schema.Types.ObjectId,
        ref: 'StudyMaterial',
        required: [true, 'Study material is required']
    },
    
    folder: {
        type: String,
        trim: true,
        maxlength: [50, 'Folder name cannot exceed 50 characters'],
        validate: {
            validator: function(v: string) {
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
            validator: function(v: Date) {
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
bookmarkSchema.virtual('daysSinceLastAccess').get(function(this: IBookmark) {
    if (!this.lastAccessedAt) return null;
    const diffTime = Math.abs(new Date().getTime() - this.lastAccessedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for reminder status
bookmarkSchema.virtual('reminderStatus').get(function(this: IBookmark) {
    if (!this.reminderDate) return 'none';
    const now = new Date();
    const diff = this.reminderDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'overdue';
    if (daysLeft === 0) return 'today';
    if (daysLeft <= 3) return 'soon';
    return 'upcoming';
});

// Pre-save middleware to update material saves count
bookmarkSchema.pre<IBookmark>('save', async function(next) {
    if (this.isNew) {
        // Increment saves count on StudyMaterial
        await mongoose.model('StudyMaterial').findByIdAndUpdate(
            this.studyMaterial,
            { $inc: { saves: 1 } }
        );
    }
    next();
});

// Pre-remove middleware to decrement material saves count
bookmarkSchema.pre<IBookmark>('deleteOne', { document: true, query: false }, async function(next) {
    // Decrement saves count on StudyMaterial
    await mongoose.model('StudyMaterial').findByIdAndUpdate(
        this.studyMaterial,
        { $inc: { saves: -1 } }
    );
    next();
});

// Static methods
bookmarkSchema.statics.findByUser = function(
    userId: string,
    options: any = {}
): Promise<IBookmark[]> {
    const query: any = { user: userId };
    
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

bookmarkSchema.statics.findByFolder = function(
    userId: string,
    folder: string
): Promise<IBookmark[]> {
    return this.find({ user: userId, folder })
        .populate('studyMaterial', 'title description category academic.course averageRating')
        .sort({ createdAt: -1 });
};

bookmarkSchema.statics.getUserFolders = function(
    userId: string
): Promise<string[]> {
    return this.distinct('folder', {
        user: userId,
        folder: { $nin: [null, ''] }
    });
};

bookmarkSchema.statics.getMostAccessed = function(
    userId: string,
    limit: number = 10
): Promise<IBookmark[]> {
    return this.find({ user: userId })
        .populate('studyMaterial', 'title description category')
        .sort({ accessCount: -1, lastAccessedAt: -1 })
        .limit(limit);
};

bookmarkSchema.statics.getUpcomingReminders = function(
    userId: string
): Promise<IBookmark[]> {
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
bookmarkSchema.methods.markAccessed = function(this: IBookmark) {
    this.accessCount += 1;
    this.lastAccessedAt = new Date();
    return this.save();
};

bookmarkSchema.methods.updateFolder = function(this: IBookmark, newFolder: string) {
    this.folder = newFolder;
    return this.save();
};

bookmarkSchema.methods.addTags = function(this: IBookmark, newTags: string[]) {
    const uniqueTags = [...new Set([...this.tags, ...newTags])];
    this.tags = uniqueTags;
    return this.save();
};

bookmarkSchema.methods.removeTags = function(this: IBookmark, tagsToRemove: string[]) {
    this.tags = this.tags.filter(tag => !tagsToRemove.includes(tag));
    return this.save();
};

export const Bookmark = mongoose.model<IBookmark, IBookmarkModel>('Bookmark', bookmarkSchema);
export default Bookmark;