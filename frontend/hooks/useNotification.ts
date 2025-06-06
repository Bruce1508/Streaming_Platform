import { useState, useEffect, useCallback } from 'react';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
    _id: string;
    fullName: string;
    profilePic: string;
    nativeLanguage: string;
    learningLanguage: string;
}

interface FriendRequest {
    _id: string;
    sender: User;
    recipient: User;
    status: string;
}

interface FriendRequestsData {
    incomingRequests: FriendRequest[];
    acceptedRequests: FriendRequest[];
}

export const useNotifications = () => {
    const [friendRequests, setFriendRequests] = useState<FriendRequestsData>({
        incomingRequests: [],
        acceptedRequests: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null);
    const [rejectingRequest, setRejectingRequest] = useState<string | null>(null); 

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log('📞 Fetching friend requests...');

            const response = await getFriendRequests();
            console.log('📦 Friend requests response:', response);

            setFriendRequests({
                incomingRequests: response?.incomingRequests || [],
                acceptedRequests: response?.acceptedRequests || []
            });

            console.log('✅ Friend requests loaded successfully');
        } catch (error) {
            console.error('❌ Error fetching friend requests:', error);
            toast.error('Failed to load notifications');
        } finally {
            setIsLoading(false);
            console.log('🏁 Loading completed');
        }
    }, []);

    // ✅ Auto-fetch on mount
    useEffect(() => {
        fetchData();
    }, []); // ✅ Empty dependency - only run once

    const handleAcceptRequest = useCallback(async (requestId: string) => {
        try {
            setAcceptingRequest(requestId);
            await acceptFriendRequest(requestId);

            toast.success('Friend request accepted!');

            // ✅ Refetch after accepting
            await fetchData();
        } catch (error) {
            console.error('Error accepting friend request:', error);
            toast.error('Failed to accept friend request');
        } finally {
            setAcceptingRequest(null);
        }
    }, [fetchData]);

    const handleRejectRequest = useCallback(async (requestId: string) => {
        try {
            setRejectingRequest(requestId);
            await rejectFriendRequest(requestId);
            toast.success('Friend request rejected');
            await fetchData();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            toast.error('Failed to reject friend request');
        } finally {
            setRejectingRequest(null);
        }
    }, [fetchData]);

    const refreshNotifications = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        friendRequests,
        isLoading,
        acceptingRequest,
        handleAcceptRequest,
        refreshNotifications,
        rejectingRequest,
        handleRejectRequest
    };
};