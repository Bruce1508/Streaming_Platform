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
            'question': 'bg-gray-100 text-black',
            'discussion': 'bg-gray-100 text-black',
            'general': 'bg-gray-100 text-black',
            'course-specific': 'bg-gray-100 text-black',
            'assignment': 'bg-gray-100 text-black',
            'exam': 'bg-gray-100 text-black',
            'career': 'bg-gray-100 text-black'
        };
        return colors[category] || colors['general'];
    };

    const handleVoteUpdate = (newVoteData: any) => {
        onVoteUpdate?.(post._id, newVoteData);
    };

    return (
        <div className={`bg-[#161618] border border-gray-700 rounded-xl shadow-sm hover:shadow-lg hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
            <div className="p-6">
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
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Category Badge */}
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
                                    {post.category.toUpperCase()}
                                </span>
                                
                                {/* Pinned Badge */}
                                {post.isPinned && (
                                    <span className="px-3 py-1 text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full">
                                        📌 PINNED
                                    </span>
                                )}

                                {/* Status Badge */}
                                {post.status === 'resolved' && (
                                    <span className="px-3 py-1 text-xs font-semibold bg-green-50 text-green-800 border border-green-200 rounded-full">
                                        ✅ RESOLVED
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ===== TITLE ===== */}
                        <h3 className="text-xl font-bold text-white mb-3 hover:text-gray-300 transition-colors">
                            <Link href={`/forum/${post._id}`} className="line-clamp-2">
                                {post.title}
                            </Link>
                        </h3>

                        {/* ===== CONTENT PREVIEW ===== */}
                        <p className="text-gray-300 text-base mb-4 line-clamp-3 leading-relaxed">
                            {post.content}
                        </p>

                        {/* ===== TAGS ===== */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <Tag className="w-4 h-4 text-gray-400" />
                                {post.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors"
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
                        <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
                            <div className="flex items-center gap-4">
                                {/* Author Info */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src={post.displayAuthor?.profilePic || '/default-avatar.jpg'}
                                        alt={post.displayAuthor?.fullName}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium text-white">
                                        {post.displayAuthor?.fullName}
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
                            <div className="mt-3 pt-3 border-t border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span className="font-medium">Program:</span>
                                    <span className="text-white hover:text-gray-300 cursor-pointer transition-colors">
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