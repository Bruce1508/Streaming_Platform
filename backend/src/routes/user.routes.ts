// backend/src/routes/user.routes.ts
import express from 'express';
import { protectRoute } from '../middleWare/auth.middleware';
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
    updateProfilePicture
} from '../controllers/user.controllers';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// GET routes
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

// Friend request actions
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.delete("/friend-request/:id/reject", rejectFriendRequest);
router.delete("/friend-request/:id/cancel", cancelFriendRequest);

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.put("/profile/avatar", updateProfilePicture);

export default router;