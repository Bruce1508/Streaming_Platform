import express from 'express';
import {
    getForumPosts,
    getForumPost,
    createForumPost,
    updateForumPost,
    deleteForumPost,
    voteOnPost,
    searchForumPosts,
    getTrendingTopics,
    getRecentActivity,
    getTopContributors,
    saveForumPost,
    unsaveForumPost,
    getSavedPosts
} from '../controllers/forum.controllers';
import {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    acceptAnswer
} from '../controllers/comment.controllers';
import { voteOnComment } from '../controllers/forum.controllers';
import { protectRoute } from '../middleWare/auth.middleware';
import { validateVoteOnPost, validateVoteOnComment } from '../middleWare/validation/vote.validation';

const router = express.Router();

// ===== TEST ROUTE =====
router.get('/test', (req, res) => {
    res.json({ message: 'Forum routes working!', timestamp: new Date() });
});

// ===== SEARCH ROUTES (đặt trước để tránh conflict) =====
router.get('/search', searchForumPosts);

// ===== STATISTICS ROUTES =====
router.get('/trending-topics', getTrendingTopics);
router.get('/recent-activity', getRecentActivity);
router.get('/top-contributors', getTopContributors);

// ===== SPECIAL ROUTES (đặt trước dynamic routes) =====
router.get('/my-topics', protectRoute, getForumPosts); // Posts của user hiện tại

// ===== FORUM POSTS ROUTES =====
router.get('/posts', getForumPosts);
router.post('/posts/create', protectRoute, createForumPost); // Route riêng cho create
router.post('/posts', protectRoute, createForumPost); // Fallback
router.get('/posts/:id', getForumPost);
router.put('/posts/:id', protectRoute, updateForumPost);
router.delete('/posts/:id', protectRoute, deleteForumPost);
router.post('/posts/:postId/vote', protectRoute, validateVoteOnPost, voteOnPost);

// ===== COMMENTS ROUTES =====
router.get('/posts/:postId/comments', getComments);
router.post('/posts/:postId/comments', protectRoute, createComment);
router.put('/comments/:id', protectRoute, updateComment);
router.delete('/comments/:id', protectRoute, deleteComment);
router.post('/comments/:commentId/vote', protectRoute, validateVoteOnComment, voteOnComment);
router.post('/comments/:id/accept', protectRoute, acceptAnswer);

// ===== SAVE POSTS ROUTES =====
router.post('/posts/:id/save', protectRoute, saveForumPost);
router.delete('/posts/:id/save', protectRoute, unsaveForumPost);
router.get('/saved-posts', protectRoute, getSavedPosts);

export default router; 