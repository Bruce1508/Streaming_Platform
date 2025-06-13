'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MapPin, Languages, UserPlus, Loader2, UserCheck, Clock } from 'lucide-react';
import {
    getRecommendedUsers,
    searchUsers
} from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useFriend } from '@/hooks/useFriend'; // Import useFriend hook\
import Avatar from '@/components/ui/Avatar';
import { cancelFriendRequest } from '@/lib/api';

interface User {
    _id: string;
    fullName: string;
    username?: string;
    avatar?: string;
    profilePic?: string;
    nativeLanguage: string;
    learningLanguage: string;
    location?: string;
    email: string;
}

interface FilterOptions {
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
}

interface FriendRequestStatus {
    [userId: string]: 'none' | 'sent' | 'received' | 'friends';
}

const LANGUAGES = [
    'English', 'Vietnamese', 'Japanese', 'Korean', 'Chinese',
    'Spanish', 'French', 'German', 'Italian', 'Portuguese'
];

const AddFriendsPage = () => {
    const { user: currentUser } = useAuth();
    const {
        friends,
        friendRequests,
        sentRequests,
        friendsLoading,
        refreshRequests, 
        sendFriendRequest
    } = useFriend();

    // State management
    const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [friendRequestStatus, setFriendRequestStatus] = useState<FriendRequestStatus>({});
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());

    // Filter state
    const [filters, setFilters] = useState<FilterOptions>({
        nativeLanguage: '',
        learningLanguage: '',
        location: ''
    });

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Load recommended users on mount
    useEffect(() => {
        loadRecommendedUsers();
    }, []);

    // Update friend status when friends or friendRequests change
    useEffect(() => {
        console.log('🔄 Updating friend status:', {
            friendsCount: friends?.length || 0,
            requestsCount: friendRequests?.length || 0
        });
        buildFriendRequestStatusMap();
    }, [friends, friendRequests]);

    useEffect(() => {
        console.log('🔄 Building friend status map:', {
            friendsCount: friends?.length || 0,
            receivedCount: friendRequests?.length || 0,
            sentCount: sentRequests?.length || 0
        });
        buildFriendRequestStatusMap();
    }, [friends, friendRequests, sentRequests]);

    const loadRecommendedUsers = async () => {
        try {
            setIsLoading(true);
            console.log('🔄 Loading recommended users...');

            const users = await getRecommendedUsers();
            console.log('✅ Recommended users loaded:', users.length);

            setRecommendedUsers(users);

        } catch (error) {
            console.error('❌ Error loading recommended users:', error);
            toast.error('Failed to load recommended users');
        } finally {
            setIsLoading(false);
        }
    };

    // Build friend request status map using useFriend data
    const buildFriendRequestStatusMap = () => {
        const statusMap: FriendRequestStatus = {};

        // Mark existing friends
        if (friends && friends.length > 0) {
            console.log('👥 Marking friends:', friends.length);
            friends.forEach((friend) => {
                statusMap[friend._id] = 'friends';
            });
        }

        // Mark received friend requests (people who sent you requests)
        if (friendRequests && friendRequests.length > 0) {
            console.log('📥 Marking received requests:', friendRequests.length);
            friendRequests.forEach((request) => {
                statusMap[request.sender._id] = 'received';
            });
        }

        // ✅ Mark sent friend requests (people you sent requests to)
        if (sentRequests && sentRequests.length > 0) {
            console.log('📤 Marking sent requests:', sentRequests.length);
            sentRequests.forEach((request) => {
                // ✅ Use request.recipient._id because you sent TO this person
                statusMap[request.recipient._id] = 'sent';
            });
        }

        console.log('🔄 Final friend request status map:', statusMap);
        setFriendRequestStatus(statusMap);
    };

    // Search functionality with API
    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            setIsSearching(true);
            console.log('🔍 Searching users with query:', query);

            const results = await searchUsers(query);
            console.log('✅ Search results:', results.length);

            // Filter out current user and existing friends
            const filteredResults = results.filter(user =>
                user._id !== currentUser?._id &&
                !friends?.some((friend) => friend._id === user._id)
            );

            console.log('🔄 Filtered search results:', filteredResults.length);
            setSearchResults(filteredResults);

        } catch (error: any) {
            console.error('❌ Search error:', error);

            if (error.message === 'Unauthorized') {
                return;
            }

            toast.error('Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    // Send friend request using useFriend hook
    const handleSendFriendRequest = async (userId: string) => {
        try {
            setProcessingRequests(prev => new Set(prev).add(userId));
            console.log('👥 Sending friend request to:', userId);

            const success = await sendFriendRequest(userId);

            if (success) {
                console.log('✅ Friend request sent successfully');
                
                // ✅ Update status immediately for better UX
                setFriendRequestStatus(prev => ({
                    ...prev,
                    [userId]: 'sent'
                }));

                toast.success('Friend request sent successfully!');
                
                // Data already refreshed in sendFriendRequest
            } else {
                toast.error('Failed to send friend request');
            }

        } catch (error: any) {
            console.error('❌ Send friend request error:', error);
            
            if (error.message?.includes('already exists')) {
                setFriendRequestStatus(prev => ({
                    ...prev,
                    [userId]: 'sent'
                }));
                toast.error('Friend request already sent!');
            } else if (error.message?.includes('already friends')) {
                setFriendRequestStatus(prev => ({
                    ...prev,
                    [userId]: 'friends'
                }));
                toast.error('You are already friends!');
            } else {
                toast.error('Failed to send friend request');
            }
            
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleCancelFriendRequest = async (userId: string) => {
        try {
            setProcessingRequests(prev => new Set(prev).add(userId));
            console.log('🚫 Cancelling friend request to:', userId);

            const result = await cancelFriendRequest(userId);
            
            if (result.success) {
                console.log('✅ Friend request cancelled successfully');
                
                setFriendRequestStatus(prev => ({
                    ...prev,
                    [userId]: 'none'
                }));
                
                toast.success('Friend request cancelled!');
                
                // ✅ Refresh data to sync with backend
                refreshRequests();
            } else {
                toast.error('Failed to cancel friend request');
            }

        } catch (error: any) {
            console.error('❌ Cancel error:', error);
            toast.error('Failed to cancel request');
            
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    // Filter users based on selected filters
    const filterUsers = (users: User[]): User[] => {
        if (!filters.nativeLanguage && !filters.learningLanguage && !filters.location) {
            return users;
        }

        return users.filter(user => {
            const matchesNative = !filters.nativeLanguage ||
                user.nativeLanguage.toLowerCase().includes(filters.nativeLanguage.toLowerCase());
            const matchesLearning = !filters.learningLanguage ||
                user.learningLanguage.toLowerCase().includes(filters.learningLanguage.toLowerCase());
            const matchesLocation = !filters.location ||
                user.location?.toLowerCase().includes(filters.location.toLowerCase());

            return matchesNative && matchesLearning && matchesLocation;
        });
    };

    // Get users to display with filtering
    const getUsersToDisplay = (): User[] => {
        const users = isSearching ? searchResults : recommendedUsers;
        return filterUsers(users);
    };

    // Reset all filters
    const clearFilters = () => {
        setFilters({
            nativeLanguage: '',
            learningLanguage: '',
            location: ''
        });
    };

    // Get button configuration based on friend status
    const getButtonConfig = (userId: string) => {
        const status = friendRequestStatus[userId] || 'none';
        const isProcessing = processingRequests.has(userId);

        switch (status) {
            case 'sent':
                return {
                    text: isProcessing ? 'Cancelling...' : 'Request Sent',
                    icon: isProcessing ? Loader2 : Clock,
                    className: 'btn btn-warning text-white',
                    onClick: () => handleCancelFriendRequest(userId),
                    disabled: isProcessing
                };
            case 'received':
                return {
                    text: 'Received Request',
                    icon: UserCheck,
                    className: 'btn btn-success text-white',
                    onClick: () => {
                        // Navigate to friend requests page to handle
                        toast('Check your friend requests to respond');
                        // router.push('/friends/requests'); // if you have this route
                    },
                    disabled: false
                };
            case 'friends':
                return {
                    text: 'Friends',
                    icon: UserCheck,
                    className: 'btn btn-disabled',
                    onClick: () => { },
                    disabled: true
                };
            default:
                return {
                    text: isProcessing ? 'Sending...' : 'Add Friend',
                    icon: isProcessing ? Loader2 : UserPlus,
                    className: 'btn btn-primary text-white',
                    onClick: () => handleSendFriendRequest(userId),
                    disabled: isProcessing
                };
        }
    };

    // Show loading if friends are still loading
    const isDataLoading = isLoading || friendsLoading;

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-primary mb-2">Add Friends</h1>
                <p className="text-lg font-semibold text-base-content/80">
                    {isSearching
                        ? <>Search results for "<strong className="text-primary">{searchQuery}</strong>"</>
                        : 'Discover new language learning partners'
                    }
                    {friends && (
                        <span className="ml-2 text-sm text-base-content/50">
                            ({friends.length} friends)
                        </span>
                    )}
                    {friendRequests && friendRequests.length > 0 && (
                        <span className="ml-2 text-sm text-orange-500">
                            ({friendRequests.length} pending requests)
                        </span>
                    )}
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-3 mb-6">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-base-200 border-2 border-primary/20 rounded-lg 
                                 focus:ring-2 focus:ring-primary focus:border-primary 
                                 transition-all duration-200 ease-in-out
                                 placeholder:text-base-content/50
                                 hover:border-primary/40"
                    />
                    {searchLoading && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
                    )}
                </div>

                {/* Filter Dropdown */}
                <FilterDropdown
                    filters={filters}
                    setFilters={setFilters}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    clearFilters={clearFilters}
                    languages={LANGUAGES}
                />
            </div>

            {/* Users List */}
            <UsersList
                isLoading={isDataLoading}
                users={getUsersToDisplay()}
                isSearching={isSearching}
                searchQuery={searchQuery}
                getButtonConfig={getButtonConfig}
            />
        </div>
    );
};

// Filter Dropdown Component (unchanged)
const FilterDropdown: React.FC<{
    filters: FilterOptions;
    setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    clearFilters: () => void;
    languages: string[];
}> = ({ filters, setFilters, showFilters, setShowFilters, clearFilters, languages }) => {
    const hasActiveFilters = filters.nativeLanguage || filters.learningLanguage || filters.location;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };

        if (showFilters) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showFilters, setShowFilters]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
            >
                <Filter className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                    <span className="bg-primary text-white text-xs rounded-full w-2 h-2"></span>
                )}
            </button>

            <div className={`
                absolute right-0 top-full mt-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10 p-4
                transition-all duration-300 ease-out transform origin-top-right
                ${showFilters ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-base-content">Filters</h3>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-primary hover:text-primary-focus"
                    >
                        Clear all
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Native Language Filter */}
                    <div>
                        <label className="block text-sm font-medium text-base-content/70 mb-2">
                            Native Language
                        </label>
                        <select
                            value={filters.nativeLanguage}
                            onChange={(e) => setFilters(prev => ({ ...prev, nativeLanguage: e.target.value }))}
                            className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All languages</option>
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    {/* Learning Language Filter */}
                    <div>
                        <label className="block text-sm font-medium text-base-content/70 mb-2">
                            Learning Language
                        </label>
                        <select
                            value={filters.learningLanguage}
                            onChange={(e) => setFilters(prev => ({ ...prev, learningLanguage: e.target.value }))}
                            className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All languages</option>
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                        <label className="block text-sm font-medium text-base-content/70 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            placeholder="Enter city or country"
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Users List Component (unchanged)
const UsersList: React.FC<{
    isLoading: boolean;
    users: User[];
    isSearching: boolean;
    searchQuery: string;
    getButtonConfig: (userId: string) => any;
}> = ({ isLoading, users, isSearching, searchQuery, getButtonConfig }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                    <UserCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-base-content/40 mb-4">
                    <Search className="w-12 h-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-base-content mb-2">
                    {isSearching ? 'No search results' : 'No users found'}
                </h3>
                <p className="text-base-content/60">
                    {isSearching
                        ? `No users found for "${searchQuery}". Try adjusting your search or filters.`
                        : 'Try adjusting your filters or check back later'
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <UserCard
                    key={user._id}
                    user={user}
                    buttonConfig={getButtonConfig(user._id)}
                />
            ))}
        </div>
    );
};

// User Card Component (unchanged but handle different field names)
const UserCard: React.FC<{
    user: User;
    buttonConfig: {
        text: string;
        icon: any;
        className: string;
        onClick: () => void;
        disabled: boolean;
    };
}> = ({ user, buttonConfig }) => {
    const IconComponent = buttonConfig.icon;

    return (
        <div className="bg-base-100 border border-base-300 rounded-lg p-6 
                     transition-all duration-300 ease-in-out 
                     hover:shadow-xl hover:border-primary hover:scale-[1.05] hover:bg-base-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <Avatar user={user} size="md" />

                    {/* User Info */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-base-content">
                            {user.fullName || user.username || 'Unknown User'}
                        </h3>

                        {/* Languages */}
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                                <Languages className="w-4 h-4 text-primary" />
                                <span className="text-base-content/60">
                                    Native: <span className="font-medium">{user.nativeLanguage}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Languages className="w-4 h-4 text-accent" />
                                <span className="text-base-content/60">
                                    Learning: <span className="font-medium">{user.learningLanguage}</span>
                                </span>
                            </div>
                        </div>

                        {/* Location */}
                        {user.location && (
                            <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4 text-base-content/40" />
                                <span className="text-base-content/60">{user.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dynamic Button */}
                <button
                    onClick={buttonConfig.onClick}
                    disabled={buttonConfig.disabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonConfig.className}`}
                >
                    <IconComponent className={`w-4 h-4 ${buttonConfig.icon === Loader2 ? 'animate-spin' : ''}`} />
                    {buttonConfig.text}
                </button>
            </div>
        </div>
    );
};

// Skeleton Loading Component (unchanged)
const UserCardSkeleton = () => {
    return (
        <div className="bg-base-100 border border-base-300 rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-base-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-base-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-base-200 rounded w-48 mb-1"></div>
                        <div className="h-3 bg-base-200 rounded w-24"></div>
                    </div>
                </div>
                <div className="w-24 h-10 bg-base-200 rounded-lg"></div>
            </div>
        </div>
    );
};

export default AddFriendsPage;