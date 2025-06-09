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
    const { user } = useAuth();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFriends = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friends/search`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setFriends(data.friends || []);
            }
        } catch (error) {
            console.error("Error fetching friends in hoook useFriend.ts:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friend-requests`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setFriendRequests(data.requests || []);
            }
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    };

    const sendFriendRequest = async (recipientId: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friend-request`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    body: JSON.stringify({ recipientId }),
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
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friend-request/${requestId}/accept`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/friend-request/${requestId}/decline`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${user?._id}/friends/${friendId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
    }, [user?._id]);

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