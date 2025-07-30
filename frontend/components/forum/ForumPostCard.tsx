'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Eye, Clock, Tag } from 'lucide-react';
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

    const handleVoteUpdate = (newVoteData: any) => {
        onVoteUpdate?.(post._id, newVoteData);
    };

    return (
        <div className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 ${className}`}>
            <div className="p-4">
                <div className="flex gap-4">
                    {/* ===== LEFT: VOTE BUTTONS ===== */}
                    <div className="flex-shrink-0">
                        <VoteButtons
                            id={post._id}
                            type="post"
                            voteCount={post.voteCount}
                            upvotes={post.upvotes}
                            downvotes={post.downvotes}
                            currentUserId={currentUserId}
                            onVoteUpdate={handleVoteUpdate}
                        />
                    </div>

                    {/* ===== RIGHT: POST CONTENT ===== */}
                    <div className="flex-1 min-w-0">
                        {/* ===== HEADER ===== */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Category Badge */}
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                                    {post.category.toUpperCase()}
                                </span>
                                
                                {/* Pinned Badge */}
                                {post.isPinned && (
                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                        PINNED
                                    </span>
                                )}

                                {/* Status Badge */}
                                {post.status === 'resolved' && (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                        RESOLVED
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ===== TITLE ===== */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            <Link href={`/forum/${post._id}`} className="line-clamp-2">
                                {post.title}
                            </Link>
                        </h3>

                        {/* ===== CONTENT PREVIEW ===== */}
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {post.content}
                        </p>

                        {/* ===== TAGS ===== */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-1 mb-3 flex-wrap">
                                <Tag className="w-4 h-4 text-gray-400" />
                                {post.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {post.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                        +{post.tags.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* ===== FOOTER STATS ===== */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                                {/* Author Info */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src={post.displayAuthor.profilePic || '/default-avatar.png'}
                                        alt={post.displayAuthor.fullName}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium">
                                        {post.displayAuthor.fullName}
                                    </span>
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatTimeAgo(post.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Comments Count */}
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{post.commentCount}</span>
                                </div>

                                {/* Views Count */}
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{post.views}</span>
                                </div>
                            </div>
                        </div>

                        {/* ===== PROGRAM INFO ===== */}
                        {post.program && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="font-medium">Program:</span>
                                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                        {post.program.code} - {post.program.name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumPostCard; 