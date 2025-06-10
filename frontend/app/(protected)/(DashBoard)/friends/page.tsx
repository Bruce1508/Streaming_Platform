// app/(protected)/(dashboard)/friends/page.tsx
"use client";

import { useState } from "react";
import { useFriend } from "@/hooks/useFriend";
import { 
    UserPlus, 
    Search, 
    MessageCircle, 
    Phone,
    Video,
    MoreVertical,
    Users,
    UserX,
    Clock
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function FriendsPage() {
    const { 
        friends, 
        friendRequests,
        loading, 
        removeFriend,
        acceptFriendRequest,
        declineFriendRequest
    } = useFriend();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "online">("all");

    // Filter friends
    const filteredFriends = friends.filter((friend: Friend) => {
        const matchesSearch = 
            friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || 
            (activeTab === "online" && friend.isOnline);
        
        return matchesSearch && matchesTab;
    });

    const onlineFriendsCount = friends.filter(f => f.isOnline).length;

    const handleRemoveFriend = async (friendId: string) => {
        if (confirm("Are you sure you want to remove this friend?")) {
            await removeFriend(friendId);
        }
    };

    if (loading) {
        return <FriendsLoadingSkeleton />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-base-content">Friends</h1>
                    <p className="text-base-content/60 mt-1">
                        {friends.length} friends • {onlineFriendsCount} online
                    </p>
                </div>
                
                <Link href="/friends/add" className="btn btn-primary">
                    <UserPlus className="w-5 h-5" />
                    Add Friends
                </Link>
            </div>

            {/* Friend Requests */}
            {friendRequests.length > 0 && (
                <div className="card bg-base-100 shadow-md mb-6">
                    <div className="card-body">
                        <h2 className="card-title mb-4">
                            <Clock className="w-5 h-5" />
                            Friend Requests ({friendRequests.length})
                        </h2>
                        
                        <div className="space-y-3">
                            {friendRequests.map((request: FriendRequest) => (
                                <div key={request._id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-12 rounded-full">
                                                <Image
                                                    src={request.sender.avatar || "/default-avatar.png"}
                                                    alt={request.sender.username}
                                                    width={48}
                                                    height={48}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{request.sender.username}</p>
                                            <p className="text-sm text-base-content/60">
                                                {formatTimeAgo(request.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => acceptFriendRequest(request._id)}
                                            className="btn btn-success btn-sm"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => declineFriendRequest(request._id)}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Tabs */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                                <input
                                    type="text"
                                    placeholder="Search friends..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input input-bordered w-full pl-10"
                                />
                            </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="tabs tabs-boxed">
                            <a 
                                className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
                                onClick={() => setActiveTab("all")}
                            >
                                All Friends
                            </a>
                            <a 
                                className={`tab ${activeTab === "online" ? "tab-active" : ""}`}
                                onClick={() => setActiveTab("online")}
                            >
                                Online ({onlineFriendsCount})
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Friends Grid */}
            {filteredFriends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFriends.map((friend: Friend) => (
                        <FriendCard 
                            key={friend._id} 
                            friend={friend}
                            onRemove={handleRemoveFriend}
                        />
                    ))}
                </div>
            ) : (
                <div className="card bg-base-100 shadow-lg mt-30 max-w-2xl mx-auto">
                    <div className="card-body text-center py-16">
                        <Users className="w-20 h-20 text-base-content/20 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold mb-3">No friends found</h3>
                        <p className="text-base-content/60 text-lg">
                            {searchQuery 
                                ? "Try searching with a different term"
                                : "Start adding friends to connect with other learners"
                            }
                        </p>
                        {!searchQuery && (
                            <Link href="/friends/add" className="btn btn-primary mt-6">
                                <UserPlus className="w-5 h-5" />
                                Add Friends
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Friend Card Component
function FriendCard({ 
    friend, 
    onRemove 
}: { 
    friend: any;
    onRemove: (id: string) => void;
}) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="w-14 rounded-full ring-2 ring-base-300">
                                <Image
                                    src={friend.avatar || "/default-avatar.png"}
                                    alt={friend.username}
                                    width={56}
                                    height={56}
                                />
                            </div>
                            {friend.isOnline && (
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
                            )}
                        </div>
                        
                        <div>
                            <h3 className="font-semibold">{friend.username}</h3>
                            <p className="text-sm text-base-content/60">
                                {friend.isOnline ? "Online" : `Last seen ${formatTimeAgo(friend.lastSeen)}`}
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className="btn btn-ghost btn-sm btn-square"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {showMenu && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-300 z-20">
                                    <ul className="menu p-2">
                                        <li>
                                            <a className="text-error" onClick={() => {
                                                setShowMenu(false);
                                                onRemove(friend._id);
                                            }}>
                                                <UserX className="w-4 h-4" />
                                                Remove Friend
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                    <Link href={`/chat/${friend._id}`} className="btn btn-primary btn-sm flex-1">
                        <MessageCircle className="w-4 h-4" />
                        Message
                    </Link>
                    <button className="btn btn-ghost btn-sm btn-square">
                        <Phone className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm btn-square">
                        <Video className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Loading Skeleton
function FriendsLoadingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="skeleton h-8 w-32 mb-2"></div>
                <div className="skeleton h-4 w-48"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex items-center gap-3">
                                <div className="skeleton w-14 h-14 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="skeleton h-4 w-24 mb-2"></div>
                                    <div className="skeleton h-3 w-16"></div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="skeleton h-8 flex-1"></div>
                                <div className="skeleton h-8 w-8"></div>
                                <div className="skeleton h-8 w-8"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper function
function formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
}