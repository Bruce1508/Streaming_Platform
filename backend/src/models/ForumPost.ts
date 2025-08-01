import mongoose, { Document, Schema } from 'mongoose';

export interface IForumPost extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    author: mongoose.Types.ObjectId; // Reference to User
    program?: mongoose.Types.ObjectId; // Reference to Program (optional)
    tags: string[];
    category: 'general' | 'course-specific' | 'assignment' | 'exam' | 'career' | 'question' | 'discussion';
    status: 'open' | 'closed' | 'resolved' | 'pinned';
    views: number;
    upvotes: mongoose.Types.ObjectId[]; // Array of user IDs
    downvotes: mongoose.Types.ObjectId[]; // Array of user IDs
    isPinned: boolean;
    isAnonymous: boolean;
    commentCount: number;
    lastActivity: Date;
    createdAt: Date;
    updatedAt: Date;
}

const forumPostSchema = new Schema<IForumPost>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        maxlength: [10000, 'Content cannot exceed 10000 characters']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    program: {
        type: Schema.Types.ObjectId,
        ref: 'Program',
        required: false
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    category: {
        type: String,
        enum: {
            values: ['general', 'course-specific', 'assignment', 'exam', 'career', 'question', 'discussion'],
            message: 'Invalid category'
        },
        required: [true, 'Category is required'],
        default: 'general'
    },
    status: {
        type: String,
        enum: {
            values: ['open', 'closed', 'resolved', 'pinned'],
            message: 'Invalid status'
        },
        required: [true, 'Status is required'],
        default: 'open'
    },
    views: {
        type: Number,
        default: 0,
        min: [0, 'Views cannot be negative']
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    commentCount: {
        type: Number,
        default: 0,
        min: [0, 'Comment count cannot be negative']
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
forumPostSchema.index({ author: 1, createdAt: -1 });
forumPostSchema.index({ program: 1, createdAt: -1 });
forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ tags: 1 });
// Text search index - currently using regex search instead to avoid query conflicts
// forumPostSchema.index({ title: 'text', content: 'text' });
forumPostSchema.index({ status: 1, isPinned: -1, createdAt: -1 });
forumPostSchema.index({ lastActivity: -1 });

// Virtual for vote count
// This is not stored in the database
// it is calculated automatically every time the post is voted on
// Frontend can use post.upvotes.length - post.downvotes.length to get the vote count
forumPostSchema.virtual('voteCount').get(function(this: IForumPost) {
    return this.upvotes.length - this.downvotes.length;
});

// Virtual for author info (for anonymous posts)
// automatically returns the author info for anonymous posts
// if the post is not anonymous, it returns the author info
// Frontend can use:
// const authorName = post.displayAuthor.fullName;
// const authorAvatar = post.displayAuthor.profilePic;
forumPostSchema.virtual('displayAuthor').get(function(this: IForumPost) {
    if (this.isAnonymous) {
        return { fullName: 'Anonymous', profilePic: '/default-avatar.png' };
    }
    return this.author;
});

// This is used to update the lastActivity field automatically every time the post is saved
forumPostSchema.pre<IForumPost>('save', function(next) {
    this.lastActivity = new Date();
    next();
});

export const ForumPost = mongoose.model<IForumPost>('ForumPost', forumPostSchema);
export default ForumPost; 