import { Request, Response } from 'express';
import { AuthRequest } from '../middleWare/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { logApiRequest } from '../utils/Api.utils';
import ForumPost from '../models/ForumPost';
import ForumComment from '../models/ForumComment';
import User from '../models/User';

/**
 * @desc    Get all forum posts with pagination and filters
 * @route   GET /api/forum/posts
 * @access  Public
 */
export const getForumPosts = asyncHandler(async (req: Request, res: Response) => {
    logApiRequest(req);

    const {
        page = 1,
        limit = 10,
        category,
        program,
        search,
        sort = 'latest',
        status = 'open'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const query: any = { status };

    // Add filters
    if (category) query.category = category;
    if (program) query.program = program;
    if (search) {
        query.$text = { $search: search as string };
    }

    // Sort options
    let sortOption: any = {};
    switch (sort) {
        case 'latest':
            sortOption = { createdAt: -1 };
            break;
        case 'popular':
            sortOption = { views: -1, createdAt: -1 };
            break;
        case 'trending':
            sortOption = { lastActivity: -1 };
            break;
        case 'votes':
            sortOption = { voteCount: -1, createdAt: -1 };
            break;
        default:
            sortOption = { isPinned: -1, createdAt: -1 };
    }

    const [posts, total] = await Promise.all([
        ForumPost.find(query)
            .populate('author', 'fullName profilePic')
            .populate('program', 'name code')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        ForumPost.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json(new ApiResponse(200, {
        posts,
        pagination: {
            currentPage: Number(page),
            totalPages,
            totalPosts: total,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1
        }
    }, 'Forum posts retrieved successfully'));
});

/**
 * @desc    Get single forum post with comments
 * @route   GET /api/forum/posts/:id
 * @access  Public
 */
export const getForumPost = asyncHandler(async (req: Request, res: Response) => {
    logApiRequest(req);

    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Increment view count
    await ForumPost.findByIdAndUpdate(id, { $inc: { views: 1 } });

    const [post, comments, totalComments] = await Promise.all([
        ForumPost.findById(id)
            .populate('author', 'fullName profilePic')
            .populate('program', 'name code')
            .lean(),
        ForumComment.find({ post: id, parentComment: { $exists: false } })
            .populate('author', 'fullName profilePic')
            .populate({
                path: 'replies',
                populate: { path: 'author', select: 'fullName profilePic' }
            })
            .sort({ isAcceptedAnswer: -1, createdAt: 1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        ForumComment.countDocuments({ post: id, parentComment: { $exists: false } })
    ]);

    if (!post) {
        return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
    }

    const totalPages = Math.ceil(totalComments / Number(limit));

    res.json(new ApiResponse(200, {
        post,
        comments,
        pagination: {
            currentPage: Number(page),
            totalPages,
            totalComments,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1
        }
    }, 'Forum post retrieved successfully'));
});

/**
 * @desc    Create new forum post
 * @route   POST /api/forum/posts/create
 * @access  Private
 */
export const createForumPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    console.log('🚀 createForumPost function called');
    logApiRequest(req);

    if (!req.user) {
        console.log('❌ No user in request');
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    console.log('✅ User authenticated:', req.user._id);

    try {
        const { title, content, category, tags, program, isAnonymous } = req.body;

        console.log('🔄 Creating forum post with data:', {
            title,
            content: content?.substring(0, 100) + '...',
            category,
            tags,
            program,
            isAnonymous,
            userId: req.user._id
        });

        // Validate required fields
        if (!title || !content || !category) {
            console.error('❌ Missing required fields:', { title: !!title, content: !!content, category: !!category });
            return res.status(400).json(new ApiResponse(400, null, 'Title, content, and category are required'));
        }

        console.log('📝 About to create ForumPost...');

        const post = await ForumPost.create({
            title: title.trim(),
            content: content.trim(),
            author: req.user._id,
            category,
            tags: tags || [],
            program,
            isAnonymous: isAnonymous || false
        });

        console.log('✅ Post created with ID:', post._id);

        const populatedPost = await ForumPost.findById(post._id)
            .populate('author', 'fullName profilePic')
            .populate('program', 'name code');

        console.log('✅ Post populated successfully');

        res.status(201).json(new ApiResponse(201, populatedPost, 'Forum post created successfully'));
    } catch (error: any) {
        console.error('❌ Error creating forum post:', {
            error: error.message,
            stack: error.stack,
            userId: req.user?._id,
            body: req.body
        });
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json(new ApiResponse(400, null, `Validation error: ${validationErrors.join(', ')}`));
        }
        
        return res.status(500).json(new ApiResponse(500, null, 'Failed to create forum post'));
    }
});

/**
 * @desc    Update forum post
 * @route   PUT /api/forum/posts/:id
 * @access  Private (Author or Admin)
 */
export const updateForumPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const { id } = req.params;
    const { title, content, category, tags, isAnonymous } = req.body;

    const post = await ForumPost.findById(id);
    if (!post) {
        return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized to update this post'));
    }

    const updatedPost = await ForumPost.findByIdAndUpdate(
        id,
        { title, content, category, tags, isAnonymous },
        { new: true, runValidators: true }
    ).populate('author', 'fullName profilePic')
     .populate('program', 'name code');

    res.json(new ApiResponse(200, updatedPost, 'Forum post updated successfully'));
});

/**
 * @desc    Delete forum post
 * @route   DELETE /api/forum/posts/:id
 * @access  Private (Author or Admin)
 */
export const deleteForumPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const { id } = req.params;

    const post = await ForumPost.findById(id);
    if (!post) {
        return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized to delete this post'));
    }

    // Delete all comments first
    await ForumComment.deleteMany({ post: id });
    
    // Delete the post
    await ForumPost.findByIdAndDelete(id);

    res.json(new ApiResponse(200, null, 'Forum post deleted successfully'));
});

/**
 * @desc    Vote on forum post (upvote/downvote)
 * @route   POST /api/forum/posts/:id/vote
 * @access  Private
 */
export const voteForumPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
    }

    const { id } = req.params;
    const { vote } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(vote)) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid vote type'));
    }

    const post = await ForumPost.findById(id);
    if (!post) {
        return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
    }

    const userId = req.user._id;
    const isUpvote = vote === 'up';
    const voteArray = isUpvote ? 'upvotes' : 'downvotes';
    const oppositeArray = isUpvote ? 'downvotes' : 'upvotes';

    // Check if user already voted
    const hasVoted = post[voteArray].includes(userId);
    const hasOppositeVote = post[oppositeArray].includes(userId);

    if (hasVoted) {
        // Remove vote
        post[voteArray] = post[voteArray].filter(id => id.toString() !== userId.toString());
    } else {
        // Add vote and remove opposite vote if exists
        post[voteArray].push(userId);
        post[oppositeArray] = post[oppositeArray].filter(id => id.toString() !== userId.toString());
    }

    await post.save();

    res.json(new ApiResponse(200, {
        voteCount: post.upvotes.length - post.downvotes.length,
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length
    }, 'Vote updated successfully'));
});

/**
 * @desc    Search forum posts
 * @route   GET /api/forum/search
 * @access  Public
 */
export const searchForumPosts = asyncHandler(async (req: Request, res: Response) => {
    logApiRequest(req);

    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
        return res.status(400).json(new ApiResponse(400, null, 'Search query is required'));
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
        ForumPost.find({ $text: { $search: q as string } })
            .populate('author', 'fullName profilePic')
            .populate('program', 'name code')
            .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        ForumPost.countDocuments({ $text: { $search: q as string } })
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json(new ApiResponse(200, {
        posts,
        query: q,
        pagination: {
            currentPage: Number(page),
            totalPages,
            totalPosts: total,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1
        }
    }, 'Search results retrieved successfully'));
}); 