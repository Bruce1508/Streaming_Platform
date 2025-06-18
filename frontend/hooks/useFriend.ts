import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { makeAuthenticationRequest } from "@/lib/api";
import { getValidToken } from "@/lib/tokenUtils";
import { FriendRequest, Friend } from "@/types/Friend";

export function useFriend() {
    const { user, token } = useAuth();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

    //fetch our friends
    const fetchFriendData = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching friend data from /me/friends...');

            // ✅ Use new consolidated endpoint
            const response = await makeAuthenticationRequest('/users/me/friends');

            if (response.ok) {
                const data = await response.json();

                console.log('✅ Friend data received:', {
                    friendsCount: data.friends?.length || 0,
                    receivedRequestsCount: data.receivedFriendRequests?.length || 0,
                    sentRequestsCount: data.sentFriendRequests?.length || 0
                });

                setFriends(data.friends || []);
                setFriendRequests(data.receivedFriendRequests || []);
                setSentRequests(data.sentFriendRequests || []); // ✅ Set sent requests from FriendRequest collection
            } else {
                console.error('❌ Failed to fetch friend data:', response.status);
            }
        } catch (error) {
            console.error('❌ Error fetching friend data:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchFriendRequests = async () => {
        try {
            const validToken = getValidToken();

            if (!validToken) {
                console.error('❌ No auth token for fetchFriendRequests');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friend-requests`,
                {
                    headers: {
                        Authorization: `Bearer ${validToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setFriendRequests(data.incomingRequests || []);
            }
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    };

    //sau này chuyển vào api.ts
    const sendFriendRequest = async (recipientId: string) => {
        try {
            const validToken = getValidToken();
            if (!validToken) {
                throw new Error('No authentication token');
            }

            const response = await makeAuthenticationRequest(
                `/users/friend-request/${recipientId}`,
                { method: 'POST' }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send friend request');
            }
            await fetchFriendData();
            return true;

        } catch (error: any) {
            console.error("Error sending friend request:", error);
            // ✅ Re-throw to let component handle the error
            throw error;
        }
    };

    useEffect(() => {
        fetchFriendData();
    }, []);

    const acceptFriendRequest = async (requestId: string) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friend-request/${requestId}/accept`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                // await fetchFriends();
                await fetchFriendRequests();
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const declineFriendRequest = async (requestId: string) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friend-request/${requestId}/decline`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                await fetchFriendRequests();
            }
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    };

    const removeFriend = async (friendId: string) => {
        try {
            const response = await makeAuthenticationRequest(
                `/users/friends/${friendId}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove friend');
            }

            await fetchFriendData(); // ✅ Consistent refresh
            return true;
        } catch (error: any) {
            console.error("Error removing friend:", error);
            throw error;
        }
    };

    const cancelFriendRequest = async (recipientId: string) => {
        try {
            const validToken = getValidToken();
            if (!validToken) {
                throw new Error('No authentication token');
            }

            // ✅ Use consistent API pattern
            const response = await makeAuthenticationRequest(
                `/users/friend-request/${recipientId}/cancel`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel friend request');
            }

            // ✅ Use consistent refresh pattern
            await fetchFriendData();
            return true;

        } catch (error: any) {
            console.error("Error canceling friend request:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchFriendData();
        }
    }, [user?._id, token]);

    return {
        friends,
        friendRequests,
        loading,
        sentRequests,
        sendFriendRequest,
        cancelFriendRequest,  
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        refreshFriends: fetchFriendData, // ✅ Use consolidated function
        refreshRequests: fetchFriendData, // ✅ Use consolidated function
        friendsLoading: loading
    };


} //end of useFriend()