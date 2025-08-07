'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ForumPost } from '@/types/Forum';
import { forumAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { ForumPostCard } from '@/components/forum/ForumPostCard';
import PageLoader from '@/components/ui/PageLoader';
import { Bookmark, Heart, Search } from 'lucide-react';

interface SavedPostsResponse {
    posts: ForumPost[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalPosts: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export default function SavedPostsPage() {
    const { data: session } = useSession();
    const [savedPosts, setSavedPosts] = useState<ForumPost[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasNext: false,
        hasPrev: false
    });
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch saved posts
    const fetchSavedPosts = async (page = 1, append = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await forumAPI.getSavedPosts(page, 10);
            
            if (response.data.success) {
                const data: SavedPostsResponse = response.data.data;
                
                if (append) {
                    setSavedPosts(prev => [...prev, ...data.posts]);
                } else {
                    setSavedPosts(data.posts);
                }
                
                setPagination(data.pagination);
            } else {
                throw new Error(response.data.message || 'Failed to fetch saved posts');
            }
        } catch (error: any) {
            console.error('❌ Error fetching saved posts:', error);
            
            if (error.response?.status === 401) {
                toast.error('Please login to view saved posts');
            } else if (error.response?.status === 429) {
                toast.error('Too many requests. Please wait a moment.');
            } else {
                toast.error('Failed to load saved posts');
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Load saved posts on component mount
    useEffect(() => {
        if (session?.user) {
            fetchSavedPosts(1);
        }
    }, [session]);

    // Handle load more
    const handleLoadMore = () => {
        if (pagination.hasNext && !loadingMore) {
            fetchSavedPosts(pagination.currentPage + 1, true);
        }
    };

    // Handle vote update callback
    const handleVoteUpdate = (postId: string, newVoteData: any) => {
        setSavedPosts(prev => 
            prev.map(post => 
                post._id === postId 
                    ? { ...post, ...newVoteData }
                    : post
            )
        );
    };

    // Handle post save/unsave
    const handlePostUnsaved = (postId: string) => {
        setSavedPosts(prev => prev.filter(post => post._id !== postId));
        setPagination(prev => ({
            ...prev,
            totalPosts: prev.totalPosts - 1
        }));
        toast.success('Post removed from saved list');
    };

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bookmark className="w-5 h-5 text-blue-600 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Saved Posts</h1>
                            <p className="text-gray-600">
                                {pagination.totalPosts} post{pagination.totalPosts !== 1 ? 's' : ''} saved
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {savedPosts.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No saved posts yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Start exploring the forum and save interesting posts to read them later.
                        </p>
                        <a 
                            href="/forum"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Explore Forum
                        </a>
                    </div>
                ) : (
                    /* Posts List */
                    <div className="space-y-1">
                        {savedPosts.map((post) => (
                            <ForumPostCard
                                key={post._id}
                                post={post}
                                currentUserId={session?.user?.id}
                                onVoteUpdate={handleVoteUpdate}
                                className="rounded-lg shadow-sm"
                            />
                        ))}

                        {/* Load More Button */}
                        {pagination.hasNext && (
                            <div className="text-center py-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingMore ? 'Loading...' : 'Load More Posts'}
                                </button>
                            </div>
                        )}

                        {/* Pagination Info */}
                        {savedPosts.length > 0 && (
                            <div className="text-center text-gray-600 py-4">
                                Showing {savedPosts.length} of {pagination.totalPosts} saved posts
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}