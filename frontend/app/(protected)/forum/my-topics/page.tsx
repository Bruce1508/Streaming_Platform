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

// ===== MY TOPICS PAGE =====
// Trang hiển thị posts của user hiện tại
const MyTopicsPage = () => {
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

    // ===== FETCH POSTS =====
    const fetchPosts = async () => {
        try {
            setLoading(true);
            
            if (!currentUserId) {
                console.log('❌ No current user ID found in session');
                console.log('Session data:', session);
                setPosts([]);
                setLoading(false);
                return;
            }
            
            console.log('👤 Current user ID:', currentUserId);
            
            const queryParams: any = {
                sort: searchParams.get('sort') || 'latest',
                page: currentPage,
                limit: 10
            };

            // Only add parameters if they have actual values
            const category = searchParams.get('category');
            const search = searchParams.get('search');
            const tag = searchParams.get('tag');
            
            if (category) queryParams.category = category;
            if (search && search.trim()) queryParams.search = search.trim();
            if (tag) queryParams.tag = tag;

            console.log('🔄 Fetching my topics with params:', queryParams);
            
            const response = await forumAPI.getPosts(queryParams, '/my-topics');
            
            console.log('📨 My Topics API Response:', response);
            
            // Check if response exists and has the expected structure
            if (response && response.posts) {
                setPosts(response.posts);
                setCurrentPage(response.pagination?.currentPage || 1);
                setTotalPages(response.pagination?.totalPages || 1);
                console.log('✅ My topics loaded:', response.posts.length);
            } else if (response && response.success !== false) {
                // Handle case where response structure might be different
                setPosts(response.data?.posts || []);
                setCurrentPage(response.data?.pagination?.currentPage || 1);
                setTotalPages(response.data?.pagination?.totalPages || 1);
                console.log('✅ My topics loaded (alt structure):', response.data?.posts?.length || 0);
            } else {
                console.error('❌ API Error:', response);
                setPosts([]);
                toast.error(response?.message || 'Failed to load your topics');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    // ===== EFFECTS =====
    useEffect(() => {
        fetchPosts();
    }, [currentPage, currentSort, currentCategory, filters]);

    // ===== HANDLERS =====
    const handleFilterChange = (newFilters: Partial<ForumFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };

    const handleVoteUpdate = (postId: string, newVoteData: any) => {
        setPosts(prev => prev.map(post => 
            post._id === postId 
                ? { ...post, voteCount: newVoteData.voteCount }
                : post
        ));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <ForumLayout>
            <div className="space-y-6">
                {/* ===== PAGE HEADER ===== */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">My Topics</h1>
                    <p className="text-gray-400">Posts you've created</p>
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
                                router.push(`/forum/my-topics?${params.toString()}`);
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
                                router.push(`/forum/my-topics?${params.toString()}`);
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
                                <div className="text-gray-400 text-6xl mb-4">📝</div>
                                <h3 className="text-lg font-medium text-white mb-2">No posts yet</h3>
                                <p className="text-gray-400 mb-4">
                                    You haven't created any posts yet. Start sharing your thoughts!
                                </p>
                                <button 
                                    onClick={() => router.push('/forum/create')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Create Your First Post
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
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-gray-300">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </ForumLayout>
    );
};

export default MyTopicsPage; 