import { useState } from 'react';
import { getUserFriends, getRecommendedUsers, getOutgoingFriendReqs, sendFriendRequest } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
    _id: string;
    fullName: string;
    profilePic: string;
    bio: string;
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
}

interface FriendRequest {
    _id: string;
    recipient: User;
    sender: User;
    status: string;
}

// 🎯 Hook 1: Quản lý danh sách bạn bè
export const useFriends = () => {
    const [friends, setFriends] = useState<User[]>([]); // Dùng User thay vì Friend
    const [loadingFriends, setLoadingFriends] = useState(true);

    const fetchFriends = async () => {
        try {
            setLoadingFriends(true);
            const response = await getUserFriends();
            setFriends(response || []);
        } catch (error) {
            console.error('Error fetching friends:', error);
            toast.error('Failed to load friends');
        } finally {
            setLoadingFriends(false);
        }
    };

    const refreshFriends = () => fetchFriends();

    return {
        friends,
        loadingFriends,
        fetchFriends,
        refreshFriends
    };
};

// 🎯 Hook 2: Quản lý danh sách người dùng được đề xuất
export const useRecommendedUsers = () => {
    const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const fetchRecommendedUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await getRecommendedUsers();
            setRecommendedUsers(response || []);
        } catch (error) {
            console.error('Error fetching recommended users:', error);
            toast.error('Failed to load recommended users');
        } finally {
            setLoadingUsers(false);
        }
    };

    const refreshRecommendedUsers = () => fetchRecommendedUsers();

    return {
        recommendedUsers,
        loadingUsers,
        fetchRecommendedUsers,
        refreshRecommendedUsers
    };
};

// 🎯 Hook 3: Quản lý lời mời kết bạn đã gửi
export const useOutgoingRequests = () => {
    const [outgoingFriendReqs, setOutgoingFriendReqs] = useState<FriendRequest[]>([]);
    const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set<string>());
    const [loadingOutgoing, setLoadingOutgoing] = useState(true);

    const fetchOutgoingRequests = async () => {
        try {
            setLoadingOutgoing(true);
            const response = await getOutgoingFriendReqs();
            setOutgoingFriendReqs(response || []);

            // Tạo Set các ID để check nhanh trong UI
            const outgoingIds = new Set<string>();
            if (response && response.length > 0) {
                response.forEach((req: FriendRequest) => {
                    outgoingIds.add(req.recipient._id);
                });
            }
            setOutgoingRequestsIds(outgoingIds);
        } catch (error) {
            console.error('Error fetching outgoing requests:', error);
        } finally {
            setLoadingOutgoing(false);
        }
    };

    const refreshOutgoingRequests = () => fetchOutgoingRequests();

    return {
        outgoingFriendReqs,
        outgoingRequestsIds,
        loadingOutgoing,
        fetchOutgoingRequests,
        refreshOutgoingRequests
    };
};

// 🎯 Hook 4: Xử lý các hành động với bạn bè
export const useFriendActions = () => {
    const [sendingRequest, setSendingRequest] = useState<string | null>(null);

    const handleSendFriendRequest = async (userId: string, onSuccess?: () => void) => {
        try {
            setSendingRequest(userId);
            await sendFriendRequest(userId);
            toast.success('Friend request sent!');

            // Callback để refresh data
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error sending friend request:', error);
            toast.error('Failed to send friend request');
        } finally {
            setSendingRequest(null);
        }
    };

    return {
        sendingRequest,
        handleSendFriendRequest
    };
};