import { Request, Response } from 'express';
import { AuthRequest } from '../middleWare/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { logApiRequest } from '../utils/Api.utils';
import ForumComment from '../models/ForumComment';
import ForumPost from '../models/ForumPost';

/**
 * @desc    Get comments for a forum post
 * @route   GET /api/forum/posts/:postId/comments
 * @access  Public
 */
export const getComments = asyncHandler(async (req: Request, res: Response) => {
    logApiRequest(req);

    const { postId } = req.params;
    const { page = 1, limit = 20, parentComment } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const query: any = { post: postId };

    if (parentComment) {
        query.parentComment = parentComment;
    } else {
        query.parentComment = { $exists: false };
    }

    const [comments, total] = await Promise.all([
        ForumComment.find(query)
            .populate('author', 'fullName profilePic')
            .populate({
                path: 'replies',
                populate: { path: 'author', select: 'fullName profilePic' }
            })
            .sort({ isAcceptedAnswer: -1, createdAt: 1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        ForumComment.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json(new ApiResponse(200, {
        comments,
        pagination: {
            currentPage: Number(page),
            totalPages,
            totalComments: total,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1
        }
    }, 'Comments retrieved successfully'));
});

/**
 * @desc    Create new comment
 * @route   POST /api/forum/posts/:postId/comments
 * @access  Private
 */
export const createComment = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const { postId } = req.params;
    const { content, parentComment, isAnonymous } = req.body;

    // Check if post exists
    const post = await ForumPost.findById(postId);
    if (!post) {
        return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
    }

    // If this is a reply, check if parent comment exists
    if (parentComment) {
        const parent = await ForumComment.findById(parentComment);
        if (!parent) {
            return res.status(404).json(new ApiResponse(404, null, 'Parent comment not found'));
        }
    }

    const comment = await ForumComment.create({
        content,
        author: req.user._id,
        post: postId,
        parentComment,
        isAnonymous: isAnonymous || false
    });

    const populatedComment = await ForumComment.findById(comment._id)
        .populate('author', 'fullName profilePic');

    res.status(201).json(new ApiResponse(201, populatedComment, 'Comment created successfully'));
});

/**
 * @desc    Update comment
 * @route   PUT /api/forum/comments/:id
 * @access  Private (Author or Admin)
 */
export const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const { id } = req.params;
    const { content, isAnonymous } = req.body;

    const comment = await ForumComment.findById(id);
    if (!comment) {
        return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
    }

    // Check if user is author or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized to update this comment'));
    }

    const updatedComment = await ForumComment.findByIdAndUpdate(
        id,
        { content, isAnonymous },
        { new: true, runValidators: true }
    ).populate('author', 'fullName profilePic');

    res.json(new ApiResponse(200, updatedComment, 'Comment updated successfully'));
});

/**
 * @desc    Delete comment
 * @route   DELETE /api/forum/comments/:id
 * @access  Private (Author or Admin)
 */
export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const { id } = req.params;

    const comment = await ForumComment.findById(id);
    if (!comment) {
        return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
    }

    // Check if user is author or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized to delete this comment'));
    }

    // Delete all replies first
    await ForumComment.deleteMany({ parentComment: id });
    
    // Delete the comment
    await ForumComment.findByIdAndDelete(id);

    res.json(new ApiResponse(200, null, 'Comment deleted successfully'));
});

/**
 * @desc    Vote on comment (upvote/downvote)
 * @route   POST /api/forum/comments/:id/vote
 * @access  Private
 */
export const voteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const { id } = req.params;
    const { vote } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(vote)) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid vote type'));
    }

    const comment = await ForumComment.findById(id);
    if (!comment) {
        return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
    }

    const userId = req.user._id;
    const isUpvote = vote === 'up';
    const voteArray = isUpvote ? 'upvotes' : 'downvotes';
    const oppositeArray = isUpvote ? 'downvotes' : 'upvotes';

    // Check if user already voted
    const hasVoted = comment[voteArray].includes(userId);
    const hasOppositeVote = comment[oppositeArray].includes(userId);

    if (hasVoted) {
        // Remove vote
        comment[voteArray] = comment[voteArray].filter(id => id.toString() !== userId.toString());
    } else {
        // Add vote and remove opposite vote if exists
        comment[voteArray].push(userId);
        comment[oppositeArray] = comment[oppositeArray].filter(id => id.toString() !== userId.toString());
    }

    await comment.save();

    res.json(new ApiResponse(200, {
        voteCount: comment.upvotes.length - comment.downvotes.length,
        upvotes: comment.upvotes.length,
        downvotes: comment.downvotes.length
    }, 'Vote updated successfully'));
});

/**
 * @desc    Mark comment as accepted answer
 * @route   POST /api/forum/comments/:id/accept
 * @access  Private (Post Author or Admin)
 */
export const acceptAnswer = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const { id } = req.params;

    const comment = await ForumComment.findById(id).populate('post');
    if (!comment) {
        return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
    }

    const post = await ForumPost.findById(comment.post);
    if (!post) {
        return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
    }

    // Check if user is post author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized to accept this answer'));
    }

    // Unaccept all other comments for this post
    await ForumComment.updateMany(
        { post: comment.post },
        { isAcceptedAnswer: false }
    );

    // Accept this comment
    comment.isAcceptedAnswer = true;
    await comment.save();

    res.json(new ApiResponse(200, comment, 'Answer accepted successfully'));
}); 