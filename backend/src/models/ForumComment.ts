import mongoose, { Document, Schema } from 'mongoose';

export interface IForumComment extends Document {
    _id: mongoose.Types.ObjectId;
    content: string;
    author: mongoose.Types.ObjectId; // Reference to User
    post: mongoose.Types.ObjectId; // Reference to ForumPost
    parentComment?: mongoose.Types.ObjectId; // For nested replies
    upvotes: mongoose.Types.ObjectId[]; // Array of user IDs
    downvotes: mongoose.Types.ObjectId[]; // Array of user IDs
    isAcceptedAnswer: boolean;
    isAnonymous: boolean;
    replyCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const forumCommentSchema = new Schema<IForumComment>({
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'ForumPost',
        required: [true, 'Post is required']
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'ForumComment',
        required: false
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isAcceptedAnswer: {
        type: Boolean,
        default: false
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    replyCount: {
        type: Number,
        default: 0,
        min: [0, 'Reply count cannot be negative']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
forumCommentSchema.index({ post: 1, createdAt: 1 });
forumCommentSchema.index({ author: 1, createdAt: -1 });
forumCommentSchema.index({ parentComment: 1, createdAt: 1 });
forumCommentSchema.index({ isAcceptedAnswer: 1 });

// Virtual for vote count
forumCommentSchema.virtual('voteCount').get(function(this: IForumComment) {
    return this.upvotes.length - this.downvotes.length;
});

// Virtual for author info (for anonymous comments)
forumCommentSchema.virtual('displayAuthor').get(function(this: IForumComment) {
    if (this.isAnonymous) {
        return { fullName: 'Anonymous', profilePic: '/default-avatar.png' };
    }
    return this.author;
});

// Pre-save middleware to update post's comment count
forumCommentSchema.pre<IForumComment>('save', async function(next) {
    if (this.isNew) {
        // Increment comment count on the post
        const ForumPost = mongoose.model('ForumPost');
        await ForumPost.findByIdAndUpdate(
            this.post,
            { $inc: { commentCount: 1 } }
        );
        
        // If this is a reply, increment reply count on parent comment
        if (this.parentComment) {
            await mongoose.model('ForumComment').findByIdAndUpdate(
                this.parentComment,
                { $inc: { replyCount: 1 } }
            );
        }
    }
    next();
});

// Pre-delete middleware to update post's comment count
forumCommentSchema.pre<IForumComment>('deleteOne', { document: true, query: false }, async function(next) {
    // Decrement comment count on the post
    const ForumPost = mongoose.model('ForumPost');
    await ForumPost.findByIdAndUpdate(
        this.post,
        { $inc: { commentCount: -1 } }
    );
    
    // If this is a reply, decrement reply count on parent comment
    if (this.parentComment) {
        await mongoose.model('ForumComment').findByIdAndUpdate(
            this.parentComment,
            { $inc: { replyCount: -1 } }
        );
    }
    next();
});

export const ForumComment = mongoose.model<IForumComment>('ForumComment', forumCommentSchema);
export default ForumComment; 