'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageCircle, Eye, Clock, Tag, MoreHorizontal, Share, Bookmark, Flag, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import { ForumPost } from '@/types/Forum';
import VoteButtons from './VoteButtons';
import { formatDistanceToNow } from 'date-fns';

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
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        onVoteUpdate?.(post._id, newVoteData);
    };

    return (
        <div className={`bg-white border-t border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${className}`}>
            {/* ===== POST HEADER ===== */}
            <div className="flex gap-2 px-4 py-3">
                {/* Vote Buttons */}
                <div className="flex-shrink-0">
                    <VoteButtons
                        id={post._id}
                        type="post"
                        voteCount={post.voteCount}
                        upvotes={post.upvotes}
                        downvotes={post.downvotes}
                        currentUserId={currentUserId}
                        onVoteUpdate={handleVoteUpdate}
                        size="sm"
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Top Row: Category + Meta */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(post.category)}`}>
                            {post.category.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>u/{post.displayAuthor?.fullName}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        
                        {/* Pinned/Resolved Badges */}
                        {post.isPinned && (
                            <>
                                <span>•</span>
                                <span className="text-yellow-600 font-medium">📌 PINNED</span>
                            </>
                        )}
                        {post.status === 'resolved' && (
                            <>
                                <span>•</span>
                                <span className="text-green-600 font-medium">✅ RESOLVED</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
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
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{post.commentCount} comments</span>
                        </div>
                        
                        <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                            <Share className="w-3 h-3" />
                            <span>Share</span>
                        </button>
                        
                        <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
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