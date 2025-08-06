'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Filter, SortAsc, RotateCcw, Clock, MessageCircle, MessageSquare, FileText, BookOpen, HelpCircle, Users, ChevronDown } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import ForumPostCard from '@/components/forum/ForumPostCard';
import PageLoader from '@/components/ui/PageLoader';
import { forumAPI, authAPI } from '@/lib/api';
import { ForumPost, ForumFilters } from '@/types/Forum';
import { toast } from 'react-hot-toast';
import { mockForumPosts } from '@/constants/forumMockData';
import Footer from '@/components/Footer';
import { voteStateManager } from '@/lib/voteStateManager';

// ===== FORUM PAGE =====
// Trang chính hiển thị danh sách posts với filters và pagination
const ForumPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [currentUserId, setCurrentUserId] = useState<string | undefined>(session?.user?.id);
    
    const currentSort = searchParams.get('sort') || 'latest';
    const currentCategory = searchParams.get('category') || '';

    // ===== STATES =====
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<ForumFilters>({
        category: undefined,
        sort: 'latest',
        search: ''
    });
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.dropdown-container')) {
                setShowSortDropdown(false);
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ===== SORT OPTIONS =====
    const sortOptions = [
        { value: 'latest', label: 'Latest', icon: '🕐' },
        { value: 'popular', label: 'Most Popular', icon: '👁️' },
        { value: 'trending', label: 'Trending', icon: '🔥' },
        { value: 'votes', label: 'Most Voted', icon: '⬆️' }
    ];



    // ===== FETCH POSTS =====
    const fetchPosts = async (isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setIsLoadingMore(true);
            } else {
                setLoading(true);
                setPosts([]);
                setCurrentPage(1);
                setHasMore(true);
            }
            
            const pageToFetch = isLoadMore ? currentPage + 1 : 1;
            
            const queryParams: any = {
                sort: searchParams.get('sort') || 'latest',
                page: pageToFetch,
                limit: 10
            };

            // Only add parameters if they have actual values
            const category = searchParams.get('category');
            const search = searchParams.get('search');
            const tag = searchParams.get('tag');
            
            if (category) queryParams.category = category;
            if (search && search.trim()) queryParams.search = search.trim();
            if (tag) queryParams.tag = tag;

            console.log('🔄 Fetching posts with params:', queryParams);
            
            const response = await forumAPI.getPosts(queryParams);
            
            console.log('📨 API Response:', response);
            
            // Check if response exists and has the expected structure
            if (response && response.posts) {
                const newPosts = response.posts;
                
                if (isLoadMore) {
                    setPosts(prev => [...prev, ...newPosts]);
                    setCurrentPage(pageToFetch);
                } else {
                    setPosts(newPosts);
                    setCurrentPage(1);
                }
                
                setHasMore(response.pagination?.hasNext || false);
                console.log('✅ Posts loaded:', newPosts.length);
            } else if (response && response.success !== false) {
                // Handle case where response structure might be different
                const newPosts = response.data?.posts || [];
                
                if (isLoadMore) {
                    setPosts(prev => [...prev, ...newPosts]);
                    setCurrentPage(pageToFetch);
                } else {
                    setPosts(newPosts);
                    setCurrentPage(1);
                }
                
                setHasMore(response.data?.pagination?.hasNext || false);
                console.log('✅ Posts loaded (alt structure):', newPosts.length);
            } else {
                console.error('❌ API Error:', response);
                if (!isLoadMore) setPosts([]);
                toast.error(response?.message || 'Failed to load posts');
            }
        } catch (error: any) {
            console.error('❌ Fetch posts error:', error);
            if (!isLoadMore) setPosts([]);
            toast.error('Failed to load posts from server');
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    // ===== INTERSECTION OBSERVER FOR INFINITE SCROLL =====
    const observerRef = useRef<IntersectionObserver>();
    const lastPostRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingMore) return;
        
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                console.log('🔄 Loading more posts...');
                fetchPosts(true);
            }
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });
        
        if (node) observerRef.current.observe(node);
    }, [isLoadingMore, hasMore]);

    // ===== EFFECTS =====
    
    // Get MongoDB user ID from API
    useEffect(() => {
        console.log('🔍 Forum list useEffect triggered, session?.user?.id:', session?.user?.id);
        
        const fetchUserProfile = async () => {
            if (session?.user?.id) {
                console.log('🔍 Forum list - Fetching user profile...');
                try {
                    const response = await authAPI.getMe();
                    console.log('🔍 Forum list - getMe response:', response);
                    if (response.data?.user?._id) {
                        setCurrentUserId(response.data.user._id);
                        console.log('🔍 Forum list - MongoDB user ID set to:', response.data.user._id);
                    } else {
                        console.log('🔍 Forum list - No _id in response data.user');
                        console.log('🔍 Forum list - Response data structure:', response.data);
                    }
                } catch (error) {
                    console.error('Forum list - Failed to fetch user profile:', error);
                }
            } else {
                console.log('🔍 Forum list - No session?.user?.id available');
            }
        };
        
        fetchUserProfile();
    }, [session?.user?.id]);

    useEffect(() => {
        fetchPosts();
    }, [searchParams]);

    // ===== FILTER HANDLERS =====
    const handleSortChange = (sortType: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', sortType);
        router.push(`/forum?${params.toString()}`);
    };

    const handleCategoryFilter = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (searchParams.get('category') === category) {
            params.delete('category'); // Remove filter if same category clicked
        } else {
            params.set('category', category);
        }
        router.push(`/forum?${params.toString()}`);
    };

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
        console.log('🔄 Forum list - handleVoteUpdate called:', { postId, newVoteData });
        
        // ===== CẬP NHẬT LOCAL STATE =====
        setPosts(prev => {
            const updatedPosts = prev.map(post => 
                post._id === postId 
                    ? { ...post, voteCount: newVoteData.voteCount }
                    : post
            );
            
            console.log('📊 Forum list - Posts updated:', {
                originalPost: prev.find(p => p._id === postId)?.voteCount,
                newVoteCount: newVoteData.voteCount,
                totalPosts: updatedPosts.length
            });
            
            return updatedPosts;
        });
    
        // ===== CẬP NHẬT VOTE STATE MANAGER =====
        console.log('🎯 Forum list - Updating VoteStateManager...');
        voteStateManager.updateVoteState(
            postId,
            newVoteData.voteCount,
            newVoteData.upvotes || [],
            newVoteData.downvotes || []
        );
        console.log('✅ Forum list - VoteStateManager updated successfully');
    };



    return (
        <>
            <ForumLayout showRightSidebar={false}>
                <div className="space-y-4">
                    {/* ===== DROPDOWN BUTTONS ===== */}
                    <div className="flex gap-3">
                        {/* Sort Dropdown */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                            >
                                <Clock className="w-4 h-4" />
                                <span>{currentSort === 'latest' ? 'Latest' : 'Oldest'}</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>

                            {/* Sort Dropdown Menu */}
                            {showSortDropdown && (
                                <div className="absolute top-10 left-0 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="py-1">
                                        <div className="px-3 py-2 border-b border-gray-100">
                                            <span className="text-sm font-medium text-gray-900">Sort by</span>
                                        </div>
                                        {[
                                            { id: 'latest', label: 'Latest', icon: Clock },
                                            { id: 'oldest', label: 'Oldest', icon: Clock }
                                        ].map((item) => {
                                            const handleClick = () => {
                                                const params = new URLSearchParams(searchParams.toString());
                                                params.set('sort', item.id);
                                                router.push(`/forum?${params.toString()}`);
                                                setShowSortDropdown(false);
                                            };
                                            
                                            const isActive = currentSort === item.id;
                                            const IconComponent = item.icon;
                                            
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={handleClick}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                                                        isActive ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                                    }`}
                                                >
                                                    <IconComponent className="w-4 h-4" />
                                                    <span>{item.label}</span>
                                                    {isActive && (
                                                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                            >
                                <Filter className="w-4 h-4" />
                                <span>{currentCategory || 'All'}</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>

                            {/* Category Dropdown Menu */}
                            {showCategoryDropdown && (
                                <div className="absolute top-10 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="py-1">
                                        <div className="px-3 py-2 border-b border-gray-100">
                                            <span className="text-sm font-medium text-gray-900">Categories</span>
                                        </div>
                                        {[
                                            { id: 'all', label: 'All', icon: Filter },
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
                                                if (item.id === 'all' || currentCategory === item.id) {
                                                    params.delete('category');
                                                } else {
                                                    params.set('category', item.id);
                                                }
                                                router.push(`/forum?${params.toString()}`);
                                                setShowCategoryDropdown(false);
                                            };
                                            
                                            const isActive = item.id === 'all' ? !currentCategory : currentCategory === item.id;
                                            const IconComponent = item.icon;
                                            
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={handleClick}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                                                        isActive ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                                    }`}
                                                >
                                                    <IconComponent className="w-4 h-4" />
                                                    <span>{item.label}</span>
                                                    {isActive && (
                                                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ===== POSTS LIST ===== */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <PageLoader />
                        </div>
                    ) : (
                        <div className="bg-white">
                            {posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <div 
                                        key={post._id}
                                        ref={index === posts.length - 1 ? lastPostRef : null}
                                    >
                                        <ForumPostCard
                                            post={post}
                                            currentUserId={currentUserId}
                                            onVoteUpdate={handleVoteUpdate}
                                        />
                                    </div>
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

                    {/* ===== INFINITE SCROLL LOADING ===== */}
                    {isLoadingMore && (
                        <div className="flex justify-center py-8">
                            <PageLoader />
                        </div>
                    )}

                </div>
            </ForumLayout>
            
            {/* ===== FOOTER (OUTSIDE LAYOUT) ===== */}
            <Footer />
        </>
    );
};

export default ForumPage; 