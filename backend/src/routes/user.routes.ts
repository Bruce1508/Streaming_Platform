// backend/src/routes/user.routes.ts
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { 
    getRecommendedUsers, 
    getMyFriends, 
    sendFriendRequest, 
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getFriendRequests, 
    getOutgoingFriendReqs,
    getMyProfile,
    updateMyProfile,
    updateProfilePicture,
    searchUsers,
    removeFriend,
    collectFriendData
} from '../controllers/user.controllers';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// GET routes
router.get("/recommended", getRecommendedUsers);
router.get("/search", searchUsers); //search bạn để add friend
router.get("/friends", getMyFriends); //lấy dánh sách bạn bè
router.delete("/friends/:friendId", removeFriend);
router.get("/friendRequests", getFriendRequests);
router.get("/outgoingFriendRequests", getOutgoingFriendReqs);

// Friend request actions
router.post("/friendRequest/:id", sendFriendRequest);
router.put("/friendRequest/:id/accept", acceptFriendRequest);
router.delete("/friendRequest/:id/reject", rejectFriendRequest);
router.delete("/friendRequest/:id/cancel", cancelFriendRequest);

router.get("/meFriends", collectFriendData);

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.put("/profileAvatar", updateProfilePicture);

export default router;