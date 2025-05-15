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
    const myId = req.user._id;
    const { id: recipientId } = req.params;
    if (myId === recipientId) {
        return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    try {
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        if (recipient.friends.some(friendId => friendId.toString() === myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        const existingRequest = await friendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user" });
        }

        const friend_request = await friendRequest.create({
            sender: myId,
            recipient: recipientId,
        })

        res.status(201).json(friend_request);

    } catch (error: any) {
        console.error("Error in sendFriendRequest controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function acceptFriendRequest(req: Request, res: Response): Promise<Response | any> {
    const { id: recipientId } = req.params;

    try {
        const friend_request = await friendRequest.findById(recipientId);
        if (!friend_request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Verify the current user is the recipient
        if (friend_request.recipient.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friend_request.status = "accepted";
        await friend_request.save();

        await User.findByIdAndUpdate(friend_request.sender, {
            $addToSet: { friends: friend_request.recipient },
        });

        await User.findByIdAndUpdate(friend_request.recipient, {
            $addToSet: { friends: friend_request.sender },
        })

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error: any) {
        console.log("Error in acceptFriendRequests controllers: ", error.message)
        return res.status(500).json({ message: "Internal Server Error" });
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