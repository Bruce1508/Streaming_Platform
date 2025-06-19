// backend/src/controllers/user.controller.ts
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import friendRequest from "../models/friendRequest";
import mongoose from "mongoose";

// ===== EXTENDED REQUEST INTERFACE =====
interface AuthenticatedRequest extends Request {
    user?: IUser;
}

// ===== UTILITY FUNCTIONS =====
const safeObjectId = (id: string): mongoose.Types.ObjectId | null => {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch {
        return null;
    }
};

// ===== RECOMMENDATION SYSTEM =====
export async function getRecommendedUsers(req: Request, res: Response): Promise<Response | any> {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        const currentUserId = authReq.user._id;
        const currentUser = authReq.user;

        // ✅ Enhanced recommendation based on academic similarity
        const baseQuery = {
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true },
                { isActive: true },
                { role: { $in: ['student', 'professor'] } } // Only academic users
            ],
        };

        // ✅ Get users from same school/program first (if current user is student)
        let recommendedUsers = [];

        if (currentUser.role === 'student' && currentUser.academic?.school) {
            const sameSchoolUsers = await User.find({
                ...baseQuery,
                'academic.school': currentUser.academic.school,
                'academic.program': { $ne: currentUser.academic?.program } // Different programs in same school
            })
                .select('fullName email profilePic role bio location nativeLanguage learningLanguage academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .limit(8);

            recommendedUsers.push(...sameSchoolUsers);
        }

        // ✅ Get users with similar learning interests
        if (currentUser.preferredLanguages?.length > 0) {
            const similarInterestUsers = await User.find({
                ...baseQuery,
                preferredLanguages: { $in: currentUser.preferredLanguages },
                _id: { $nin: recommendedUsers.map(u => u._id) }
            })
                .select('fullName email profilePic role bio location nativeLanguage learningLanguage academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .limit(6);

            recommendedUsers.push(...similarInterestUsers);
        }

        // ✅ Fill remaining with random active users
        if (recommendedUsers.length < 15) {
            const remainingUsers = await User.find({
                ...baseQuery,
                _id: { $nin: recommendedUsers.map(u => u._id) }
            })
                .select('fullName email profilePic role bio location nativeLanguage learningLanguage academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .sort({ 'activity.contributionScore': -1 }) // Sort by contribution
                .limit(15 - recommendedUsers.length);

            recommendedUsers.push(...remainingUsers);
        }

        // ✅ Add computed fields
        const enhancedUsers = recommendedUsers.map(user => ({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role,
            bio: user.bio,
            location: user.location,
            nativeLanguage: user.nativeLanguage,
            learningLanguage: user.learningLanguage,
            academic: user.academic,
            contributionLevel: user.contributionLevel, // Virtual field
            academicInfo: user.academicInfo, // Virtual field
            activity: {
                contributionScore: user.activity?.contributionScore || 0,
                uploadCount: user.activity?.uploadCount || 0
            }
        }));

        return res.status(200).json({
            success: true,
            users: enhancedUsers,
            total: enhancedUsers.length
        });

    } catch (error: any) {
        console.error("Error in getRecommendedUsers controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ===== FRIENDS MANAGEMENT =====
export async function getMyFriends(req: Request, res: Response): Promise<Response | any> {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        const user = await User.findById(authReq.user._id)
            .select("friends")
            .populate({
                path: "friends",
                select: "fullName profilePic nativeLanguage learningLanguage role bio location academic activity",
                populate: [
                    { path: 'academic.school', select: 'name location' },
                    { path: 'academic.program', select: 'name code' }
                ]
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ Enhanced friends data
        const enhancedFriends = user.friends.map((friend: any) => ({
            _id: friend._id,
            fullName: friend.fullName,
            profilePic: friend.profilePic,
            role: friend.role,
            bio: friend.bio,
            location: friend.location,
            nativeLanguage: friend.nativeLanguage,
            learningLanguage: friend.learningLanguage,
            academic: friend.academic,
            academicInfo: friend.academicInfo, // Virtual field
            contributionLevel: friend.contributionLevel, // Virtual field
            activity: {
                contributionScore: friend.activity?.contributionScore || 0,
                uploadCount: friend.activity?.uploadCount || 0
            }
        }));

        return res.status(200).json({
            success: true,
            friends: enhancedFriends,
            total: enhancedFriends.length
        });

    } catch (error: any) {
        console.error("Error in getMyFriends controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ===== FRIEND REQUESTS =====
export async function sendFriendRequest(req: Request, res: Response): Promise<Response | any> {
    const authReq = req as AuthenticatedRequest;
    const senderId = authReq.user?._id;
    const { id: recipientId } = req.params;

    if (!senderId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    // ✅ Validate recipient ID
    const validRecipientId = safeObjectId(recipientId);
    if (!validRecipientId) {
        return res.status(400).json({
            success: false,
            message: "Invalid recipient ID"
        });
    }

    // ✅ Check if trying to send to self
    if (senderId.toString() === recipientId) {
        return res.status(400).json({
            success: false,
            message: "You cannot send a friend request to yourself"
        });
    }

    try {
        const recipient = await User.findById(recipientId).select('fullName friends isActive');
        if (!recipient || !recipient.isActive) {
            return res.status(404).json({
                success: false,
                message: "User not found or inactive"
            });
        }

        // ✅ Check if already friends
        if (recipient.friends.some(friendId => friendId.toString() === senderId.toString())) {
            return res.status(400).json({
                success: false,
                message: "You are already friends with this user"
            });
        }

        // ✅ Check for existing requests
        const existingRequest = await friendRequest.findOne({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId },
            ],
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "A friend request already exists between you and this user"
            });
        }

        const friend_request = await friendRequest.create({
            sender: senderId,
            recipient: recipientId,
        });

        console.log('✅ Friend request sent successfully:', friend_request._id);

        return res.status(201).json({
            success: true,
            message: "Friend request sent successfully",
            sentTo: recipient.fullName,
            friendRequest: {
                _id: friend_request._id,
                sender: senderId,
                recipient: recipientId,
                status: friend_request.status,
                createdAt: friend_request.createdAt
            }
        });

    } catch (error: any) {
        console.error("❌ Error in sendFriendRequest controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to send friend request"
        });
    }
}

export async function acceptFriendRequest(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id: requestId } = req.params;
        const currentUserId = authReq.user?._id;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ✅ Validate request ID
        const validRequestId = safeObjectId(requestId);
        if (!validRequestId) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        // ✅ Find and validate friend request
        const friend_request = await friendRequest.findById(requestId);
        if (!friend_request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }

        // ✅ Authorization check
        if (friend_request.recipient.toString() !== currentUserId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this request"
            });
        }

        // ✅ Status check
        if (friend_request.status === 'accepted') {
            return res.status(400).json({
                success: false,
                message: "Friend request already accepted"
            });
        }

        // ✅ Update request status and add friends
        friend_request.status = "accepted";
        await friend_request.save();

        // ✅ Use atomic operations for consistency
        await Promise.all([
            User.findByIdAndUpdate(friend_request.sender, {
                $addToSet: { friends: friend_request.recipient },
            }),
            User.findByIdAndUpdate(friend_request.recipient, {
                $addToSet: { friends: friend_request.sender },
            })
        ]);

        // ✅ Get friend info to return
        const newFriend = await User.findById(friend_request.sender)
            .select('fullName profilePic role academic')
            .populate('academic.school', 'name')
            .populate('academic.program', 'name');

        console.log('✅ Friend request accepted successfully');
        return res.status(200).json({
            success: true,
            message: "Friend request accepted",
            newFriend: newFriend
        });

    } catch (error: any) {
        console.error("❌ Error in acceptFriendRequest controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to accept friend request"
        });
    }
}

export async function getFriendRequests(req: Request, res: Response): Promise<Response | any> {
    const authReq = req as AuthenticatedRequest;
    const recipientId = authReq.user?._id;

    if (!recipientId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        // ✅ Get incoming requests with enhanced user info
        const incomingRequests = await friendRequest.find({
            recipient: recipientId,
            status: "pending",
        })
            .populate({
                path: "sender",
                select: "fullName profilePic nativeLanguage learningLanguage role bio location academic activity",
                populate: [
                    { path: 'academic.school', select: 'name location' },
                    { path: 'academic.program', select: 'name code' }
                ]
            })
            .sort({ createdAt: -1 });

        // ✅ Get accepted requests for notification purposes
        const recentlyAccepted = await friendRequest.find({
            recipient: recipientId,
            status: "accepted",
            updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        })
            .populate("sender", "fullName profilePic")
            .sort({ updatedAt: -1 });

        // ✅ Enhanced request data
        const enhancedIncoming = incomingRequests.map(request => ({
            _id: request._id,
            sender: (typeof request.sender === 'object' && request.sender !== null && 'fullName' in request.sender)
                ? {
                    _id: (request.sender as any)?._id,
                    fullName: (request.sender as any)?.fullName,
                    profilePic: (request.sender as any)?.profilePic,
                    role: (request.sender as any)?.role,
                    bio: (request.sender as any)?.bio,
                    location: (request.sender as any)?.location,
                    nativeLanguage: (request.sender as any)?.nativeLanguage,
                    learningLanguage: (request.sender as any)?.learningLanguage,
                    academic: (request.sender as any)?.academic,
                    academicInfo: (request.sender as any)?.academicInfo, // Virtual field
                    contributionLevel: (request.sender as any)?.contributionLevel, // Virtual field
                }
                : null,
            status: request.status,
            createdAt: request.createdAt
        }));

        return res.status(200).json({
            success: true,
            incomingRequests: enhancedIncoming,
            recentlyAccepted: recentlyAccepted,
            counts: {
                pending: enhancedIncoming.length,
                recentlyAccepted: recentlyAccepted.length
            }
        });

    } catch (error: any) {
        console.error("Error in getFriendRequests controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function getOutgoingFriendReqs(req: Request, res: Response): Promise<Response | any> {
    const authReq = req as AuthenticatedRequest;
    const senderId = authReq.user?._id;

    if (!senderId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        const pendingRequests = await friendRequest.find({
            sender: senderId,
            status: "pending",
        })
            .populate({
                path: "recipient",
                select: "fullName profilePic nativeLanguage learningLanguage role academic",
                populate: [
                    { path: 'academic.school', select: 'name' },
                    { path: 'academic.program', select: 'name' }
                ]
            })
            .sort({ createdAt: -1 });

        const enhancedRequests = pendingRequests.map(request => ({
            _id: request._id,
            recipient: (typeof request.recipient === 'object' && request.recipient !== null && 'fullName' in request.recipient)
                ? {
                    _id: (request.recipient as any)?._id,
                    fullName: (request.recipient as any)?.fullName,
                    profilePic: (request.recipient as any)?.profilePic,
                    role: (request.recipient as any)?.role,
                    nativeLanguage: (request.recipient as any)?.nativeLanguage,
                    learningLanguage: (request.recipient as any)?.learningLanguage,
                    academic: (request.recipient as any)?.academic,
                    academicInfo: (request.recipient as any)?.academicInfo, // Virtual field
                }
                : null,
            status: request.status,
            createdAt: request.createdAt
        }));

        return res.status(200).json({
            success: true,
            requests: enhancedRequests,
            total: enhancedRequests.length
        });

    } catch (error: any) {
        console.error("Error in getOutgoingFriendReqs controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function rejectFriendRequest(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id: requestId } = req.params;
        const currentUserId = authReq.user?._id;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ✅ Validate request ID
        const validRequestId = safeObjectId(requestId);
        if (!validRequestId) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        const friend_request = await friendRequest.findById(requestId);
        if (!friend_request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }

        // ✅ Authorization check
        if (friend_request.recipient.toString() !== currentUserId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this request"
            });
        }

        // ✅ Status check
        if (friend_request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Friend request already processed"
            });
        }

        // ✅ Delete the request
        await friendRequest.findByIdAndDelete(requestId);

        console.log('✅ Friend request rejected and deleted successfully');
        return res.status(200).json({
            success: true,
            message: "Friend request rejected"
        });

    } catch (error: any) {
        console.error("❌ Error in rejectFriendRequest controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to reject friend request"
        });
    }
}

export async function cancelFriendRequest(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const { id: recipientId } = req.params;
        const senderId = authReq.user?._id;

        if (!senderId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ✅ Validate recipient ID
        const validRecipientId = safeObjectId(recipientId);
        if (!validRecipientId) {
            return res.status(400).json({
                success: false,
                message: "Invalid recipient ID"
            });
        }

        const friend_request = await friendRequest.findOne({
            sender: senderId,
            recipient: recipientId,
            status: 'pending'
        });

        if (!friend_request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }

        await friendRequest.findByIdAndDelete(friend_request._id);

        console.log('✅ Friend request cancelled successfully');
        return res.status(200).json({
            success: true,
            message: "Friend request cancelled"
        });

    } catch (error: any) {
        console.error("❌ Error in cancelFriendRequest controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel friend request"
        });
    }
}

// ===== PROFILE MANAGEMENT =====
export async function getMyProfile(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(userId)
            .select("-password")
            .populate([
                { path: 'academic.school', select: 'name location website' },
                { path: 'academic.program', select: 'name code description' },
                { path: 'savedMaterials', select: 'title category', options: { limit: 5 } }
            ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ Enhanced profile response
        const profileResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            bio: user.bio,
            location: user.location,
            website: user.website,
            nativeLanguage: user.nativeLanguage,
            learningLanguage: user.learningLanguage,
            preferredLanguages: user.preferredLanguages,
            isOnboarded: user.isOnboarded,
            isVerified: user.isVerified,
            isActive: user.isActive,

            // ✅ Academic information
            academic: user.academic,
            academicInfo: user.academicInfo, // Virtual field

            // ✅ Activity & Stats
            activity: user.activity,
            studyStats: user.studyStats,
            contributionLevel: user.contributionLevel, // Virtual field

            // ✅ Preferences
            preferences: user.preferences,

            // ✅ Counts
            friendsCount: user.friends.length,
            savedMaterialsCount: user.savedMaterials.length,
            uploadedMaterialsCount: user.uploadedMaterials.length,

            // ✅ Timestamps
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json({
            success: true,
            user: profileResponse
        });

    } catch (error: any) {
        console.error("Error in getMyProfile:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function updateMyProfile(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const {
            fullName,
            bio,
            location,
            website,
            nativeLanguage,
            learningLanguage,
            preferredLanguages,
            preferences
        } = req.body;

        const updates: any = {};

        // ✅ Validate and update fields
        if (fullName !== undefined) {
            if (fullName.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Full name must be at least 2 characters"
                });
            }
            updates.fullName = fullName.trim();
        }

        if (bio !== undefined) {
            if (bio.length > 500) {
                return res.status(400).json({
                    success: false,
                    message: "Bio must be less than 500 characters"
                });
            }
            updates.bio = bio;
        }

        if (location !== undefined) {
            updates.location = location.trim();
        }

        if (website !== undefined) {
            if (website && !website.match(/^https?:\/\/.+/)) {
                return res.status(400).json({
                    success: false,
                    message: "Website must be a valid URL starting with http:// or https://"
                });
            }
            updates.website = website;
        }

        // ✅ Language updates
        if (nativeLanguage !== undefined) {
            updates.nativeLanguage = nativeLanguage;
        }

        if (learningLanguage !== undefined) {
            updates.learningLanguage = learningLanguage;
        }

        if (preferredLanguages !== undefined && Array.isArray(preferredLanguages)) {
            updates.preferredLanguages = preferredLanguages;
        }

        // ✅ Preferences update
        if (preferences && typeof preferences === 'object') {
            const currentUser = await User.findById(userId).select('preferences');
            updates.preferences = {
                ...currentUser?.preferences,
                ...preferences
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .select("-password")
            .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ]);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: updatedUser?._id,
                fullName: updatedUser?.fullName,
                email: updatedUser?.email,
                role: updatedUser?.role,
                profilePic: updatedUser?.profilePic,
                bio: updatedUser?.bio,
                location: updatedUser?.location,
                website: updatedUser?.website,
                nativeLanguage: updatedUser?.nativeLanguage,
                learningLanguage: updatedUser?.learningLanguage,
                preferredLanguages: updatedUser?.preferredLanguages,
                academic: updatedUser?.academic,
                academicInfo: updatedUser?.academicInfo, // Virtual field
                contributionLevel: updatedUser?.contributionLevel, // Virtual field
                preferences: updatedUser?.preferences
            }
        });

    } catch (error: any) {
        console.error("Error in updateMyProfile:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function updateProfilePicture(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { profilePic } = req.body;

        if (!profilePic) {
            return res.status(400).json({
                success: false,
                message: "Profile picture URL is required"
            });
        }

        // ✅ Basic URL validation
        if (!profilePic.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
            return res.status(400).json({
                success: false,
                message: "Profile picture must be a valid image URL"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            user: {
                _id: updatedUser?._id,
                fullName: updatedUser?.fullName,
                profilePic: updatedUser?.profilePic
            }
        });

    } catch (error: any) {
        console.error("Error in updateProfilePicture:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ===== SEARCH & DISCOVERY =====
export async function searchUsers(req: Request, res: Response): Promise<Response | any> {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        const { q, role, school, program } = req.query;
        const currentUserId = authReq.user._id;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const trimmedQuery = q.trim();
        if (trimmedQuery.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Search query must be at least 2 characters long"
            });
        }

        // ✅ Escape special regex characters
        const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // ✅ Get current user's friends
        const currentUser = await User.findById(currentUserId).select('friends');
        const friendIds = currentUser?.friends || [];

        // ✅ Build dynamic search query
        const searchQuery: any = {
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: friendIds } },
                { isOnboarded: true },
                { isActive: true },
                {
                    $or: [
                        { fullName: { $regex: escapedQuery, $options: 'i' } },
                        { email: { $regex: escapedQuery, $options: 'i' } },
                        { bio: { $regex: escapedQuery, $options: 'i' } }
                    ]
                }
            ]
        };

        // ✅ Add filters
        if (role && typeof role === 'string') {
            searchQuery.$and.push({ role: role });
        }

        if (school && typeof school === 'string') {
            searchQuery.$and.push({ 'academic.school': school });
        }

        if (program && typeof program === 'string') {
            searchQuery.$and.push({ 'academic.program': program });
        }

        const users = await User.find(searchQuery)
            .select('fullName email profilePic nativeLanguage learningLanguage bio location role academic activity')
            .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ])
            .sort({ 'activity.contributionScore': -1 }) // Sort by contribution
            .limit(25)
            .lean();

        // ✅ Get friend request statuses
        const friendRequests = await friendRequest.find({
            $or: [
                { sender: currentUserId, status: 'pending' },
                { recipient: currentUserId, status: 'pending' }
            ]
        }).select('sender recipient');

        const pendingRequestsMap = new Map();
        friendRequests.forEach(req => {
            if (req.sender.toString() === currentUserId.toString()) {
                pendingRequestsMap.set(req.recipient.toString(), 'sent');
            } else {
                pendingRequestsMap.set(req.sender.toString(), 'received');
            }
        });

        // ✅ Enhanced users with request status
        const enhancedUsers = users.map(user => ({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role,
            bio: user.bio,
            location: user.location,
            nativeLanguage: user.nativeLanguage,
            learningLanguage: user.learningLanguage,
            academic: user.academic,
            academicInfo: user.academicInfo, // Virtual field
            contributionLevel: user.contributionLevel, // Virtual field
            activity: {
                contributionScore: user.activity?.contributionScore || 0,
                uploadCount: user.activity?.uploadCount || 0
            },
            friendRequestStatus: pendingRequestsMap.get(user._id.toString()) || null
        }));

        return res.status(200).json({
            success: true,
            users: enhancedUsers,
            total: enhancedUsers.length,
            filters: {
                query: trimmedQuery,
                role: role || null,
                school: school || null,
                program: program || null
            }
        });

    } catch (error: any) {
        console.error("Error in searchUsers controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function removeFriend(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const currentUserId = authReq.user?._id;
        const { friendId } = req.params;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ✅ Validate friend ID
        const validFriendId = safeObjectId(friendId);
        if (!validFriendId) {
            return res.status(400).json({
                success: false,
                message: "Invalid friend ID"
            });
        }

        // ✅ Check if they are actually friends
        const currentUser = await User.findById(currentUserId).select('friends');
        if (!currentUser?.friends.some(id => id.toString() === friendId)) {
            return res.status(400).json({
                success: false,
                message: "You are not friends with this user"
            });
        }

        // ✅ Remove friend from both users atomically
        await Promise.all([
            User.findByIdAndUpdate(currentUserId, {
                $pull: { friends: friendId }
            }),
            User.findByIdAndUpdate(friendId, {
                $pull: { friends: currentUserId }
            })
        ]);

        console.log(`✅ Friend removed: ${currentUserId} <-> ${friendId}`);
        return res.status(200).json({
            success: true,
            message: "Friend removed successfully"
        });

    } catch (error: any) {
        console.error("Error in removeFriend:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ===== ACADEMIC & STUDY FEATURES =====
export async function getUsersByProgram(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const { programId } = req.params;
        const currentUserId = authReq.user?._id;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ✅ Validate program ID
        const validProgramId = safeObjectId(programId);
        if (!validProgramId) {
            return res.status(400).json({
                success: false,
                message: "Invalid program ID"
            });
        }

        const users = await User.find({
            'academic.program': programId,
            isActive: true,
            isVerified: true,
            _id: { $ne: currentUserId }
        })
            .select('fullName email profilePic role academic activity studyStats')
            .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ])
            .sort({ 'academic.currentSemester': 1, 'activity.contributionScore': -1 });

        const enhancedUsers = users.map(user => ({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role,
            academic: user.academic,
            academicInfo: user.academicInfo, // Virtual field
            contributionLevel: user.contributionLevel, // Virtual field
            activity: user.activity,
            studyStats: user.studyStats
        }));

        return res.status(200).json({
            success: true,
            users: enhancedUsers,
            total: enhancedUsers.length,
            program: users[0]?.academic?.program || null
        });

    } catch (error: any) {
        console.error("Error in getUsersByProgram:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function getTopContributors(req: Request, res: Response): Promise<Response | any> {
    try {
        const { limit = 10, timeframe = 'all' } = req.query;
        const limitNum = Math.min(parseInt(limit as string) || 10, 50);

        // ✅ Build date filter for timeframe
        let dateFilter = {};
        if (timeframe === 'month') {
            dateFilter = { updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
        } else if (timeframe === 'week') {
            dateFilter = { updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
        }

        const topContributors = await User.find({
            isActive: true,
            'activity.contributionScore': { $gt: 0 },
            ...dateFilter
        })
            .select('fullName profilePic role academic activity studyStats')
            .populate([
                { path: 'academic.school', select: 'name' },
                { path: 'academic.program', select: 'name code' }
            ])
            .sort({ 'activity.contributionScore': -1 })
            .limit(limitNum);

        const enhancedContributors = topContributors.map((user, index) => ({
            rank: index + 1,
            _id: user._id,
            fullName: user.fullName,
            profilePic: user.profilePic,
            role: user.role,
            academic: user.academic,
            academicInfo: user.academicInfo, // Virtual field
            contributionLevel: user.contributionLevel, // Virtual field
            activity: user.activity,
            studyStats: user.studyStats
        }));

        return res.status(200).json({
            success: true,
            contributors: enhancedContributors,
            total: enhancedContributors.length,
            timeframe
        });

    } catch (error: any) {
        console.error("Error in getTopContributors:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ===== COMPREHENSIVE FRIEND DATA =====
export async function collectFriendData(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ✅ Get user with friends
        const user = await User.findById(userId)
            .populate({
                path: 'friends',
                select: 'fullName profilePic email nativeLanguage learningLanguage location role academic activity',
                populate: [
                    { path: 'academic.school', select: 'name location' },
                    { path: 'academic.program', select: 'name code' }
                ]
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ Get received friend requests
        const receivedRequests = await friendRequest.find({
            recipient: userId,
            status: 'pending'
        })
            .populate({
                path: 'sender',
                select: 'fullName profilePic email role academic',
                populate: [
                    { path: 'academic.school', select: 'name' },
                    { path: 'academic.program', select: 'name code' }
                ]
            })
            .sort({ createdAt: -1 });

        // ✅ Get sent friend requests
        const sentRequests = await friendRequest.find({
            sender: userId,
            status: 'pending'
        })
            .populate({
                path: 'recipient',
                select: 'fullName profilePic email role academic',
                populate: [
                    { path: 'academic.school', select: 'name' },
                    { path: 'academic.program', select: 'name code' }
                ]
            })
            .sort({ createdAt: -1 });

        // ✅ Enhanced friends data
        const enhancedFriends = user.friends.map((friend: any) => ({
            _id: friend._id,
            fullName: friend.fullName,
            profilePic: friend.profilePic,
            email: friend.email,
            role: friend.role,
            location: friend.location,
            nativeLanguage: friend.nativeLanguage,
            learningLanguage: friend.learningLanguage,
            academic: friend.academic,
            academicInfo: friend.academicInfo, // Virtual field
            contributionLevel: friend.contributionLevel, // Virtual field
            activity: {
                contributionScore: friend.activity?.contributionScore || 0,
                uploadCount: friend.activity?.uploadCount || 0
            }
        }));

        // ✅ Enhanced received requests
        const enhancedReceived = receivedRequests.map(request => ({
            _id: request._id,
            sender: (typeof request.sender === 'object' && request.sender !== null && 'fullName' in request.sender)
                ? {
                    _id: (request.sender as any)?._id,
                    fullName: (request.sender as any)?.fullName,
                    profilePic: (request.sender as any)?.profilePic,
                    email: (request.sender as any)?.email,
                    role: (request.sender as any)?.role,
                    academic: (request.sender as any)?.academic,
                    academicInfo: (request.sender as any)?.academicInfo, // Virtual field
                }
                : null,
            createdAt: request.createdAt
        }));

        // ✅ Enhanced sent requests
        const enhancedSent = sentRequests.map(request => ({
            _id: request._id,
            recipient: (typeof request.recipient === 'object' && request.recipient !== null && 'fullName' in request.recipient)
                ? {
                    _id: (request.recipient as any)?._id,
                    fullName: (request.recipient as any)?.fullName,
                    profilePic: (request.recipient as any)?.profilePic,
                    email: (request.recipient as any)?.email,
                    role: (request.recipient as any)?.role,
                    academic: (request.recipient as any)?.academic,
                    academicInfo: (request.recipient as any)?.academicInfo, // Virtual field
                }
                : null,
            createdAt: request.createdAt
        }));

        return res.status(200).json({
            success: true,
            data: {
                friends: enhancedFriends,
                receivedFriendRequests: enhancedReceived,
                sentFriendRequests: enhancedSent
            },
            counts: {
                friends: enhancedFriends.length,
                receivedRequests: enhancedReceived.length,
                sentRequests: enhancedSent.length
            }
        });

    } catch (error: any) {
        console.error("Error in collectFriendData:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ===== USER STATISTICS =====
export async function getUserStats(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(userId)
            .select('activity studyStats friends savedMaterials uploadedMaterials preferredLanguages')
            .populate('savedMaterials', 'title category createdAt')
            .populate('uploadedMaterials', 'title category createdAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ Calculate additional stats
        const recentUploads = user.uploadedMaterials.filter((material: any) =>
            new Date(material.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        const recentSaves = user.savedMaterials.filter((material: any) =>
            new Date(material.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        const stats = {
            // ✅ Activity stats
            activity: user.activity,
            contributionLevel: user.contributionLevel, // Virtual field

            // ✅ Study stats
            studyStats: user.studyStats,

            // ✅ Social stats
            friendsCount: user.friends.length,

            // ✅ Content stats
            totalSavedMaterials: user.savedMaterials.length,
            totalUploadedMaterials: user.uploadedMaterials.length,
            recentUploads: recentUploads,
            recentSaves: recentSaves,

            // ✅ Language stats
            languagesCount: user.preferredLanguages.length,

            // ✅ Computed metrics
            engagementScore: user.activity.contributionScore + (user.friends.length * 5),

            // ✅ Recent activity summary
            summary: {
                isActiveContributor: user.activity.contributionScore > 100,
                isActiveLearner: user.studyStats.materialsViewed > 50,
                isSocialUser: user.friends.length > 10,
                hasRecentActivity: recentUploads > 0 || recentSaves > 0
            }
        };

        return res.status(200).json({
            success: true,
            stats
        });

    } catch (error: any) {
        console.error("Error in getUserStats:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}