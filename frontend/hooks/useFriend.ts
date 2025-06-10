import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Friend {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    lastSeen?: Date;
    isOnline?: boolean;
}

interface FriendRequest {
    _id: string;
    sender: {
        _id: string;
        username: string;
        email: string;
        avatar?: string;
    };
    createdAt: Date;
}

export function useFriend() {
    const { user, token } = useAuth();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const getValidToken = (): string | null => {
        // Try context first
        if (token && typeof token === 'string' && token !== 'null') {
            return token;
        }

        // Try localStorage
        const storageToken = localStorage.getItem("auth_token");
        if (storageToken && storageToken !== 'null' && storageToken !== 'undefined') {
            return typeof storageToken === 'string' ? storageToken : String(storageToken);
        }

        return null;
    }

    const fetchFriends = async () => {
        try {
            const validToken = getValidToken();

            console.log('🔍 fetchFriends token check:', {
                hasContextToken: !!token,
                hasStorageToken: !!localStorage.getItem("auth_token"),
                finalToken: !!validToken,
                tokenType: typeof validToken
            });

            if (!validToken) {
                console.error('❌ No auth token found in fetchFriends');
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friends`,
                {
                    headers: {
                        Authorization: `Bearer ${validToken}`,
                    },
                }
            );

            console.log('📡 fetchFriends response:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Friends data:', data);
                setFriends(data || []);
            } else {
                const error = await response.json();
                console.error('❌ fetchFriends error:', error);
            }
        } catch (error) {
            console.error("❌ Error fetching friends:", error);
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

    const sendFriendRequest = async (recipientId: string) => {
        try {
            const validToken = getValidToken();
            if (!validToken) return false;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friend-request/${recipientId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${validToken}`,
                    },
                }
            );
            return response.ok;
        } catch (error) {
            console.error("Error sending friend request:", error);
            return false;
        }
    };

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
                await fetchFriends();
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
            const token = localStorage.getItem("auth_token");
            // ✅ Tạo route DELETE friend mới trong backend
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friends/${friendId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                await fetchFriends();
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchFriends();
            fetchFriendRequests();
        }
    }, [user?._id, token]);

    return {
        friends,
        friendRequests,
        loading,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        refreshFriends: fetchFriends,
        refreshRequests: fetchFriendRequests
    };


} //end of useFriend()