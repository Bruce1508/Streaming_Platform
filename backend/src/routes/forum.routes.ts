import express from 'express';
import {
    getForumPosts,
    getForumPost,
    createForumPost,
    updateForumPost,
    deleteForumPost,
    voteForumPost,
    searchForumPosts
} from '../controllers/forum.controllers';
import {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    voteComment,
    acceptAnswer
} from '../controllers/comment.controllers';
import { protectRoute } from '../middleWare/auth.middleware';

const router = express.Router();

// ===== TEST ROUTE =====
router.get('/test', (req, res) => {
    res.json({ message: 'Forum routes working!', timestamp: new Date() });
});

// ===== SEARCH ROUTES (đặt trước để tránh conflict) =====
router.get('/search', searchForumPosts);

// ===== FORUM POSTS ROUTES =====
router.get('/posts', getForumPosts);
router.post('/posts/create', protectRoute, createForumPost); // Route riêng cho create
router.post('/posts', protectRoute, createForumPost); // Fallback
router.get('/posts/:id', getForumPost);
router.put('/posts/:id', protectRoute, updateForumPost);
router.delete('/posts/:id', protectRoute, deleteForumPost);
router.post('/posts/:id/vote', protectRoute, voteForumPost);

// ===== COMMENTS ROUTES =====
router.get('/posts/:postId/comments', getComments);
router.post('/posts/:postId/comments', protectRoute, createComment);
router.put('/comments/:id', protectRoute, updateComment);
router.delete('/comments/:id', protectRoute, deleteComment);
router.post('/comments/:id/vote', protectRoute, voteComment);
router.post('/comments/:id/accept', protectRoute, acceptAnswer);

export default router; 