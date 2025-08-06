'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Eye, Clock, Tag, Flag, Bookmark, ChevronDown, Trophy, TrendingUp, Star, Zap, Calendar, Mic } from 'lucide-react';
import { TbShare3 } from "react-icons/tb";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import ForumLayout from '@/components/forum/ForumLayout';
import ForumCommentThread from '@/components/forum/ForumCommentThread';
import PageLoader from '@/components/ui/PageLoader';
import { forumAPI, authAPI } from '@/lib/api';
import { ForumPost, ForumComment } from '@/types/Forum';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { voteStateManager } from '@/lib/voteStateManager';

// ===== FORUM POST DETAIL PAGE =====
// Trang chi tiết post với comment system giống Reddit
const ForumPostDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const postId = params.id as string;
    const [currentUserId, setCurrentUserId] = useState<string | undefined>(session?.user?.id);
    
    // Debug session structure
    console.log('🔍 Full session:', session);
    console.log('🔍 Session user:', session?.user);
    console.log('🔍 Current user ID:', currentUserId);
    console.log('🔍 Session user keys:', Object.keys(session?.user || {}));
    

    


    // ===== STATES =====
    const [post, setPost] = useState<ForumPost | null>(null);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [replyToComment, setReplyToComment] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [sortBy, setSortBy] = useState('best');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [localUpvotes, setLocalUpvotes] = useState<string[]>([]);
    const [localDownvotes, setLocalDownvotes] = useState<string[]>([]);
    const [isVoting, setIsVoting] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // ===== FETCH POST & COMMENTS =====
    const fetchPostDetail = async () => {
        try {
            setLoading(true);
            
            console.log('🔄 Fetching post detail:', postId);
            
            const response = await forumAPI.getPost(postId);
            
            console.log('📨 API Response:', response);
            console.log('📊 Response data:', response.data);
            
            if (response && response.data) {
                // Check if response has success flag and valid data structure
                const isSuccess = response.success === true || response.statusCode === 200;
                
                if (isSuccess && response.data.post) {
                    const postData = response.data.post;
                    const commentsData = response.data.comments || [];
                    
                    setPost(postData);
                    setComments(commentsData);
                    
                    console.log('✅ Post detail loaded:', postData.title);
                    console.log('📝 Comments data:', commentsData);
                    console.log('📊 Comments length:', commentsData.length);
                } else {
                    console.error('❌ API Error - Invalid post data:', response.data);
                    setPost(null);
                    setComments([]);
                    toast.error('Failed to load post - invalid response data');
                }
            } else {
                console.error('❌ API Error - No response data');
                setPost(null);
                setComments([]);
                toast.error('Failed to load post - no response data');
            }
        } catch (error: any) {
            console.error('❌ Fetch post detail error:', error);
            setPost(null);
            setComments([]);
            toast.error('Failed to load post from server');
        } finally {
            setLoading(false);
        }
    };

    // ===== EFFECTS =====
    useEffect(() => {
        if (postId) {
            fetchPostDetail();
        }
    }, [postId]);

    // Get MongoDB user ID from API
    useEffect(() => {
        console.log('🔍 useEffect triggered, session?.user?.id:', session?.user?.id);
        
        const fetchUserProfile = async () => {
            if (session?.user?.id) {
                console.log('🔍 Fetching user profile...');
                try {
                    const response = await authAPI.getMe();
                    console.log('🔍 getMe response:', response);
                    if (response.data?.user?._id) {
                        setCurrentUserId(response.data.user._id);
                        console.log('🔍 MongoDB user ID set to:', response.data.user._id);
                    } else {
                        console.log('🔍 No _id in response data.user');
                        console.log('🔍 Response data structure:', response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                }
            } else {
                console.log('🔍 No session?.user?.id available');
            }
        };
        
        fetchUserProfile();
    }, [session?.user?.id]);

    // ===== VOTE STATE MANAGER SUBSCRIPTION =====
    useEffect(() => {
        if (!postId) {
            console.log('🚫 Forum Detail - No postId for VoteStateManager subscription');
            return;
        }

        console.log('👂 Forum Detail - Subscribing to VoteStateManager for postId:', postId);
        
        // Subscribe để lắng nghe thay đổi vote từ Forum List hoặc components khác
        const unsubscribe = voteStateManager.subscribe(postId, (state) => {
            console.log('📢 Forum Detail - Received vote state update:', { 
                postId, 
                newVoteCount: state.voteCount,
                newUpvotes: state.upvotes?.length || 0,
                newDownvotes: state.downvotes?.length || 0
            });

            // 🔄 CẬP NHẬT POST STATE VỚI DATA MỚI
            if (post && post._id === postId) {
                console.log('🔄 Forum Detail - Updating post voteCount from', post.voteCount, 'to', state.voteCount);
                setPost(prev => prev ? { 
                    ...prev, 
                    voteCount: state.voteCount,
                    upvotes: state.upvotes || [],
                    downvotes: state.downvotes || []
                } : null);
                
                // 🔄 CẬP NHẬT LOCAL VOTE STATES
                setLocalUpvotes(state.upvotes || []);
                setLocalDownvotes(state.downvotes || []);
                
                console.log('✅ Forum Detail - Post state updated from VoteStateManager');
            }
        });

        // 🔍 KIỂM TRA VÀ LOAD STATE BAN ĐẦU TỪ VOTE STATE MANAGER
        const existingState = voteStateManager.getVoteState(postId);
        if (existingState && post) {
            console.log('📱 Forum Detail - Loading existing state from VoteStateManager:', existingState);
            setPost(prev => prev ? { 
                ...prev, 
                voteCount: existingState.voteCount,
                upvotes: existingState.upvotes || [],
                downvotes: existingState.downvotes || []
            } : null);
            setLocalUpvotes(existingState.upvotes || []);
            setLocalDownvotes(existingState.downvotes || []);
        }

        // Cleanup subscription khi component unmount hoặc postId thay đổi
        return () => {
            console.log('🧹 Forum Detail - Unsubscribing from VoteStateManager for postId:', postId);
            unsubscribe();
        };
    }, [postId, post]);

    // Initialize local vote states when post loads
    useEffect(() => {
        if (post) {
            // Get user vote status from localStorage if available
            const storedVoteState = localStorage.getItem(`vote_${post._id}`);
            if (storedVoteState && currentUserId) {
                try {
                    const voteState = JSON.parse(storedVoteState);
                    if (voteState.userId === currentUserId) {
                        console.log('📱 Loading user vote status from localStorage:', voteState);
                        setLocalUpvotes(voteState.upvotes || []);
                        setLocalDownvotes(voteState.downvotes || []);
                        return;
                    }
                } catch (error) {
                    console.error('❌ Error parsing stored vote state:', error);
                }
            }
            
            // Fallback to server data
            setLocalUpvotes(post.upvotes || []);
            setLocalDownvotes(post.downvotes || []);
        }
    }, [post, currentUserId]);

    // Click outside to close sort dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ===== HELPER FUNCTIONS =====
    const formatTimeAgo = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'unknown';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'question': 'bg-blue-100 text-blue-800',
            'discussion': 'bg-green-100 text-green-800',
            'general': 'bg-gray-100 text-gray-800',
            'course-specific': 'bg-purple-100 text-purple-800',
            'assignment': 'bg-orange-100 text-orange-800',
            'exam': 'bg-red-100 text-red-800',
            'career': 'bg-indigo-100 text-indigo-800'
        };
        return colors[category] || colors['general'];
    };

    // ===== HANDLE ACTIONS =====
    const handleVoteUpdate = (newVoteData: any) => {
        console.log('🔄 Forum Detail - handleVoteUpdate called:', { postId, newVoteData });
        
        if (post) {
            // 🔄 CẬP NHẬT LOCAL POST STATE
            setPost(prev => prev ? { 
                ...prev, 
                voteCount: newVoteData.voteCount,
                upvotes: newVoteData.upvotes || [],
                downvotes: newVoteData.downvotes || []
            } : null);
            
            // 🎯 CẬP NHẬT VOTE STATE MANAGER (để đồng bộ với Forum List)
            console.log('🎯 Forum Detail - Updating VoteStateManager...');
            voteStateManager.updateVoteState(
                post._id,
                newVoteData.voteCount,
                newVoteData.upvotes || [],
                newVoteData.downvotes || []
            );
            console.log('✅ Forum Detail - VoteStateManager updated successfully');
        }
    };

    const handleUpvote = async () => {
        if (!currentUserId || !post || isVoting) {
            console.log('🚫 Cannot upvote:', { currentUserId, hasPost: !!post, isVoting });
            return;
        }
        
        console.log('🔄 Starting upvote:', { 
            postId: post._id, 
            currentUserId, 
            currentUpvotes: localUpvotes.length,
            currentDownvotes: localDownvotes.length,
            hasAlreadyUpvoted: localUpvotes.includes(currentUserId)
        });
        
        setIsVoting(true);
        
        try {
            const response = await forumAPI.votePost(post._id, 'up');
            
            console.log('📥 Upvote response received:', response);
            
            if (response.success) {
                const { upvotes, downvotes, voteCount } = response.data;
                
                console.log('📊 Updating state with:', { 
                    upvotes: upvotes?.length || 0, 
                    downvotes: downvotes?.length || 0, 
                    voteCount 
                });
                
                // Update local vote arrays
                setLocalUpvotes(upvotes || []);
                setLocalDownvotes(downvotes || []);
                
                // Update post vote count
                setPost(prev => prev ? { ...prev, voteCount } : null);
                
                // Save user vote status to localStorage
                saveUserVoteStatus(upvotes || [], downvotes || []);
                
                console.log('✅ Upvote successful:', { 
                    newUpvotes: upvotes?.length || 0, 
                    newDownvotes: downvotes?.length || 0, 
                    newVoteCount: voteCount 
                });
            } else {
                console.error('❌ API response not successful:', response);
            }
        } catch (error: any) {
            console.error('❌ Upvote failed:', error);
            console.error('❌ Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to vote. Please try again.');
        } finally {
            setIsVoting(false);
        }
    };

    const handleDownvote = async () => {
        if (!currentUserId || !post || isVoting) {
            console.log('🚫 Cannot downvote:', { currentUserId, hasPost: !!post, isVoting });
            return;
        }
        
        console.log('🔄 Starting downvote:', { 
            postId: post._id, 
            currentUserId, 
            currentUpvotes: localUpvotes.length,
            currentDownvotes: localDownvotes.length,
            hasAlreadyDownvoted: localDownvotes.includes(currentUserId)
        });
        
        setIsVoting(true);
        
        try {
            const response = await forumAPI.votePost(post._id, 'down');
            
            console.log('📥 Downvote response received:', response);
            
            if (response.success) {
                const { upvotes, downvotes, voteCount } = response.data;
                
                console.log('📊 Updating state with:', { 
                    upvotes: upvotes?.length || 0, 
                    downvotes: downvotes?.length || 0, 
                    voteCount 
                });
                
                // Update local vote arrays
                setLocalUpvotes(upvotes || []);
                setLocalDownvotes(downvotes || []);
                
                // Update post vote count
                setPost(prev => prev ? { ...prev, voteCount } : null);
                
                // Save user vote status to localStorage
                saveUserVoteStatus(upvotes || [], downvotes || []);
                
                console.log('✅ Downvote successful:', { 
                    newUpvotes: upvotes?.length || 0, 
                    newDownvotes: downvotes?.length || 0, 
                    newVoteCount: voteCount 
                });
            } else {
                console.error('❌ API response not successful:', response);
            }
        } catch (error: any) {
            console.error('❌ Downvote failed:', error);
            console.error('❌ Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to vote. Please try again.');
        } finally {
            setIsVoting(false);
        }
    };

    // Helper function to save user vote status to localStorage
    const saveUserVoteStatus = (upvotes: string[], downvotes: string[]) => {
        if (currentUserId && post) {
            const voteState = {
                userId: currentUserId,
                upvotes: upvotes || [],
                downvotes: downvotes || [],
                timestamp: Date.now()
            };
            localStorage.setItem(`vote_${post._id}`, JSON.stringify(voteState));
            console.log('💾 Saved user vote status to localStorage:', voteState);
        }
    };

    const hasUpvoted = currentUserId ? localUpvotes.includes(currentUserId) : false;
    const hasDownvoted = currentUserId ? localDownvotes.includes(currentUserId) : false;

    const handleCommentVoteUpdate = (commentId: string, newVoteData: any) => {
        setComments(prev => prev.map(comment => 
            comment._id === commentId 
                ? { ...comment, voteCount: newVoteData.voteCount }
                : comment
        ));
    };

    const handleReply = (parentCommentId: string) => {
        setReplyToComment(parentCommentId);
        setShowCommentForm(true);
        // Scroll to comment form
        setTimeout(() => {
            document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleAcceptAnswer = async (commentId: string) => {
        try {
            await forumAPI.acceptAnswer(commentId);
            
            // Update local state
            setComments(prev => prev.map(comment => 
                comment._id === commentId 
                    ? { ...comment, isAcceptedAnswer: true }
                    : { ...comment, isAcceptedAnswer: false } // Unaccept others
            ));
            
            toast.success('Answer accepted successfully!');
        } catch (error: any) {
            console.error('Accept answer error:', error);
            toast.error(error.response?.data?.message || 'Failed to accept answer');
        }
    };

    const handleEditComment = async (commentId: string, newContent: string) => {
        try {
            const response = await forumAPI.updateComment(commentId, { content: newContent });
            
            // Update local state
            setComments(prev => prev.map(comment => 
                comment._id === commentId 
                    ? { ...comment, content: newContent, updatedAt: new Date().toISOString() }
                    : comment
            ));
            
            toast.success('Comment updated successfully!');
        } catch (error: any) {
            console.error('Edit comment error:', error);
            toast.error(error.response?.data?.message || 'Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await forumAPI.deleteComment(commentId);
            
            // Remove comment from local state
            setComments(prev => prev.filter(comment => comment._id !== commentId));
            
            // Update post comment count
            if (post) {
                setPost(prev => prev ? { ...prev, commentCount: prev.commentCount - 1 } : null);
            }
            
            toast.success('Comment deleted successfully!');
        } catch (error: any) {
            console.error('Delete comment error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete comment');
        }
    };

    // ===== SORT OPTIONS =====
    const sortOptions = [
        { value: 'best', label: 'Best', icon: Trophy, color: 'text-yellow-600' },
        { value: 'top', label: 'Top', icon: TrendingUp, color: 'text-gray-600' },
        { value: 'new', label: 'New', icon: Star, color: 'text-blue-600' },
        { value: 'controversial', label: 'Controversial', icon: Zap, color: 'text-yellow-600' },
        { value: 'old', label: 'Old', icon: Calendar, color: 'text-gray-600' },
        { value: 'qa', label: 'Q&A', icon: Mic, color: 'text-red-600' }
    ];

    const getSortIcon = (value: string) => {
        const option = sortOptions.find(opt => opt.value === value);
        return option ? option.icon : Trophy;
    };

    const getSortLabel = (value: string) => {
        const option = sortOptions.find(opt => opt.value === value);
        return option ? option.label : 'Best';
    };

    const handleSubmitComment = async () => {
        if (!commentContent.trim() || submittingComment) return;

        // Save current values for error recovery
        const currentContent = commentContent;
        const currentReplyTo = replyToComment;

        try {
            setSubmittingComment(true);
            
            const commentData = {
                content: commentContent,
                parentComment: replyToComment,
                isAnonymous: false
            };

            // Create optimistic comment
            const optimisticComment: ForumComment = {
                _id: `temp-${Date.now()}`,
                content: commentContent,
                post: postId,
                author: {
                    _id: session?.user?.id || currentUserId || '', // Use session user ID (MongoDB ID)
                    fullName: session?.user?.name || 'You',
                    profilePic: session?.user?.image || '/default-avatar.jpg'
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                voteCount: 0,
                upvotes: [],
                downvotes: [],
                isAcceptedAnswer: false,
                replies: [],
                isAnonymous: false,
                replyCount: 0,
                displayAuthor: {
                    _id: session?.user?.id || currentUserId || '', // Use session user ID (MongoDB ID)
                    fullName: session?.user?.name || 'You',
                    profilePic: session?.user?.image || '/default-avatar.jpg'
                }
            };

            // Add optimistic comment to UI immediately
            setComments(prev => [optimisticComment, ...prev]);
            
            // Update post comment count locally
            if (post) {
                setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
            }
            
            // Reset form immediately
            setCommentContent('');
            setShowCommentForm(false);
            setReplyToComment(null);

            // Call API in background
            const response = await forumAPI.createComment(postId, commentData);
            

            
            // Replace optimistic comment with real comment from server
            setComments(prev => prev.map(comment => 
                comment._id === optimisticComment._id ? response.data : comment
            ));
            
            toast.success('Comment posted!');
        } catch (error: any) {
            console.error('Submit comment error:', error);
            
            // Remove optimistic comment on error
            setComments(prev => prev.filter(comment => !comment._id.startsWith('temp-')));
            
            // Revert comment count
            if (post) {
                setPost(prev => prev ? { ...prev, commentCount: prev.commentCount - 1 } : null);
            }
            
            // Restore form content
            setCommentContent(currentContent);
            setShowCommentForm(true);
            setReplyToComment(currentReplyTo);
            
            toast.error('Failed to post comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <ForumLayout 
                showRightSidebar={true}
                showOtherDiscussions={true}
                currentPostId={postId}
            >
                <div className="flex justify-center py-12">
                    <PageLoader />
                </div>
            </ForumLayout>
        );
    }

    if (!post) {
        return (
            <ForumLayout 
                showRightSidebar={true}
                showOtherDiscussions={true}
                currentPostId={postId}
            >
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Post not found</h3>
                    <button 
                        onClick={() => router.back()}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        Go back
                    </button>
                </div>
            </ForumLayout>
        );
    }

    return (
        <ForumLayout 
            showRightSidebar={true}
            showOtherDiscussions={true}
            currentPostId={postId}
        >
            <div className="max-w-4xl mx-auto">
                {/* ===== BACK BUTTON ===== */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center cursor-pointer gap-2 mb-10 text-gray-500 hover:text-gray-700 hover:bg-[#e4ebee] px-3 py-1.5 rounded-full transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Forum
                </button>

                {/* ===== SINGLE UNIFIED CONTENT BLOCK ===== */}
                <div className="space-y-6">
                    {/* ===== POST CONTENT ===== */}
                    <div className="flex gap-4">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Author & Meta Info - Reddit Style */}
                            <div className="flex items-start gap-3 mb-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {post.isAnonymous ? (
                                        <Image
                                            src="/default-avatar.jpg"
                                            alt="Anonymous"
                                            className="w-10 h-10 rounded-full object-cover"
                                            width={40}
                                            height={40}
                                        />
                                    ) : post.author?.profilePic ? (
                                        <Image
                                            src={post.author.profilePic}
                                            alt={post.author.fullName}
                                            className="w-10 h-10 rounded-full object-cover"
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-sm text-gray-600 font-medium">
                                                {post.author?.fullName?.charAt(0) || 'A'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info Container - 2 lines */}
                                <div className="flex-1 min-w-0 mb-4">
                                    {/* Line 1: Category + Time */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getCategoryColor(post.category)}`}>
                                            {post.category.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-gray-500">
                                            {formatTimeAgo(post.createdAt)}
                                        </span>
                                    </div>

                                    {/* Line 2: Author Name */}
                                    <div className="text-sm font-medium text-gray-900">
                                        {post.isAnonymous ? 'Anonymous' : (post.author?.fullName || post.author?.email || 'Unknown User')}
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {post.title}
                            </h1>

                            {/* Category Badge */}
                            <div className="flex items-center gap-2">
                                {/* <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getCategoryColor(post.category)}`}>
                                    {post.category.toUpperCase()}
                                </span> */}
                                
                                {post.isPinned && (
                                    <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                        PINNED
                                    </span>
                                )}

                                {post.status === 'resolved' && (
                                    <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                                        RESOLVED
                                    </span>
                                )}
                            </div>

                            {/* Post Content */}
                            <div className="prose max-w-none mb-6">
                                {post.content.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4 text-gray-700 leading-relaxed text-base">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-2 mb-6 flex-wrap">
                                    {post.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons - Pill Style */}
                            <div className="flex items-center gap-3 py-4">
                                {/* Vote Button - Reddit Style */}
                                <div className={`flex items-center rounded-full px-3 py-2 transition-all duration-200 ${
                                    hasUpvoted || hasDownvoted ? 'bg-[#d93a00]' : 'bg-[#b5f3fa]'
                                }`}>
                                    <button
                                        onClick={handleUpvote}
                                        className={`flex items-center justify-center p-1 rounded-md transition-all duration-200 cursor-pointer ${
                                            isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                        } ${
                                            hasUpvoted || hasDownvoted ? 'text-white' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                    >
                                        <BiUpvote className="w-5 h-5" />
                                    </button>
                                    <span className={`text-sm font-medium min-w-[20px] text-center mx-2 ${
                                        hasUpvoted || hasDownvoted ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {post.voteCount || 0}
                                    </span>
                                    <button
                                        onClick={handleDownvote}
                                        className={`flex items-center justify-center p-1 rounded-md transition-all duration-200 cursor-pointer ${
                                            isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                        } ${
                                            hasUpvoted || hasDownvoted ? 'text-white' : 'text-gray-700 hover:text-red-600'
                                        }`}
                                    >
                                        <BiDownvote className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Comments Button - Pill Style */}
                                <button className="flex items-center gap-2 bg-[#b5f3fa] rounded-full px-3 py-2 text-gray-700 hover:bg-[#a0e8f0] transition-colors">
                                    <FaRegCommentDots className="w-4 h-4" />
                                    <span className="text-sm font-medium">{comments.length}</span>
                                </button>

                                {/* Award Button - Pill Style */}
                                <button className="flex items-center justify-center bg-[#b5f3fa] rounded-full px-3 py-2 text-gray-700 hover:bg-[#a0e8f0] transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </button>

                                {/* Share Button - Pill Style */}
                                <button className="flex items-center gap-2 bg-[#b5f3fa] rounded-full px-3 py-2 text-gray-700 hover:bg-[#a0e8f0] transition-colors">
                                    <TbShare3 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Share</span>
                                </button>
                            </div>

                            {/* Comment Form */}
                            <div className="border-t border-gray-200 pt-6 mb-6">
                                <div className="relative">
                                    <textarea
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder="Aa"
                                        className="w-full h-24 p-4 pr-32 border border-gray-300 rounded-lg resize-none text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-colors"
                                    />
                                    
                                    {/* Buttons inside textarea */}
                                    <div className="absolute bottom-3 right-2 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setCommentContent('');
                                                setShowCommentForm(false);
                                                setReplyToComment(null);
                                            }}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                        
                                        <button
                                            onClick={handleSubmitComment}
                                            disabled={!commentContent.trim() || submittingComment}
                                            className="px-4 py-1.5 bg-blue-800 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            {submittingComment ? 'Posting...' : 'Comment'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-700">{comments.length} comments</span>
                                        
                                        {/* Sort Dropdown - Reddit Style */}
                                        <div className="relative" ref={sortDropdownRef}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                                                <button
                                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                                    className="flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-3 py-1.5 text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                                                >
                                                    {(() => {
                                                        const IconComponent = getSortIcon(sortBy);
                                                        return <IconComponent className="w-4 h-4" />;
                                                    })()}
                                                    <span>{getSortLabel(sortBy)}</span>
                                                    <ChevronDown className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {showSortDropdown && (
                                                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                                    <div className="py-1">
                                                        <div className="px-3 py-2 border-b border-gray-100">
                                                            <span className="text-sm font-medium text-gray-900">Sort by</span>
                                                        </div>
                                                        {sortOptions.map((option) => {
                                                            const IconComponent = option.icon;
                                                            return (
                                                                <button
                                                                    key={option.value}
                                                                    onClick={() => {
                                                                        setSortBy(option.value);
                                                                        setShowSortDropdown(false);
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                                                                        sortBy === option.value ? 'bg-blue-50 text-blue-800' : 'text-gray-700'
                                                                    }`}
                                                                >
                                                                    <IconComponent className={`w-4 h-4 ${option.color}`} />
                                                                    <span>{option.label}</span>
                                                                    {sortBy === option.value && (
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
                                </div>

                                {comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {comments
                                            .sort((a, b) => {
                                                // Sort user's own comments first
                                                if (a.author._id === currentUserId && b.author._id !== currentUserId) return -1;
                                                if (a.author._id !== currentUserId && b.author._id === currentUserId) return 1;
                                                // Then sort by creation time (newest first)
                                                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                                            })
                                            .map((comment) => (
                                            <ForumCommentThread
                                                key={comment._id}
                                                comment={comment}
                                                currentUserId={currentUserId}
                                                postAuthorId={post.author?._id}
                                                onReply={handleReply}
                                                onVoteUpdate={handleCommentVoteUpdate}
                                                onAcceptAnswer={handleAcceptAnswer}
                                                onEditComment={handleEditComment}
                                                onDeleteComment={handleDeleteComment}
                                                depth={0}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">Be the first one to comment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ForumLayout>
    );
};

export default ForumPostDetailPage; 