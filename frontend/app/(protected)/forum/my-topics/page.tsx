'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Filter, SortAsc, RotateCcw, Clock, MessageCircle, MessageSquare, FileText, BookOpen, HelpCircle, Users } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import ForumPostCard from '@/components/forum/ForumPostCard';
import PageLoader from '@/components/ui/PageLoader';
import { forumAPI } from '@/lib/api';
import { ForumPost, ForumFilters } from '@/types/Forum';
import { toast } from 'react-hot-toast';
import Footer from '@/components/Footer';

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
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

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

            console.log('🔄 Fetching my topics with params:', queryParams);
            
            const response = await forumAPI.getPosts(queryParams, '/my-topics');
            
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
                console.log('✅ My topics loaded:', newPosts.length);
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
                console.log('✅ My topics loaded (alt structure):', newPosts.length);
            } else {
                console.error('❌ API Error:', response);
                if (!isLoadMore) setPosts([]);
                toast.error(response?.message || 'Failed to load posts');
            }
        } catch (error: any) {
            console.error('❌ Fetch my topics error:', error);
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
                console.log('🔄 Loading more my topics...');
                fetchPosts(true);
            }
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });
        
        if (node) observerRef.current.observe(node);
    }, [isLoadingMore, hasMore]);

    // ===== EFFECTS =====
    useEffect(() => {
        fetchPosts();
    }, [searchParams]);

    // ===== HANDLE VOTE UPDATE =====
    const handleVoteUpdate = (postId: string, newVoteData: any) => {
        setPosts(prev => prev.map(post => 
            post._id === postId 
                ? { ...post, voteCount: newVoteData.voteCount }
                : post
        ));
    };

    return (
        <>
            <ForumLayout showRightSidebar={false}>
                <div className="space-y-6">
                    {/* ===== PAGE HEADER ===== */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Topics</h1>
                        <p className="text-gray-600">Posts and discussions you've created</p>
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
                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 shadow-md ${
                                            isActive
                                                ? 'bg-gray-900 text-white shadow-lg'
                                                : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-900 hover:text-white hover:shadow-lg'
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
                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 shadow-md ${
                                            isActive
                                                ? 'bg-gray-900 text-white shadow-lg'
                                                : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-900 hover:text-white hover:shadow-lg'
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
                                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                                    <p className="text-gray-600 mb-4">
                                        You haven't created any posts yet. Start sharing your thoughts!
                                    </p>
                                    <button 
                                        onClick={() => router.push('/forum/create')}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                    >
                                        Create Your First Post
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

export default MyTopicsPage;