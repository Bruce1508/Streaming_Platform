import mongoose, { Document, Schema, Model } from 'mongoose';

// ✅ Interface definitions
export interface IAttachment {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: Date;
}

export interface IRating {
    user: mongoose.Types.ObjectId;
    rating: number;
    createdAt: Date;
}

export interface IComment {
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStudyMaterial extends Document {
    title: string;
    description: string;
    content?: string;
    author: mongoose.Types.ObjectId;
    category: 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' | 'practice' | 'culture' | 'pronunciation';
    language: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    attachments: IAttachment[];
    views: number;
    saves: number;
    ratings: IRating[];
    averageRating: number;
    totalRatings: number;
    comments: IComment[];
    status: 'draft' | 'published' | 'archived';
    isPublic: boolean;
    isFeatured: boolean;
    isReported: boolean;
    reportCount: number;
    createdAt: Date;
    updatedAt: Date;
    
    // Virtual properties
    commentCount: number;
    
    // Instance methods
    incrementViews(): Promise<IStudyMaterial>;
    addRating(userId: mongoose.Types.ObjectId, rating: number): Promise<IStudyMaterial>;
    removeRating(userId: mongoose.Types.ObjectId): Promise<IStudyMaterial>;
}

// ✅ Static methods interface
export interface IStudyMaterialModel extends Model<IStudyMaterial> {
    findByCategory(category: string, options?: any): Promise<IStudyMaterial[]>;
    findFeatured(limit?: number): Promise<IStudyMaterial[]>;
    getCategoryStats(): Promise<any[]>;
}

// ✅ Schema definition
const studyMaterialSchema = new Schema<IStudyMaterial>({
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
    
    // Author reference
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Categorization
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['grammar', 'vocabulary', 'listening', 'speaking', 'reading', 'writing', 'practice', 'culture', 'pronunciation'],
            message: 'Invalid category'
        }
    },
    
    language: {
        type: String,
        required: [true, 'Language is required'],
        lowercase: true,
        trim: true
    },
    
    level: {
        type: String,
        required: [true, 'Level is required'],
        enum: {
            values: ['beginner', 'intermediate', 'advanced'],
            message: 'Level must be beginner, intermediate, or advanced'
        }
    },
    
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    
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
            required: true
        },
        size: {
            type: Number,
            required: true
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
            type: Schema.Types.ObjectId,
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
    
    // Comments system
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
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
    
    // Status and visibility
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    
    isPublic: {
        type: Boolean,
        default: true
    },
    
    // Featured content
    isFeatured: {
        type: Boolean,
        default: false
    },
    
    // Moderation
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

// ✅ Indexes for better query performance
studyMaterialSchema.index({ category: 1, language: 1, level: 1 });
studyMaterialSchema.index({ author: 1, status: 1 });
studyMaterialSchema.index({ averageRating: -1, views: -1 });
studyMaterialSchema.index({ createdAt: -1 });
studyMaterialSchema.index({ tags: 1 });
studyMaterialSchema.index({ 
    title: 'text', 
    description: 'text', 
    content: 'text',
    tags: 'text' 
});

// ✅ Virtual for comment count
studyMaterialSchema.virtual('commentCount').get(function(this: IStudyMaterial) {
    return this.comments ? this.comments.length : 0;
});

// ✅ Pre-save middleware to calculate average rating
studyMaterialSchema.pre<IStudyMaterial>('save', function(next) {
    if (this.ratings && this.ratings.length > 0) {
        const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        this.averageRating = Math.round((totalRating / this.ratings.length) * 10) / 10;
        this.totalRatings = this.ratings.length;
    } else {
        this.averageRating = 0;
        this.totalRatings = 0;
    }
    next();
});

// ✅ Static methods
studyMaterialSchema.statics.findByCategory = function(
    this: IStudyMaterialModel, 
    category: string, 
    options: any = {}
): Promise<IStudyMaterial[]> {
    const query = {
        category,
        status: 'published' as const,
        isPublic: true,
        ...options.filter
    };
    
    return this.find(query)
        .populate('author', 'username profilePicture')
        .sort(options.sort || { createdAt: -1 })
        .limit(options.limit || 20);
};

studyMaterialSchema.statics.findFeatured = function(
    this: IStudyMaterialModel, 
    limit: number = 10
): Promise<IStudyMaterial[]> {
    return this.find({
        isFeatured: true,
        status: 'published',
        isPublic: true
    })
    .populate('author', 'username profilePicture')
    .sort({ averageRating: -1, views: -1 })
    .limit(limit);
};

studyMaterialSchema.statics.getCategoryStats = function(this: IStudyMaterialModel) {
    return this.aggregate([
        {
            $match: {
                status: 'published',
                isPublic: true
            }
        },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                avgRating: { $avg: '$averageRating' },
                totalViews: { $sum: '$views' }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
};

// ✅ Instance methods
studyMaterialSchema.methods.incrementViews = function(this: IStudyMaterial): Promise<IStudyMaterial> {
    this.views += 1;
    return this.save();
};

studyMaterialSchema.methods.addRating = function(
    this: IStudyMaterial, 
    userId: mongoose.Types.ObjectId, 
    rating: number
): Promise<IStudyMaterial> {
    // Remove existing rating from same user
    this.ratings = this.ratings.filter(r => !r.user.equals(userId));
    
    // Add new rating
    this.ratings.push({
        user: userId,
        rating: rating,
        createdAt: new Date()
    });
    
    return this.save();
};

studyMaterialSchema.methods.removeRating = function(
    this: IStudyMaterial, 
    userId: mongoose.Types.ObjectId
): Promise<IStudyMaterial> {
    this.ratings = this.ratings.filter(r => !r.user.equals(userId));
    return this.save();
};

export const StudyMaterial = mongoose.model<IStudyMaterial, IStudyMaterialModel>('StudyMaterial', studyMaterialSchema);
export default StudyMaterial;