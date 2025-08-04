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

    // Handle special routes
    const path = req.path;
    console.log('🔍 Path detected:', path);
    
    if (path === '/my-topics') {
        // Get posts by current user
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            return res.status(401).json(new ApiResponse(401, null, 'Authentication required'));
        }
        console.log('👤 Filtering posts by author:', authReq.user._id);
        query.author = authReq.user._id;
    } else if (path === '/explore') {
        // Explore: Show ALL posts from all schools (discovery feed)
        delete query.status; // Show all statuses in explore
        // Could add trending/popular logic here later
    } else if (path === '/posts' || path === '/') {
        // Home: Show posts from user's school/program (personalized feed)
        const authReq = req as AuthRequest;
        if (authReq.user && authReq.user.academic?.program) {
            query.program = authReq.user.academic.program;
        }
        // Could also filter by user's school here
    }

    // Add filters (check for valid values, not "undefined" string)
    if (category && category !== 'undefined') query.category = category;
    if (program && program !== 'undefined') query.program = program;
    if (search && search !== 'undefined' && typeof search === 'string' && search.trim() !== '') {
        // Use regex search instead of text search to avoid conflicts
        query.$or = [
            { tags: { $regex: search as string, $options: 'i' } },
            { title: { $regex: search as string, $options: 'i' } },
            { content: { $regex: search as string, $options: 'i' } }
        ];
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

    console.log('📊 Final query:', JSON.stringify(query, null, 2));
    console.log('🔄 Sort option:', JSON.stringify(sortOption, null, 2));

    const [posts, total] = await Promise.all([
        ForumPost.find(query)
            .populate('author', 'fullName profilePic email')
            .populate('program', 'name code')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        ForumPost.countDocuments(query)
    ]);

    console.log('📋 Posts found:', posts.length);
    console.log('📊 Total count:', total);

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
            .populate('author', 'fullName profilePic email')
            .populate('program', 'name code')
            .lean(),
        ForumComment.find({ post: id, $or: [{ parentComment: { $exists: false } }, { parentComment: null }] })
            .populate('author', 'fullName profilePic email')
            .sort({ isAcceptedAnswer: -1, createdAt: 1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        ForumComment.countDocuments({ post: id, $or: [{ parentComment: { $exists: false } }, { parentComment: null }] })
    ]);

    console.log('🔍 Debug - Post ID:', id);
    console.log('🔍 Debug - Comments found:', comments.length);
    console.log('🔍 Debug - Total comments count:', totalComments);
    console.log('🔍 Debug - Comments data:', JSON.stringify(comments, null, 2));
    
    // Debug: Check raw comments without populate
    const rawComments = await ForumComment.find({ post: id, $or: [{ parentComment: { $exists: false } }, { parentComment: null }] }).lean();
    console.log('🔍 Debug - Raw comments found:', rawComments.length);
    console.log('🔍 Debug - Raw comments:', JSON.stringify(rawComments, null, 2));

    // Populate replies for each comment
    const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
            const replies = await ForumComment.find({ parentComment: comment._id })
                .populate('author', 'fullName profilePic email')
                .sort({ createdAt: 1 })
                .lean();
            
            return {
                ...comment,
                replies
            };
        })
    );

    if (!post) {
        return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
    }

    const totalPages = Math.ceil(totalComments / Number(limit));

    res.json(new ApiResponse(200, {
        post,
        comments: commentsWithReplies,
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
        console.log('👤 Post author saved as:', post.author);
        console.log('👤 Request user ID:', req.user._id);

        const populatedPost = await ForumPost.findById(post._id)
            .populate('author', 'fullName profilePic email')
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
    ).populate('author', 'fullName profilePic email')
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
        ForumPost.find({
            $or: [
                { tags: { $regex: q as string, $options: 'i' } },
                { title: { $regex: q as string, $options: 'i' } },
                { content: { $regex: q as string, $options: 'i' } }
            ]
        })
            .populate('author', 'fullName profilePic email')
            .populate('program', 'name code')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        ForumPost.countDocuments({
            $or: [
                { tags: { $regex: q as string, $options: 'i' } },
                { title: { $regex: q as string, $options: 'i' } },
                { content: { $regex: q as string, $options: 'i' } }
            ]
        })
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

// ===== GET TRENDING TOPICS =====
export const getTrendingTopics = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Aggregate posts by tags to find trending topics
        const trendingTopics = await ForumPost.aggregate([
            { $match: { status: 'open' } },
            { $unwind: '$tags' },
            {
                $group: {
                    _id: '$tags',
                    postCount: { $sum: 1 },
                    recentPosts: { $push: { createdAt: '$createdAt', views: '$views' } }
                }
            },
            {
                $addFields: {
                    // Calculate trend percentage based on recent activity
                    trendPercentage: {
                        $multiply: [
                            { $divide: ['$postCount', 10] }, // Base calculation
                            { $add: [1, { $rand: {} }] } // Add some randomness for demo
                        ]
                    }
                }
            },
            { $sort: { postCount: -1 } },
            { $limit: 10 },
            {
                $project: {
                    tag: '$_id',
                    postCount: 1,
                    trendPercentage: { $round: ['$trendPercentage', 0] }
                }
            }
        ]);

        console.log('📈 Trending topics found:', trendingTopics.length);

        res.status(200).json(new ApiResponse(200, trendingTopics, 'Trending topics retrieved successfully'));
    } catch (error: any) {
        console.error('Get trending topics error:', error);
        res.status(500).json(new ApiResponse(500, null, 'Failed to get trending topics'));
    }
});

// ===== GET RECENT ACTIVITY =====
export const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Get recent posts and comments
        const recentPosts = await ForumPost.find({ status: 'open' })
            .populate('author', 'fullName profilePic email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title author createdAt');

        const activities = recentPosts.map(post => ({
            type: 'post',
            user: post.author?.fullName || 'Anonymous',
            action: 'created a new post',
            target: post.title,
            time: post.createdAt,
            avatar: post.author?.profilePic || '/default-avatar.jpg'
        }));

        console.log('🔄 Recent activities found:', activities.length);

        res.status(200).json(new ApiResponse(200, activities, 'Recent activity retrieved successfully'));
    } catch (error: any) {
        console.error('Get recent activity error:', error);
        res.status(500).json(new ApiResponse(500, null, 'Failed to get recent activity'));
    }
});

// ===== GET TOP CONTRIBUTORS =====
export const getTopContributors = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Aggregate users by their post count and vote scores
        const topContributors = await ForumPost.aggregate([
            { $match: { status: 'open' } },
            {
                $group: {
                    _id: '$author',
                    postCount: { $sum: 1 },
                    totalVotes: { $sum: { $subtract: [{ $size: '$upvotes' }, { $size: '$downvotes' }] } }
                }
            },
            {
                $addFields: {
                    points: { $add: [{ $multiply: ['$postCount', 10] }, '$totalVotes'] }
                }
            },
            { $sort: { points: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    name: '$userInfo.fullName',
                    program: '$userInfo.academic.program',
                    points: 1,
                    postCount: 1,
                    profilePic: '$userInfo.profilePic'
                }
            }
        ]);

        console.log('🏆 Top contributors found:', topContributors.length);

        res.status(200).json(new ApiResponse(200, topContributors, 'Top contributors retrieved successfully'));
    } catch (error: any) {
        console.error('Get top contributors error:', error);
        res.status(500).json(new ApiResponse(500, null, 'Failed to get top contributors'));
    }
});

/**
 * @desc    Vote on a forum post (upvote/downvote)
 * @route   POST /api/forum/posts/:postId/vote
 * @access  Private
 */
export const voteOnPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    try {
        const { postId } = req.params;
        const { voteType } = req.body; // 'up' | 'down'
        const userId = req.user._id;

        console.log('🗳️ Vote on post:', { postId, voteType, userId });

        // Validate vote type
        if (!['up', 'down'].includes(voteType)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid vote type. Must be "up" or "down"'));
        }

        // Find the post
        const post = await ForumPost.findById(postId);
        if (!post) {
            return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
        }

        // Check if user already voted
        const hasUpvoted = post.upvotes.includes(userId);
        const hasDownvoted = post.downvotes.includes(userId);

        // Remove existing vote if any
        if (hasUpvoted) {
            post.upvotes = post.upvotes.filter(id => !id.equals(userId));
        }
        if (hasDownvoted) {
            post.downvotes = post.downvotes.filter(id => !id.equals(userId));
        }

        // Add new vote if different from existing vote
        if (voteType === 'up' && !hasUpvoted) {
            post.upvotes.push(userId);
        } else if (voteType === 'down' && !hasDownvoted) {
            post.downvotes.push(userId);
        }

        // Save the post
        await post.save();

        // Calculate new vote count
        const voteCount = post.upvotes.length - post.downvotes.length;

        console.log('✅ Vote successful:', {
            upvotes: post.upvotes.length,
            downvotes: post.downvotes.length,
            voteCount
        });

        res.status(200).json(new ApiResponse(200, {
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            voteCount,
            userVote: hasUpvoted && voteType === 'up' ? null : 
                     hasDownvoted && voteType === 'down' ? null : voteType
        }, 'Vote recorded successfully'));

    } catch (error: any) {
        console.error('Vote on post error:', error);
        res.status(500).json(new ApiResponse(500, null, 'Failed to record vote'));
    }
});

/**
 * @desc    Vote on a forum comment (upvote/downvote)
 * @route   POST /api/forum/comments/:commentId/vote
 * @access  Private
 */
export const voteOnComment = asyncHandler(async (req: AuthRequest, res: Response) => {
    logApiRequest(req);

    try {
        const { commentId } = req.params;
        const { voteType } = req.body; // 'up' | 'down'
        const userId = req.user._id;

        console.log('🗳️ Vote on comment:', { commentId, voteType, userId });

        // Validate vote type
        if (!['up', 'down'].includes(voteType)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid vote type. Must be "up" or "down"'));
        }

        // Find the comment
        const comment = await ForumComment.findById(commentId);
        if (!comment) {
            return res.status(404).json(new ApiResponse(404, null, 'Comment not found'));
        }

        // Check if user already voted
        const hasUpvoted = comment.upvotes.includes(userId);
        const hasDownvoted = comment.downvotes.includes(userId);

        // Remove existing vote if any
        if (hasUpvoted) {
            comment.upvotes = comment.upvotes.filter(id => !id.equals(userId));
        }
        if (hasDownvoted) {
            comment.downvotes = comment.downvotes.filter(id => !id.equals(userId));
        }

        // Add new vote if different from existing vote
        if (voteType === 'up' && !hasUpvoted) {
            comment.upvotes.push(userId);
        } else if (voteType === 'down' && !hasDownvoted) {
            comment.downvotes.push(userId);
        }

        // Save the comment
        await comment.save();

        // Calculate new vote count
        const voteCount = comment.upvotes.length - comment.downvotes.length;

        console.log('✅ Comment vote successful:', {
            upvotes: comment.upvotes.length,
            downvotes: comment.downvotes.length,
            voteCount
        });

        res.status(200).json(new ApiResponse(200, {
            upvotes: comment.upvotes,
            downvotes: comment.downvotes,
            voteCount,
            userVote: hasUpvoted && voteType === 'up' ? null : 
                     hasDownvoted && voteType === 'down' ? null : voteType
        }, 'Comment vote recorded successfully'));

    } catch (error: any) {
        console.error('Vote on comment error:', error);
        res.status(500).json(new ApiResponse(500, null, 'Failed to record comment vote'));
    }
}); 