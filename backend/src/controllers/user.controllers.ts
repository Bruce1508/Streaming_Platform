import { Request, Response } from "express";
import User from "../models/User";
import friendRequest from "../models/friendRequest";

export async function getRecommendedUsers(req: Request, res: Response): Promise<Response | any> {
    // Kiểm tra xem user có tồn tại không
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { isOnboarded: true },
            ],
        });

        return res.status(200).json(recommendedUsers);

    } catch (error: any) {
        console.error("Error in getRecommendedUsers controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//lấy danh sách bạn bè của người dùng hiện tại 
export async function getMyFriends(req: Request, res: Response): Promise<Response | any> {
    // Kiểm tra xem user có tồn tại không
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    try {
        const user = await User.findById(req.user._id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.friends);
    } catch (error: any) {
        console.error("Error in getMyFriends controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req: Request, res: Response): Promise<Response | any> {
    const senderId = req.user._id;
    const { id: recipientId } = req.params;

    // ✅ Convert both to string for comparison
    if (senderId.toString() === recipientId) {
        return res.status(400).json({
            success: false,
            message: "You can't send friend request to yourself"
        });
    }

    try {
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            });
        }

        // ✅ Convert both to string for comparison
        if (recipient.friends.some(friendId => friendId.toString() === senderId.toString())) {
            return res.status(400).json({
                success: false,
                message: "You are already friends with this user"
            });
        }

        const existingRequest = await friendRequest.findOne({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId },
            ],
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

        console.log('✅ Friend request sent successfully:', friend_request);

        res.status(201).json({
            success: true,
            message: "Friend request sent successfully",
            sentTo: recipient.fullName,
            friendRequest: friend_request
        });

    } catch (error: any) {
        console.error("❌ Error in sendFriendRequest controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function acceptFriendRequest(req: Request, res: Response): Promise<Response | any> {
    try {
        const { id: requestId } = req.params;
        const currentUserId = req.user._id;

        console.log('🔍 Accept request - Request ID:', requestId);
        console.log('🔍 Accept request - Current User ID:', currentUserId);

        // Find the friend request by ID
        const friend_request = await friendRequest.findById(requestId);
        if (!friend_request) {
            console.log('❌ Friend request not found');
            return res.status(404).json({ success: false, message: "Friend request not found" });
        }

        console.log('📋 Friend request details:', {
            sender: friend_request.sender,
            recipient: friend_request.recipient,
            status: friend_request.status
        });

        // Verify the current user is the recipient (person who can accept)
        if (friend_request.recipient.toString() !== currentUserId.toString()) {
            console.log('❌ Authorization failed - User is not the recipient');
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this request"
            });
        }

        // Check if already accepted
        if (friend_request.status === 'accepted') {
            return res.status(400).json({
                success: false,
                message: "Friend request already accepted"
            });
        }

        // Update friend request status
        friend_request.status = "accepted";
        await friend_request.save();

        // Add each other as friends
        await User.findByIdAndUpdate(friend_request.sender, {
            $addToSet: { friends: friend_request.recipient },
        });

        await User.findByIdAndUpdate(friend_request.recipient, {
            $addToSet: { friends: friend_request.sender },
        });

        console.log('✅ Friend request accepted successfully');
        return res.status(200).json({
            success: true,
            message: "Friend request accepted"
        });

    } catch (error: any) {
        console.log("❌ Error in acceptFriendRequest controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function getFriendRequests(req: Request, res: Response): Promise<Response | any> {
    const recipient_ID = req.user._id;
    if (!recipient_ID) {
        return res.status(400).json({ message: "Recipient not found" });
    }

    try {
        //lấy các yêu cầu kết ban từ người khác gửi đến
        const incomingRequests = await friendRequest.find({
            recipient: recipient_ID,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        //lấy những lời mời kết bạn đã gửi đi và được chấp nhận bởi người khác
        const acceptedRequests = await friendRequest.find({
            sender: recipient_ID,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        return res.status(200).json({ incomingRequests, acceptedRequests });
    } catch (error: any) {
        console.log("Error in getPendingFriendRequests controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOutgoingFriendReqs(req: Request, res: Response): Promise<Response | any> {
    const recipient_ID = req.user._id;
    if (!recipient_ID) {
        return res.status(400).json({ message: "Recipient not found" });
    }

    try {
        const pendingRequests = await friendRequest.find({
            sender: recipient_ID,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        return res.status(200).json(pendingRequests);
    } catch (error: any) {
        console.log("Error in getOutGoingFriendReqs controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function rejectFriendRequest(req: Request, res: Response): Promise<Response | any> {
    try {
        const { id: requestId } = req.params;
        const currentUserId = req.user._id;

        console.log('🔍 Reject request - Request ID:', requestId);
        console.log('🔍 Reject request - Current User ID:', currentUserId);

        // Find the friend request by ID
        const friend_request = await friendRequest.findById(requestId);
        if (!friend_request) {
            console.log('❌ Friend request not found');
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }

        console.log('📋 Friend request details:', {
            sender: friend_request.sender,
            recipient: friend_request.recipient,
            status: friend_request.status
        });

        // Verify the current user is the recipient (person who can reject)
        if (friend_request.recipient.toString() !== currentUserId.toString()) {
            console.log('❌ Authorization failed - User is not the recipient');
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this request"
            });
        }

        // Check if already processed
        if (friend_request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Friend request already processed"
            });
        }

        // Delete the friend request
        await friendRequest.findByIdAndDelete(requestId);

        console.log('✅ Friend request rejected and deleted successfully');
        return res.status(200).json({
            success: true,
            message: "Friend request rejected"
        });

    } catch (error: any) {
        console.log("❌ Error in rejectFriendRequest controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function cancelFriendRequest(req: Request, res: Response): Promise<Response | any> {
    try {
        const { id: recipientId } = req.params;
        const senderId = req.user._id;

        console.log('🔍 Cancel request - Recipient ID:', recipientId);
        console.log('🔍 Cancel request - Sender ID:', senderId);

        // Find the pending friend request
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

        // Delete the friend request
        await friendRequest.findByIdAndDelete(friend_request._id);

        console.log('✅ Friend request cancelled successfully');
        return res.status(200).json({
            success: true,
            message: "Friend request cancelled"
        });

    } catch (error: any) {
        console.log("❌ Error in cancelFriendRequest controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function getMyProfile(req: Request, res: Response): Promise<Response | any> {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error: any) {
        console.log("Error in getMyProfile:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function updateMyProfile(req: Request, res: Response): Promise<Response | any> {
    try {
        const userId = req.user._id;
        const { fullName, bio, location, website } = req.body;
        const updates: any = {};

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
            if (bio.length > 200) {
                return res.status(400).json({
                    success: false,
                    message: "Bio must be less than 200 characters"
                });
            }
            updates.bio = bio;
        }

        if (location !== undefined) {
            updates.location = location;
        }

        if (website !== undefined) {
            // Basic URL validation
            if (website && !website.match(/^https?:\/\/.+/)) {
                return res.status(400).json({
                    success: false,
                    message: "Website must be a valid URL"
                });
            }
            updates.website = website;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error: any) {
        console.log("Error in updateMyProfile:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function updateProfilePicture(req: Request, res: Response): Promise<Response | any> {
    try {
        const userId = req.user._id;
        const { profilePic } = req.body;

        if (!profilePic) {
            return res.status(400).json({
                success: false,
                message: "Profile picture URL is required"
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
            user: updatedUser
        });

    } catch (error: any) {
        console.log("Error in updateProfilePicture:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function searchUsers(req: Request, res: Response): Promise<Response | any> {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    try {
        const { q } = req.query;
        const currentUserId = req.user._id;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Trim và validate query length
        const trimmedQuery = q.trim();
        if (trimmedQuery.length < 2) {
            return res.status(400).json({
                message: "Search query must be at least 2 characters long"
            });
        }

        // Escape special regex characters để tránh lỗi
        const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Lấy danh sách bạn bè hiện tại để exclude
        const currentUser = await User.findById(currentUserId).select('friends');
        const friendIds = currentUser?.friends || [];

        const searchQuery = {
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: friendIds } }, // Exclude existing friends
                { isOnboarded: true },
                {
                    $or: [
                        { fullName: { $regex: escapedQuery, $options: 'i' } },
                        { email: { $regex: escapedQuery, $options: 'i' } },
                        // Có thể thêm username nếu có field này
                        // { username: { $regex: escapedQuery, $options: 'i' } }
                    ]
                }
            ]
        };

        const users = await User.find(searchQuery)
            .select('fullName email profilePic nativeLanguage learningLanguage bio location')
            .limit(20) // Tăng limit lên 20
            .lean(); // Dùng lean() để performance tốt hơn

        // Thêm thông tin về friend request status nếu cần
        const friendRequests = await friendRequest.find({
            $or: [
                { sender: currentUserId, status: 'pending' },
                { recipient: currentUserId, status: 'pending' }
            ]
        }).select('sender recipient');

        const pendingRequestsMap = new Map();
        friendRequests.forEach(req => {
            if (req.sender.toString() === currentUserId) {
                pendingRequestsMap.set(req.recipient.toString(), 'sent');
            } else {
                pendingRequestsMap.set(req.sender.toString(), 'received');
            }
        });

        // Enhance users với request status
        const enhancedUsers = users.map(user => ({
            ...user,
            friendRequestStatus: pendingRequestsMap.get(user._id.toString()) || null
        }));

        return res.status(200).json({
            users: enhancedUsers,
            total: enhancedUsers.length
        });
    } catch (error: any) {
        console.error("Error in searchUsers controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function removeFriend(req: Request, res: Response): Promise<Response | any> {
    try {
        const currentUserId = req.user._id;
        const { friendId } = req.params;

        // Remove friend from both users
        await User.findByIdAndUpdate(currentUserId, {
            $pull: { friends: friendId }
        });

        await User.findByIdAndUpdate(friendId, {
            $pull: { friends: currentUserId }
        });

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

export async function collectFriendData(req: Request, res: Response): Promise<Response | any> {
    try {
        const userId = req.user.id;

        // Get user with friends
        const user = await User.findById(userId)
            .populate('friends', 'username profilePicture email nativeLanguage learningLanguage location');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Get received friend requests from FriendRequest collection
        const receivedRequests = await friendRequest.find({
            recipient: userId,
            status: 'pending'
        }).populate('sender', 'username profilePicture email');

        // ✅ Get sent friend requests from FriendRequest collection  
        const sentRequests = await friendRequest.find({
            sender: userId,
            status: 'pending'
        }).populate('recipient', 'username profilePicture email');

        res.json({
            friends: user.friends || [],
            receivedFriendRequests: receivedRequests || [],
            sentFriendRequests: sentRequests || [] // 
        });
    } catch (error) {
        console.error("Get friends error:", error);
        res.status(500).json({ message: "Server error" });
    }
}