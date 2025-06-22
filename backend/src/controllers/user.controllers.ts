// backend/src/controllers/user.controller.ts
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import friendRequest from "../models/friendRequest";
import mongoose from "mongoose";
import { 
    capitalize, 
    maskEmail,
    formatFileSize,
    truncate 
} from '../utils/Format.utils';
import { 
    searchUsers as searchUtilsFunction,
    buildSearchQuery,
    calculateRelevanceScore 
} from '../utils/Search.utils';
import { logApiRequest } from '../utils/Api.utils';

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
    // ✅ Log API request
    logApiRequest(req as any);

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

        // ✅ Academic-focused recommendation base query
        const baseQuery = {
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true },
                { isActive: true },
                { role: { $in: ['student', 'professor'] } } // Only academic users
            ],
        };

        let recommendedUsers = [];

        // 🎯 Strategy 1: Same School, Different Programs (Academic Diversity)
        if (currentUser.role === 'student' && currentUser.academic?.school) {
            const sameSchoolUsers = await User.find({
                ...baseQuery,
                'academic.school': currentUser.academic.school,
                'academic.program': { $ne: currentUser.academic?.program } // Different programs
            })
                .select('fullName email profilePic role bio location academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .limit(8);

            recommendedUsers.push(...sameSchoolUsers);
        }

        // 🎯 Strategy 2: Same Program, Different Semesters (Study Buddies)
        if (currentUser.role === 'student' && currentUser.academic?.program) {
            const sameProgramUsers = await User.find({
                ...baseQuery,
                'academic.program': currentUser.academic.program,
                'academic.currentSemester': { $ne: currentUser.academic?.currentSemester },
                _id: { $nin: recommendedUsers.map(u => u._id) }
            })
                .select('fullName email profilePic role bio location academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .limit(6);

            recommendedUsers.push(...sameProgramUsers);
        }

        // 🎯 Strategy 3: High Contributors (Academic Excellence)
        if (recommendedUsers.length < 12) {
            const topContributors = await User.find({
                ...baseQuery,
                'activity.contributionScore': { $gte: 50 }, // Active contributors
                _id: { $nin: recommendedUsers.map(u => u._id) }
            })
                .select('fullName email profilePic role bio location academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .sort({ 'activity.contributionScore': -1 })
                .limit(6);

            recommendedUsers.push(...topContributors);
        }

        // 🎯 Strategy 4: Fill with Active Academic Users
        if (recommendedUsers.length < 15) {
            const remainingUsers = await User.find({
                ...baseQuery,
                _id: { $nin: recommendedUsers.map(u => u._id) }
            })
                .select('fullName email profilePic role bio location academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .sort({ 'activity.contributionScore': -1, lastLogin: -1 })
                .limit(15 - recommendedUsers.length);

            recommendedUsers.push(...remainingUsers);
        }

        // ✅ Clean academic-focused response with formatting
        const enhancedUsers = recommendedUsers.map(user => ({
            _id: user._id,
            fullName: capitalize(user.fullName), // ✅ Format name
            email: maskEmail(user.email), // ✅ Mask email for privacy
            profilePic: user.profilePic,
            role: user.role,
            bio: user.bio ? truncate(user.bio, 100) : null, // ✅ Truncate bio
            location: user.location,
            academic: user.academic,
            contributionLevel: user.contributionLevel, // Virtual field
            academicInfo: user.academicInfo, // Virtual field
            activity: {
                contributionScore: user.activity?.contributionScore || 0,
                uploadCount: user.activity?.uploadCount || 0
            },
            // ✅ Academic similarity indicators
            academicMatch: {
                sameSchool: user.academic?.school?.toString() === currentUser.academic?.school?.toString(),
                sameProgram: user.academic?.program?.toString() === currentUser.academic?.program?.toString(),
                isContributor: (user.activity?.contributionScore || 0) >= 50
            }
        }));

        return res.status(200).json({
            success: true,
            users: enhancedUsers,
            total: enhancedUsers.length,
            recommendationStrategies: {
                sameSchool: enhancedUsers.filter(u => u.academicMatch.sameSchool).length,
                sameProgram: enhancedUsers.filter(u => u.academicMatch.sameProgram).length,
                contributors: enhancedUsers.filter(u => u.academicMatch.isContributor).length
            }
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
                select: "fullName profilePic role bio location academic activity",
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
                select: "fullName profilePic role bio location academic activity",
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
                select: "fullName profilePic learning role academic",
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

        const profileResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            bio: user.bio,
            location: user.location,
            website: user.website,
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
            preferences,
            academic // ✅ Added academic updates
        } = req.body;

        const updates: any = {};

        // ✅ Validate and update basic fields
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
            updates.bio = bio.trim();
        }

        if (location !== undefined) {
            if (location.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Location must be less than 100 characters"
                });
            }
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

        // ✅ Academic updates (new feature)
        if (academic && typeof academic === 'object') {
            const currentUser = await User.findById(userId).select('academic');
            const currentAcademic = currentUser?.academic || {};
            
            // Validate academic updates
            if (academic.studentId !== undefined) {
                if (academic.studentId && !/^[A-Z0-9]+$/.test(academic.studentId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Student ID can only contain letters and numbers"
                    });
                }
            }
            
            if (academic.currentSemester !== undefined) {
                const semester = parseInt(academic.currentSemester);
                if (isNaN(semester) || semester < 1 || semester > 8) {
                    return res.status(400).json({
                        success: false,
                        message: "Current semester must be between 1 and 8"
                    });
                }
            }

            updates.academic = {
                ...currentAcademic,
                ...academic
            };
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
    // ✅ Log API request
    logApiRequest(req as any);

    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        const { q, role, school, program, semester, sortBy = 'relevance' } = req.query;
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

        // ✅ Get current user's friends to exclude
        const currentUser = await User.findById(currentUserId).select('friends');
        const friendIds = currentUser?.friends || [];

        // ✅ Build search query with simple approach
        const searchFields = ['fullName', 'email', 'bio', 'academic.studentId'];
        const searchOrConditions = buildSearchQuery(trimmedQuery, searchFields);

        const searchQuery: any = {
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: friendIds } },
                { isOnboarded: true },
                { isActive: true },
                searchOrConditions
            ]
        };

        // ✅ Academic filters
        if (role && typeof role === 'string') {
            searchQuery.$and.push({ role: role });
        }

        if (school && typeof school === 'string') {
            searchQuery.$and.push({ 'academic.school': school });
        }

        if (program && typeof program === 'string') {
            searchQuery.$and.push({ 'academic.program': program });
        }

        if (semester && typeof semester === 'string') {
            const semesterNum = parseInt(semester);
            if (!isNaN(semesterNum)) {
                searchQuery.$and.push({ 'academic.currentSemester': semesterNum });
            }
        }

        const users = await User.find(searchQuery)
            .select('fullName email profilePic bio location role academic activity lastLogin')
            .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ])
            .sort({ 'activity.contributionScore': -1, lastLogin: -1 })
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

        // ✅ Enhanced response with formatting
        const enhancedUsers = users.map((user: any) => ({
            _id: user._id,
            fullName: capitalize(user.fullName), // ✅ Format name
            email: maskEmail(user.email), // ✅ Mask email for privacy
            profilePic: user.profilePic,
            role: user.role,
            bio: user.bio ? truncate(user.bio, 100) : null, // ✅ Truncate bio
            location: user.location,
            academic: user.academic,
            academicInfo: user.academicInfo, // Virtual field
            contributionLevel: user.contributionLevel, // Virtual field
            activity: {
                contributionScore: user.activity?.contributionScore || 0,
                uploadCount: user.activity?.uploadCount || 0
            },
            friendRequestStatus: pendingRequestsMap.get(user._id.toString()) || null,
            // ✅ Academic relevance scores
            relevanceScore: {
                searchScore: calculateRelevanceScore(user, trimmedQuery, {
                    fullName: 3,
                    email: 2,
                    bio: 1,
                    'academic.studentId': 2
                }),
                isContributor: (user.activity?.contributionScore || 0) >= 10,
                isActive: user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                hasProfile: !!(user.bio && user.academic?.program)
            }
        }));

        return res.status(200).json({
            success: true,
            users: enhancedUsers,
            total: enhancedUsers.length,
            filters: {
                query: trimmedQuery,
                role: role || null,
                school: school || null,
                program: program || null,
                semester: semester || null,
                sortBy
            },
            stats: {
                contributors: enhancedUsers.filter((u: any) => u.relevanceScore.isContributor).length,
                activeUsers: enhancedUsers.filter((u: any) => u.relevanceScore.isActive).length,
                completeProfiles: enhancedUsers.filter((u: any) => u.relevanceScore.hasProfile).length
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
                select: 'fullName profilePic email location role academic activity',
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
            .select('activity studyStats friends savedMaterials uploadedMaterials academic role') // 
            .populate('savedMaterials', 'title category createdAt')
            .populate('uploadedMaterials', 'title category createdAt')
            .populate('academic.school', 'name')
            .populate('academic.program', 'name code');

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

        // ✅ Academic progress calculations
        const completedCoursesCount = user.academic?.completedCourses?.length || 0;
        const currentSemester = user.academic?.currentSemester || 0;
        const enrollmentYear = user.academic?.enrollmentYear || new Date().getFullYear();
        const academicYearsActive = new Date().getFullYear() - enrollmentYear + 1;

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

            academicStats: {
                completedCourses: completedCoursesCount,
                currentSemester: currentSemester,
                enrollmentYear: enrollmentYear,
                academicYearsActive: academicYearsActive,
                academicStatus: user.academic?.status || 'active',
                hasProgram: !!(user.academic?.program),
                hasSchool: !!(user.academic?.school)
            },

            // ✅ Enhanced computed metrics (academic-focused)
            engagementScore: user.activity.contributionScore + (user.friends.length * 5) + (completedCoursesCount * 2),
            
            // ✅ Academic performance indicators
            academicPerformance: {
                coursesPerYear: academicYearsActive > 0 ? Math.round((completedCoursesCount / academicYearsActive) * 10) / 10 : 0,
                contributionsPerSemester: currentSemester > 0 ? Math.round((user.activity.uploadCount / currentSemester) * 10) / 10 : 0,
                studyEfficiency: user.studyStats.materialsViewed > 0 ? Math.round((user.studyStats.materialsSaved / user.studyStats.materialsViewed) * 100) : 0
            },

            // ✅ Updated activity summary (academic-focused)
            summary: {
                isActiveContributor: user.activity.contributionScore > 100,
                isActiveLearner: user.studyStats.materialsViewed > 50,
                isSocialUser: user.friends.length > 10,
                hasRecentActivity: recentUploads > 0 || recentSaves > 0,
                // ✅ NEW academic indicators
                isAcademicUser: !!(user.academic?.program && user.academic?.school),
                isActiveStudent: user.role === 'student' && user.academic?.status === 'active',
                hasAcademicProgress: completedCoursesCount > 0,
                isContributingStudent: user.role === 'student' && user.activity.contributionScore > 50
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