'use client';

import React, { useState } from 'react';
import { MessageSquare, Share2, Flag, MoreHorizontal, Check } from 'lucide-react';
import { ForumComment } from '@/types/Forum';
import VoteButtons from './VoteButtons';
import { formatDistanceToNow } from 'date-fns';
import { forumAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

// ===== FORUM COMMENT CARD COMPONENT =====
// Component hiển thị comment giống Reddit với voting, reply, nested comments
interface ForumCommentCardProps {
    comment: ForumComment;
    currentUserId?: string;
    postAuthorId?: string; // ID của tác giả bài post để check accept answer
    onVoteUpdate?: (commentId: string, newVoteData: any) => void;
    onReply?: (parentCommentId: string) => void;
    onAcceptAnswer?: (commentId: string) => void;
    level?: number; // Độ sâu của comment (0 = top level, 1 = reply, etc.)
    className?: string;
}

export const ForumCommentCard: React.FC<ForumCommentCardProps> = ({
    comment,
    currentUserId,
    postAuthorId,
    onVoteUpdate,
    onReply,
    onAcceptAnswer,
    level = 0,
    className = ''
}) => {
    // ===== STATES =====
    const [showActions, setShowActions] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);

    // ===== HELPER FUNCTIONS =====
    const formatTimeAgo = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'unknown';
        }
    };

    const isPostAuthor = currentUserId === postAuthorId;
    const isCommentAuthor = currentUserId === comment.author._id;
    const maxDepth = 6; // Giới hạn độ sâu như Reddit

    // ===== HANDLE VOTE UPDATE =====
    const handleVoteUpdate = (newVoteData: any) => {
        onVoteUpdate?.(comment._id, newVoteData);
    };

    // ===== HANDLE ACCEPT ANSWER =====
    const handleAcceptAnswer = async () => {
        if (!isPostAuthor || isAccepting) return;

        try {
            setIsAccepting(true);
            await forumAPI.acceptAnswer(comment._id);
            onAcceptAnswer?.(comment._id);
            toast.success('Answer accepted!');
        } catch (error: any) {
            console.error('Accept answer error:', error);
            toast.error('Failed to accept answer');
        } finally {
            setIsAccepting(false);
        }
    };

    // ===== HANDLE ACTIONS =====
    const handleReply = () => {
        onReply?.(comment._id);
    };

    const handleShare = () => {
        // Copy link to clipboard
        const commentLink = `${window.location.href}#comment-${comment._id}`;
        navigator.clipboard.writeText(commentLink);
        toast.success('Comment link copied!');
    };

    const handleReport = () => {
        toast.error('Report functionality coming soon');
    };

    // ===== INDENTATION STYLE =====
    const indentationStyle = {
        marginLeft: `${Math.min(level * 20, maxDepth * 20)}px`,
        borderLeft: level > 0 ? '2px solid #e5e7eb' : 'none',
        paddingLeft: level > 0 ? '16px' : '0'
    };

    return (
        <div 
            id={`comment-${comment._id}`}
            className={`${className}`} 
            style={indentationStyle}
        >
            <div className="bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200 p-4">
                <div className="flex gap-3">
                    {/* ===== LEFT: VOTE BUTTONS ===== */}
                    <div className="flex-shrink-0">
                        <VoteButtons
                            id={comment._id}
                            type="comment"
                            voteCount={comment.voteCount}
                            upvotes={comment.upvotes}
                            downvotes={comment.downvotes}
                            currentUserId={currentUserId}
                            onVoteUpdate={handleVoteUpdate}
                        />
                    </div>

                    {/* ===== RIGHT: COMMENT CONTENT ===== */}
                    <div className="flex-1 min-w-0">
                        {/* ===== HEADER ===== */}
                        <div className="flex items-center gap-2 mb-2">
                            {/* Author Avatar */}
                            <img
                                src={comment.displayAuthor.profilePic || '/default-avatar.png'}
                                alt={comment.displayAuthor.fullName}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                            
                            {/* Author Name */}
                            <span className="text-sm font-medium text-gray-900">
                                {comment.displayAuthor.fullName}
                            </span>

                            {/* Verified Badge nếu cần */}
                            {comment.author._id === 'verified-user' && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}

                            {/* Time */}
                            <span className="text-xs text-gray-500">
                                {formatTimeAgo(comment.createdAt)}
                            </span>

                            {/* Accepted Answer Badge */}
                            {comment.isAcceptedAnswer && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    ✓ Accepted Answer
                                </span>
                            )}
                        </div>

                        {/* ===== COMMENT CONTENT ===== */}
                        <div className="text-gray-800 text-sm leading-relaxed mb-3">
                            {comment.content}
                        </div>

                        {/* ===== ACTION BUTTONS ===== */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            {/* Reply Button */}
                            {level < maxDepth && (
                                <button
                                    onClick={handleReply}
                                    className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Reply
                                </button>
                            )}

                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>

                            {/* Report Button */}
                            <button
                                onClick={handleReport}
                                className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                            >
                                <Flag className="w-4 h-4" />
                                Report
                            </button>

                            {/* Accept Answer Button (chỉ hiện cho post author) */}
                            {isPostAuthor && !comment.isAcceptedAnswer && (
                                <button
                                    onClick={handleAcceptAnswer}
                                    disabled={isAccepting}
                                    className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors duration-200 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" />
                                    {isAccepting ? 'Accepting...' : 'Accept Answer'}
                                </button>
                            )}

                            {/* More Actions */}
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ===== DROPDOWN ACTIONS (if expanded) ===== */}
                        {showActions && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs space-y-1">
                                {isCommentAuthor && (
                                    <>
                                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                            Edit
                                        </button>
                                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-600">
                                            Delete
                                        </button>
                                    </>
                                )}
                                <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                    Copy Link
                                </button>
                                <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                    Save
                                </button>
                            </div>
                        )}

                        {/* ===== REPLY COUNT (if has replies) ===== */}
                        {comment.replyCount > 0 && (
                            <div className="mt-3 pt-2 border-t border-gray-100">
                                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                    View {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== NESTED REPLIES ===== */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply) => (
                        <ForumCommentCard
                            key={reply._id}
                            comment={reply}
                            currentUserId={currentUserId}
                            postAuthorId={postAuthorId}
                            onVoteUpdate={onVoteUpdate}
                            onReply={onReply}
                            onAcceptAnswer={onAcceptAnswer}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ForumCommentCard; 