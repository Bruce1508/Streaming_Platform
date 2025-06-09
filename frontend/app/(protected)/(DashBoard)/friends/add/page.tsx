// app/(protected)/(dashboard)/friends/add/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useFriend } from "@/hooks/useFriend";
import { useAuth } from "@/contexts/AuthContext";
import {
    Search,
    UserPlus,
    UserCheck,
    Clock,
    ArrowLeft,
    Globe,
    Award,
    Send
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchUser {
    _id: string;
    fullName: string;
    email: string;
    profilePic?: string;
    level?: string;
    friendRequestSent?: boolean;
}

export default function AddFriendsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const {
        friends,
        sendFriendRequest,
    } = useFriend();

    console.log("add friend page work");

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [requestsSent, setRequestsSent] = useState<Set<string>>(new Set());

    // Search users function
    const searchUsers = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token || token === "null" || token === "undefined") {
            console.error("❌ No valid auth token found");
            // Redirect to login or show error
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/search?q=${encodeURIComponent(searchQuery)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            console.log("📡 Response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                // Filter out current user and existing friends
                const filteredUsers = (data.users || []).filter((u: SearchUser) =>
                    u._id !== user?._id &&
                    !friends.some(f => f._id === u._id)
                );
                setSearchResults(filteredUsers);
                console.log('Search query:', searchQuery);
                console.log('API response:', data);
            } else {
                const error = await response.json();
                console.error("❌ Error response:", error);
            }
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchUsers();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleSendRequest = async (recipientId: string) => {
        const success = await sendFriendRequest(recipientId);
        if (success) {
            setRequestsSent(prev => new Set(prev).add(recipientId));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href="/friends" className="btn btn-ghost btn-sm mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Friends
                </Link>

                <h1 className="text-3xl font-bold text-base-content mb-2">
                    Add Friends
                </h1>
                <p className="text-base-content/60">
                    Connect with language learners around the world
                </p>
            </div>

            {/* Search */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">
                    <h2 className="card-title mb-4">
                        <Search className="w-5 h-5" />
                        Find Friends
                    </h2>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search by username or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-bordered w-full pl-10"
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            {/* Search Results */}
            {loading ? (
                <SearchLoadingSkeleton />
            ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                    {searchResults.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            onSendRequest={handleSendRequest}
                            requestSent={requestsSent.has(user._id)}
                        />
                    ))}
                </div>
            ) : searchQuery ? (
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body text-center py-8">
                        <p className="text-base-content/60">
                            No users found matching "{searchQuery}"
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body text-center py-12">
                        <Search className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">Search for friends</h3>
                        <p className="text-base-content/60">
                            Enter a username or email to find other language learners
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// User Card Component
function UserCard({
    user,
    onSendRequest,
    requestSent
}: {
    user: SearchUser;
    onSendRequest: (id: string) => void;
    requestSent: boolean;
}) {
    return (
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="avatar">
                            <div className="w-16 rounded-full ring-2 ring-base-300">
                                <Image
                                    src={user.profilePic || "/default-avatar.png"}
                                    alt={user.fullName}
                                    width={64}
                                    height={64}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">{user.fullName}</h3>
                            <p className="text-base-content/60">{user.email}</p>

                            {user.level && (
                                <div className="flex items-center gap-1 text-sm mt-1">
                                    <Award className="w-4 h-4" />
                                    <span className="capitalize">{user.level}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {requestSent ? (
                            <button className="btn btn-success btn-sm" disabled>
                                <UserCheck className="w-4 h-4" />
                                Request Sent
                            </button>
                        ) : (
                            <button
                                onClick={() => onSendRequest(user._id)}
                                className="btn btn-primary btn-sm"
                            >
                                <Send className="w-4 h-4" />
                                Send Request
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading Skeleton
function SearchLoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <div className="flex items-center gap-4">
                            <div className="skeleton w-16 h-16 rounded-full"></div>
                            <div className="flex-1">
                                <div className="skeleton h-4 w-32 mb-2"></div>
                                <div className="skeleton h-3 w-48"></div>
                            </div>
                            <div className="skeleton h-8 w-24"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}