'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Filter, SortAsc, RotateCcw } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import ForumPostCard from '@/components/forum/ForumPostCard';
import PageLoader from '@/components/ui/PageLoader';
import { forumAPI } from '@/lib/api';
import { ForumPost, ForumFilters } from '@/types/Forum';
import { toast } from 'react-hot-toast';

// ===== FORUM PAGE =====
// Trang chính hiển thị danh sách posts với filters và pagination
const ForumPage = () => {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    // ===== STATES =====
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<ForumFilters>({
        category: undefined,
        sort: 'latest',
        search: ''
    });

    // ===== SORT OPTIONS =====
    const sortOptions = [
        { value: 'latest', label: 'Latest', icon: '🕐' },
        { value: 'popular', label: 'Most Popular', icon: '👁️' },
        { value: 'trending', label: 'Trending', icon: '🔥' },
        { value: 'votes', label: 'Most Voted', icon: '⬆️' }
    ];

    // ===== CATEGORY OPTIONS =====
    const categoryOptions = [
        { value: '', label: 'All Categories' },
        { value: 'general', label: 'General' },
        { value: 'question', label: 'Questions' },
        { value: 'discussion', label: 'Discussions' },
        { value: 'course-specific', label: 'Course Specific' },
        { value: 'assignment', label: 'Assignments' },
        { value: 'exam', label: 'Exams' },
        { value: 'career', label: 'Career' }
    ];

    // ===== FETCH POSTS =====
    const fetchPosts = async () => {
        try {
            setLoading(true);
            
            const queryParams = {
                ...filters,
                category: searchParams.get('category') || filters.category,
                search: searchParams.get('search') || filters.search,
                tag: searchParams.get('tag') || undefined
            };

            console.log('🔄 Fetching posts with params:', queryParams);
            
            const response = await forumAPI.getPosts(queryParams);
            
            console.log('📨 API Response:', response);
            console.log('📊 Response data:', response.data);
            
            // Check if response exists and has data
            if (response && response.data) {
                // Check if response has success flag and valid data structure
                const isSuccess = response.success === true || response.statusCode === 200;
                
                if (isSuccess && response.data.posts) {
                    const postsData = response.data.posts;
                    const paginationData = response.data.pagination || {};
                    
                    setPosts(postsData);
                    setCurrentPage(paginationData.currentPage || 1);
                    setTotalPages(paginationData.totalPages || 1);
                    
                    console.log('✅ Posts loaded:', postsData.length);
                } else {
                    console.error('❌ API Error - Invalid posts data:', response.data);
                    setPosts([]);
                    toast.error('Failed to load posts - invalid response data');
                }
            } else {
                console.error('❌ API Error - No response data');
                setPosts([]);
                toast.error('Failed to load posts - no response data');
            }
        } catch (error: any) {
            console.error('❌ Fetch posts error:', error);
            setPosts([]);
            toast.error('Failed to load posts from server');
        } finally {
            setLoading(false);
        }
    };

    // ===== EFFECTS =====
    useEffect(() => {
        fetchPosts();
    }, [filters, searchParams]);

    // ===== HANDLE FILTER CHANGE =====
    const handleFilterChange = (newFilters: Partial<ForumFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset về trang 1 khi filter thay đổi
        }));
    };

    // ===== HANDLE VOTE UPDATE =====
    const handleVoteUpdate = (postId: string, newVoteData: any) => {
        setPosts(prev => prev.map(post => 
            post._id === postId 
                ? { ...post, voteCount: newVoteData.voteCount }
                : post
        ));
    };

    // ===== HANDLE PAGINATION =====
    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <ForumLayout>
            <div className="space-y-6">
                {/* ===== PAGE HEADER ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Community Forum
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Ask questions, share knowledge, and connect with fellow students
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📝 {posts.length} posts</span>
                        <span>👥 1.2k members</span>
                        <span>🔥 89 active today</span>
                    </div>
                </div>

                {/* ===== FILTERS & SORTING ===== */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <SortAsc className="w-5 h-5 text-gray-400" />
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange({ sort: e.target.value as any })}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.icon} {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleFilterChange({ category: e.target.value as any })}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Filters */}
                        <button
                            onClick={() => handleFilterChange({ 
                                category: undefined, 
                                search: undefined, 
                                sort: 'latest' 
                            })}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                    </div>
                </div>

                {/* ===== POSTS LIST ===== */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <PageLoader />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <ForumPostCard
                                    key={post._id}
                                    post={post}
                                    currentUserId={currentUserId}
                                    onVoteUpdate={handleVoteUpdate}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📭</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                                <p className="text-gray-600 mb-4">
                                    Be the first to start a discussion in this category!
                                </p>
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                                    Create First Post
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== PAGINATION ===== */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 py-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        currentPage === pageNum
                                            ? 'bg-indigo-600 text-white'
                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </ForumLayout>
    );
};

export default ForumPage; 