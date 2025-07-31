'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Filter, SortAsc, RotateCcw, Clock, MessageCircle, MessageSquare, FileText, BookOpen, HelpCircle, Users } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import ForumPostCard from '@/components/forum/ForumPostCard';
import PageLoader from '@/components/ui/PageLoader';
import { forumAPI } from '@/lib/api';
import { ForumPost, ForumFilters } from '@/types/Forum';
import { toast } from 'react-hot-toast';
import { mockForumPosts } from '@/constants/forumMockData';

// ===== FORUM PAGE =====
// Trang chính hiển thị danh sách posts với filters và pagination
const ForumPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;
    
    const currentSort = searchParams.get('sort') || 'latest';
    const currentCategory = searchParams.get('category') || '';

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



    // ===== FETCH POSTS =====
    const fetchPosts = async () => {
        try {
            setLoading(true);
            // ===== MOCK DATA TEST =====
            // Home page: Show posts from user's school/program (personalized feed)
            // For now, filter by first few posts to simulate personalized content
            const personalizedPosts = mockForumPosts.slice(0, 5); // Show first 5 posts as "personalized"
            setPosts(personalizedPosts as ForumPost[]);
            setCurrentPage(1);
            setTotalPages(1);
            setLoading(false);
            return;
            // ===== END MOCK =====
            
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
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Home</h1>
                    <p className="text-gray-400">Posts from your school and program</p>
                </div>

                {/* ===== SORT & FILTER BUTTONS ===== */}
                <div className="space-y-3">
                    {/* Row 1: Sort Buttons */}
                    <div className="flex gap-3">
                        {[
                            { id: 'latest', label: 'Latest', icon: Clock },
                            { id: 'oldest', label: 'Oldest', icon: Clock }
                        ].map((item) => {
                            const handleClick = () => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('sort', item.id);
                                router.push(`/forum?${params.toString()}`);
                            };
                            
                            const isActive = currentSort === item.id;
                            const IconComponent = item.icon;
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={handleClick}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Row 2: Category Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: 'general', label: 'General', icon: MessageCircle },
                            { id: 'question', label: 'Question', icon: HelpCircle },
                            { id: 'discussion', label: 'Discussion', icon: MessageSquare },
                            { id: 'assignment', label: 'Assignment', icon: FileText },
                            { id: 'course-specific', label: 'Course Specific', icon: BookOpen },
                            { id: 'exam', label: 'Exam', icon: HelpCircle },
                            { id: 'career', label: 'Career', icon: Users }
                        ].map((item) => {
                            const handleClick = () => {
                                const params = new URLSearchParams(searchParams.toString());
                                if (currentCategory === item.id) {
                                    params.delete('category');
                                } else {
                                    params.set('category', item.id);
                                }
                                router.push(`/forum?${params.toString()}`);
                            };
                            
                            const isActive = currentCategory === item.id;
                            const IconComponent = item.icon;
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={handleClick}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? 'bg-white text-gray-900 shadow-sm border border-gray-300'
                                            : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
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