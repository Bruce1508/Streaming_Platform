'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageCircle, Eye, Clock, Tag, MoreHorizontal, Share, Bookmark, Flag, TrendingUp } from 'lucide-react';
import { ForumPost } from '@/types/Forum';
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { formatDistanceToNow } from 'date-fns';
import { forumAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { voteStateManager } from '@/lib/voteStateManager';

// ===== FORUM POST CARD COMPONENT =====
// Component hiển thị preview của một forum post trong danh sách
interface ForumPostCardProps {
    post: ForumPost;
    currentUserId?: string;
    onVoteUpdate?: (postId: string, newVoteData: any) => void;
    className?: string;
}

export const ForumPostCard: React.FC<ForumPostCardProps> = ({
    post,
    currentUserId,
    onVoteUpdate,
    className = ''
}) => {
    console.log('🔧 ForumPostCard - Component initialized for postId:', post._id);

    const [showDropdown, setShowDropdown] = useState(false);
    const [localUpvotes, setLocalUpvotes] = useState<string[]>(post.upvotes || []);
    const [localDownvotes, setLocalDownvotes] = useState<string[]>(post.downvotes || []);
    const [isVoting, setIsVoting] = useState(false);
    const [localVoteCount, setLocalVoteCount] = useState(post.voteCount);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load user vote status from localStorage on mount
    useEffect(() => {
        if (currentUserId) {
            const storedVoteState = localStorage.getItem(`vote_${post._id}`);
            if (storedVoteState) {
                try {
                    const voteState = JSON.parse(storedVoteState);
                    if (voteState.userId === currentUserId) {
                        console.log('📱 ForumPostCard - Loading user vote status from localStorage:', voteState);
                        setLocalUpvotes(voteState.upvotes || []);
                        setLocalDownvotes(voteState.downvotes || []);
                    }
                } catch (error) {
                    console.error('❌ ForumPostCard - Error parsing stored vote state:', error);
                }
            }
        }
    }, [post._id, currentUserId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // ===== VOTE STATE MANAGER SUBSCRIPTION =====
    useEffect(() => {
        console.log('👂 ForumPostCard - Subscribing to VoteStateManager for postId:', post._id);
        
        // Subscribe để lắng nghe thay đổi vote từ components khác
        const unsubscribe = voteStateManager.subscribe(post._id, (state) => {
            console.log('📢 ForumPostCard - Received vote state update:', { 
                postId: post._id, 
                newVoteCount: state.voteCount,
                newUpvotes: state.upvotes?.length || 0,
                newDownvotes: state.downvotes?.length || 0
            });

            // 🔄 CẬP NHẬT LOCAL STATE TỪ VOTE STATE MANAGER
            setLocalVoteCount(state.voteCount);
            setLocalUpvotes(state.upvotes || []);
            setLocalDownvotes(state.downvotes || []);
            
            console.log('✅ ForumPostCard - Local state updated from VoteStateManager');
        });

        // 🔍 KIỂM TRA VÀ LOAD STATE BAN ĐẦU
        const existingState = voteStateManager.getVoteState(post._id);
        if (existingState) {
            console.log('📱 ForumPostCard - Loading existing state from VoteStateManager:', existingState);
            setLocalVoteCount(existingState.voteCount);
            setLocalUpvotes(existingState.upvotes || []);
            setLocalDownvotes(existingState.downvotes || []);
        }

        // Cleanup subscription khi component unmount
        return () => {
            console.log('🧹 ForumPostCard - Unsubscribing from VoteStateManager for postId:', post._id);
            unsubscribe();
        };
    }, [post._id]);

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
            'question': 'bg-orange-500 text-white',
            'discussion': 'bg-blue-500 text-white',
            'general': 'bg-gray-500 text-white',
            'course-specific': 'bg-purple-500 text-white',
            'assignment': 'bg-green-500 text-white',
            'exam': 'bg-red-500 text-white',
            'career': 'bg-yellow-500 text-black'
        };
        return colors[category] || colors['general'];
    };

    const handleVoteUpdate = (newVoteData: any) => {
        console.log('🔄 ForumPostCard - handleVoteUpdate called:', { postId: post._id, newVoteData });
        
        // 🎯 CẬP NHẬT VOTE STATE MANAGER (để đồng bộ với tất cả components)
        console.log('🎯 ForumPostCard - Updating VoteStateManager...');
        voteStateManager.updateVoteState(
            post._id,
            newVoteData.voteCount,
            newVoteData.upvotes || [],
            newVoteData.downvotes || []
        );
        console.log('✅ ForumPostCard - VoteStateManager updated successfully');

        // 📢 CALLBACK ĐỂ PARENT COMPONENT UPDATE (compatibility với code cũ)
        onVoteUpdate?.(post._id, newVoteData);
    };

    const handleUpvote = async () => {
        if (!currentUserId || isVoting) {
            console.log('🚫 Cannot upvote in card:', { currentUserId, isVoting });
            return;
        }
        
        console.log('🔄 Starting upvote in card:', { 
            postId: post._id, 
            currentUserId, 
            currentUpvotes: localUpvotes.length,
            currentDownvotes: localDownvotes.length,
            hasAlreadyUpvoted: localUpvotes.includes(currentUserId)
        });
        
        setIsVoting(true);
        
        try {
            const response = await forumAPI.votePost(post._id, 'up');
            
            console.log('📥 Upvote response in card:', response);
            
            if (response.success) {
                const { upvotes, downvotes, voteCount } = response.data;
                
                console.log('📊 Updating card state with:', { 
                    upvotes: upvotes?.length || 0, 
                    downvotes: downvotes?.length || 0, 
                    voteCount 
                });
                
                setLocalUpvotes(upvotes || []);
                setLocalDownvotes(downvotes || []);
                onVoteUpdate?.(post._id, { voteCount });
                
                // Save user vote status to localStorage
                saveUserVoteStatus(upvotes || [], downvotes || []);
                
                console.log('✅ Upvote successful in card:', { 
                    newUpvotes: upvotes?.length || 0, 
                    newDownvotes: downvotes?.length || 0, 
                    newVoteCount: voteCount 
                });
            } else {
                console.error('❌ API response not successful in card:', response);
            }
        } catch (error: any) {
            console.error('❌ Upvote failed in card:', error);
            console.error('❌ Error details in card:', error.response?.data);
            toast.error('Failed to vote. Please try again.');
        } finally {
            setIsVoting(false);
        }
    };

    const handleDownvote = async () => {
        if (!currentUserId || isVoting) {
            console.log('🚫 Cannot downvote in card:', { currentUserId, isVoting });
            return;
        }
        
        console.log('🔄 Starting downvote in card:', { 
            postId: post._id, 
            currentUserId, 
            currentUpvotes: localUpvotes.length,
            currentDownvotes: localDownvotes.length,
            hasAlreadyDownvoted: localDownvotes.includes(currentUserId)
        });
        
        setIsVoting(true);
        
        try {
            const response = await forumAPI.votePost(post._id, 'down');
            
            console.log('📥 Downvote response in card:', response);
            
            if (response.success) {
                const { upvotes, downvotes, voteCount } = response.data;
                
                console.log('📊 Updating card state with:', { 
                    upvotes: upvotes?.length || 0, 
                    downvotes: downvotes?.length || 0, 
                    voteCount 
                });
                
                setLocalUpvotes(upvotes || []);
                setLocalDownvotes(downvotes || []);
                onVoteUpdate?.(post._id, { voteCount });
                
                // Save user vote status to localStorage
                saveUserVoteStatus(upvotes || [], downvotes || []);
                
                console.log('✅ Downvote successful in card:', { 
                    newUpvotes: upvotes?.length || 0, 
                    newDownvotes: downvotes?.length || 0, 
                    newVoteCount: voteCount 
                });
            } else {
                console.error('❌ API response not successful in card:', response);
            }
        } catch (error: any) {
            console.error('❌ Downvote failed in card:', error);
            console.error('❌ Error details in card:', error.response?.data);
            toast.error('Failed to vote. Please try again.');
        } finally {
            setIsVoting(false);
        }
    };

    // Helper function to save user vote status to localStorage
    const saveUserVoteStatus = (upvotes: string[], downvotes: string[]) => {
        if (currentUserId) {
            const voteState = {
                userId: currentUserId,
                upvotes: upvotes || [],
                downvotes: downvotes || [],
                timestamp: Date.now()
            };
            localStorage.setItem(`vote_${post._id}`, JSON.stringify(voteState));
            console.log('💾 ForumPostCard - Saved user vote status to localStorage:', voteState);
        }
    };

    const hasUpvoted = currentUserId ? localUpvotes.includes(currentUserId) : false;
    const hasDownvoted = currentUserId ? localDownvotes.includes(currentUserId) : false;

    return (
        <div className={`bg-[#ffffff] border-t border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${className}`}>
            {/* ===== POST HEADER ===== */}
            <div className="flex gap-2 px-4 py-3">
                {/* Vote Buttons - Reddit Style */}
                <div className="flex-shrink-0 flex items-center mr-3">
                    <div className={`flex flex-col items-center rounded-full px-3 py-2 transition-all duration-200 ${
                        hasUpvoted || hasDownvoted ? 'bg-[#d93a00]' : 'bg-[#b5f3fa]'
                    }`}>
                        <button
                            onClick={handleUpvote}
                            disabled={isVoting}
                            className={`flex items-center justify-center p-1 transition-all duration-200 ${
                                isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            } ${
                                hasUpvoted || hasDownvoted ? 'text-white' : 'text-gray-700 hover:text-green-600'
                            }`}
                        >
                            <BiUpvote className="w-4 h-4" />
                        </button>
                        <span className={`text-sm font-medium min-w-[20px] text-center my-1 ${
                            hasUpvoted || hasDownvoted ? 'text-white' : 'text-gray-900'
                        }`}>
                                                            {localVoteCount || 0}
                        </span>
                        <button
                            onClick={handleDownvote}
                            disabled={isVoting}
                            className={`flex items-center justify-center p-1 transition-all duration-200 ${
                                isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            } ${
                                hasUpvoted || hasDownvoted ? 'text-white' : 'text-gray-700 hover:text-red-600'
                            }`}
                        >
                            <BiDownvote className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Top Row: Avatar + Info (2 lines) */}
                    <div className="flex items-start gap-3 mb-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {post.isAnonymous ? (
                                <img
                                    src="/default-avatar.jpg"
                                    alt="Anonymous"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : post.author?.profilePic ? (
                                <img
                                    src={post.author.profilePic}
                                    alt={post.author.fullName}
                                    className="w-10 h-10 rounded-full object-cover"
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
                        <div className="flex-1 min-w-0">
                            {/* Line 1: Category + Time */}
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getCategoryColor(post.category)}`}>
                                    {post.category.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                    {formatTimeAgo(post.createdAt)}
                                </span>
                                
                                {/* Pinned/Resolved Badges */}
                                {post.isPinned && (
                                    <>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-yellow-600 font-medium">📌 PINNED</span>
                                    </>
                                )}
                                {post.status === 'resolved' && (
                                    <>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-green-600 font-medium">✅ RESOLVED</span>
                                    </>
                                )}
                            </div>

                            {/* Line 2: Author Name */}
                            <div className="text-sm font-medium text-gray-900 opacity-70">
                                {post.isAnonymous ? 'Anonymous' : (post.author?.fullName || post.author?.email || 'Unknown User')}
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        <Link href={`/forum/${post._id}`} className="line-clamp-2">
                            {post.title}
                        </Link>
                    </h3>

                    {/* Content Preview */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1 mb-3 flex-wrap">
                            {post.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {post.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                    +{post.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="flex items-center gap-4 text-xs text-black font-semibold cursor-pointer">
                        <div className="flex items-center gap-1 bg-[#e4ebee] px-3 py-1.5 rounded-full hover:bg-[#d1d8db] transition-colors cursor-pointer">
                                <MessageCircle className="w-3 h-3" />
                            <span>{post.commentCount}</span>
                        </div>
                        
                        <button className="flex items-center gap-1 bg-[#e4ebee] px-3 py-1.5 rounded-full hover:bg-[#d1d8db] transition-colors cursor-pointer">
                            <Share className="w-3 h-3" />
                            <span>Share</span>
                        </button>
                        
                        <button className="flex items-center gap-1 bg-[#e4ebee] px-3 py-1.5 rounded-full hover:bg-[#d1d8db] transition-colors cursor-pointer">
                            <Bookmark className="w-3 h-3" />
                            <span>Save</span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="relative ml-auto" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 top-6 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <div className="py-1">
                                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                            <Bookmark className="w-4 h-4" />
                                            Save Post
                                        </button>
                                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                            <Eye className="w-4 h-4" />
                                            Hide Post
                                        </button>
                                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                            <Flag className="w-4 h-4" />
                                            Report
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumPostCard; 