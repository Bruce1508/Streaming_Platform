'use client';

import React, { useState } from 'react';
import { MessageSquare, ChevronUp, ChevronDown, MoreHorizontal, Reply, Flag } from 'lucide-react';
import { ForumComment } from '@/types/Forum';
import VoteButtons from './VoteButtons';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

// ===== REDDIT-STYLE COMMENT THREAD COMPONENT =====
interface ForumCommentThreadProps {
    comment: ForumComment;
    currentUserId?: string;
    depth?: number;
    onReply?: (commentId: string) => void;
    onVoteUpdate?: (commentId: string, newVoteData: any) => void;
    onAcceptAnswer?: (commentId: string) => void;
}

const ForumCommentThread: React.FC<ForumCommentThreadProps> = ({
    comment,
    currentUserId,
    depth = 0,
    onReply,
    onVoteUpdate,
    onAcceptAnswer
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const formatTimeAgo = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'unknown';
        }
    };

    const handleVoteUpdate = (newVoteData: any) => {
        onVoteUpdate?.(comment._id, newVoteData);
    };

    const maxDepth = 8; // Maximum nesting depth like Reddit
    const isMaxDepth = depth >= maxDepth;
    
    // Colors for different depth levels (light theme)
    const getDepthColor = (depth: number) => {
        const colors = [
            'border-blue-300',
            'border-green-300', 
            'border-yellow-300',
            'border-red-300',
            'border-purple-300',
            'border-pink-300',
            'border-indigo-300',
            'border-orange-300'
        ];
        return colors[depth % colors.length];
    };

    const depthColor = getDepthColor(depth);

    return (
        <div className={`${depth > 0 ? 'ml-6 pl-4' : ''} ${depth > 0 ? `border-l-2 ${depthColor}` : ''}`}>
            <div className="group hover:bg-gray-50 transition-colors rounded-lg">
                <div className="flex gap-3 py-3">
                    {/* Vote Buttons */}
                    <div className="flex-shrink-0">
                        <VoteButtons
                            id={comment._id}
                            type="comment"
                            voteCount={comment.voteCount}
                            upvotes={comment.upvotes}
                            downvotes={comment.downvotes}
                            currentUserId={currentUserId}
                            onVoteUpdate={handleVoteUpdate}
                            size="sm"
                        />
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <Image
                                src={comment.author?.profilePic || '/default-avatar.jpg'}
                                alt={comment.author?.fullName || 'Anonymous'}
                                className="w-5 h-5 rounded-full object-cover"
                                width={20}
                                height={20}
                            />
                            <span className="text-sm font-medium text-gray-900">
                                {comment.author?.fullName || 'Anonymous'}
                            </span>
                            
                            {/* OP Badge */}
                            {comment.isAuthor && (
                                <span className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded text-[10px] font-medium">
                                    OP
                                </span>
                            )}
                            
                            {/* Accepted Answer Badge */}
                            {comment.isAcceptedAnswer && (
                                <span className="px-1.5 py-0.5 text-xs bg-green-600 text-white rounded text-[10px] font-medium">
                                    ✓
                                </span>
                            )}
                            
                            <span className="text-xs text-gray-500">
                                {formatTimeAgo(comment.createdAt)}
                            </span>

                            {/* Collapse Button */}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {isCollapsed ? (
                                    <ChevronDown className="w-3 h-3" />
                                ) : (
                                    <ChevronUp className="w-3 h-3" />
                                )}
                            </button>
                        </div>

                        {/* Comment Content */}
                        {!isCollapsed && (
                            <>
                                <div className="mb-3">
                                    <p className="text-gray-700 leading-relaxed text-sm">
                                        {comment.content}
                                    </p>
                                </div>

                                {/* Comment Actions */}
                                <div className="flex items-center gap-3 text-xs">
                                    {/* Reply Button */}
                                    {!isMaxDepth && (
                                        <button
                                            onClick={() => onReply?.(comment._id)}
                                            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                                        >
                                            Reply
                                        </button>
                                    )}

                                    {/* Accept Answer Button */}
                                    {onAcceptAnswer && !comment.isAcceptedAnswer && (
                                        <button
                                            onClick={() => onAcceptAnswer(comment._id)}
                                            className="text-green-600 hover:text-green-700 font-medium transition-colors"
                                        >
                                            Accept Answer
                                        </button>
                                    )}

                                    {/* Share Button */}
                                    <button className="text-gray-500 hover:text-gray-700 font-medium transition-colors">
                                        Share
                                    </button>

                                    {/* Report Button */}
                                    <button className="text-gray-500 hover:text-red-600 font-medium transition-colors">
                                        Report
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Show collapsed comment info */}
                        {isCollapsed && comment.replies && comment.replies.length > 0 && (
                            <div className="text-xs text-gray-500">
                                ({comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'})
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ===== NESTED REPLIES ===== */}
            {!isCollapsed && comment.replies && comment.replies.length > 0 && (
                <div className="mt-1">
                    {comment.replies.map((reply) => (
                        <ForumCommentThread
                            key={reply._id}
                            comment={reply}
                            currentUserId={currentUserId}
                            depth={depth + 1}
                            onReply={onReply}
                            onVoteUpdate={onVoteUpdate}
                            onAcceptAnswer={onAcceptAnswer}
                        />
                    ))}
                </div>
            )}

            {/* Continue Thread Link for max depth */}
            {isMaxDepth && comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 ml-6 pl-4 border-l-2 border-gray-300">
                    <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                        Continue this thread →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ForumCommentThread;