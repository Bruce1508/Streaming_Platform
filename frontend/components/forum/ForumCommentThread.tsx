'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { BsReply } from "react-icons/bs";
import { TbShare3 } from "react-icons/tb";
import { MdOutlineReportProblem } from "react-icons/md";
import { ForumComment } from '@/types/Forum';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

// ===== REDDIT-STYLE COMMENT THREAD COMPONENT =====
interface ForumCommentThreadProps {
    comment: ForumComment;
    currentUserId?: string;
    postAuthorId?: string;
    depth?: number;
    onReply?: (commentId: string) => void;
    onVoteUpdate?: (commentId: string, newVoteData: any) => void;
    onAcceptAnswer?: (commentId: string) => void;
    onEditComment?: (commentId: string, newContent: string) => void;
    onDeleteComment?: (commentId: string) => void;
}

const ForumCommentThread: React.FC<ForumCommentThreadProps> = ({
    comment,
    currentUserId,
    postAuthorId,
    depth = 0,
    onReply,
    onVoteUpdate,
    onAcceptAnswer,
    onEditComment,
    onDeleteComment
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [localVoteCount, setLocalVoteCount] = useState(comment.voteCount);
    const [localUpvotes, setLocalUpvotes] = useState(comment.upvotes);
    const [localDownvotes, setLocalDownvotes] = useState(comment.downvotes);
    const [isVoting, setIsVoting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const formatTimeAgo = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'unknown';
        }
    };

    // Check user vote status
    const hasUpvoted = currentUserId ? localUpvotes.includes(currentUserId) : false;
    const hasDownvoted = currentUserId ? localDownvotes.includes(currentUserId) : false;

    // Handle vote function
    const handleVote = async (voteType: 'up' | 'down') => {
        if (!currentUserId || isVoting) return;

        try {
            setIsVoting(true);
            
            // Update local state optimistically
            if (voteType === 'up') {
                if (hasUpvoted) {
                    // Remove upvote
                    setLocalUpvotes(prev => prev.filter(id => id !== currentUserId));
                    setLocalVoteCount(prev => prev - 1);
                } else {
                    // Add upvote, remove downvote if exists
                    setLocalUpvotes(prev => [...prev.filter(id => id !== currentUserId), currentUserId]);
                    setLocalDownvotes(prev => prev.filter(id => id !== currentUserId));
                    setLocalVoteCount(prev => prev + (hasDownvoted ? 2 : 1));
                }
            } else {
                if (hasDownvoted) {
                    // Remove downvote
                    setLocalDownvotes(prev => prev.filter(id => id !== currentUserId));
                    setLocalVoteCount(prev => prev + 1);
                } else {
                    // Add downvote, remove upvote if exists
                    setLocalDownvotes(prev => [...prev.filter(id => id !== currentUserId), currentUserId]);
                    setLocalUpvotes(prev => prev.filter(id => id !== currentUserId));
                    setLocalVoteCount(prev => prev - (hasUpvoted ? 2 : 1));
                }
            }

            // Call parent callback
            onVoteUpdate?.(comment._id, { voteCount: localVoteCount });
        } catch (error) {
            console.error('Vote error:', error);
        } finally {
            setIsVoting(false);
        }
    };



    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(comment.content);
        setShowActions(false);
    };

    const handleSaveEdit = () => {
        if (editContent.trim() && editContent !== comment.content) {
            onEditComment?.(comment._id, editContent);
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(comment.content);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            onDeleteComment?.(comment._id);
        }
        setShowActions(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const maxDepth = 8; // Maximum nesting depth like Reddit
    const isMaxDepth = depth >= maxDepth;
    
    // Debug: Log user IDs for this comment
    console.log('🔍 Comment debug:', {
        commentId: comment._id,
        currentUserId,
        authorId: comment.author._id,
        isMatch: currentUserId === comment.author._id,
        currentUserIdType: typeof currentUserId,
        authorIdType: typeof comment.author._id
    });
    

    

    
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
                            {comment.author._id === postAuthorId && (
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

                            {/* Edit indicator */}
                            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                <span className="text-xs text-gray-400">
                                    • edited {formatTimeAgo(comment.updatedAt)}
                                </span>
                            )}

                            {/* Three dots menu - Only show for comment author */}
                            {/* Debug: currentUserId={currentUserId}, author._id={comment.author._id} */}
                            {currentUserId && comment.author._id && currentUserId === comment.author._id && (
                                <div className="relative ml-auto" ref={menuRef}>
                                    <button
                                        onClick={() => setShowActions(!showActions)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    
                                    {/* Dropdown menu */}
                                    {showActions && (
                                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                            <button
                                                onClick={handleEdit}
                                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <Edit className="w-3 h-3" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Comment Content */}
                        {!isCollapsed && (
                            <>
                                {isEditing ? (
                                    <div className="mb-3">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg resize-none text-gray-700 text-sm focus:outline-none focus:border-gray-600"
                                            rows={3}
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-xs"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <p className="text-gray-700 leading-relaxed text-sm">
                                            {comment.content}
                                        </p>
                                    </div>
                                )}

                                {/* Comment Actions */}
                                <div className="flex items-center gap-3 text-xs">
                                    {/* Upvote Button */}
                                    <button
                                        onClick={() => handleVote('up')}
                                        disabled={isVoting}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${
                                            hasUpvoted 
                                                ? 'bg-[#b5f3fa] text-green-600' 
                                                : 'text-gray-500 hover:bg-[#b5f3fa] hover:text-green-600'
                                        } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <BiUpvote className="w-4 h-4" />
                                        <span className="font-medium">{localUpvotes.length}</span>
                                    </button>

                                    {/* Downvote Button */}
                                    <button
                                        onClick={() => handleVote('down')}
                                        disabled={isVoting}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${
                                            hasDownvoted 
                                                ? 'bg-[#b5f3fa] text-red-600' 
                                                : 'text-gray-500 hover:bg-[#b5f3fa] hover:text-red-600'
                                        } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <BiDownvote className="w-4 h-4" />
                                        <span className="font-medium">{localDownvotes.length}</span>
                                    </button>

                                    {/* Reply Button */}
                                    {!isMaxDepth && (
                                        <button
                                            onClick={() => onReply?.(comment._id)}
                                            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                                        >
                                            <BsReply className="w-4 h-4" />
                                            Reply
                                        </button>
                                    )}

                                    {/* Accept Answer Button - Only show for post author */}
                                    {onAcceptAnswer && !comment.isAcceptedAnswer && currentUserId === postAuthorId && (
                                        <button
                                            onClick={() => onAcceptAnswer(comment._id)}
                                            className="text-green-600 hover:text-green-700 font-medium transition-colors"
                                        >
                                            Accept Answer
                                        </button>
                                    )}

                                    {/* Share Button */}
                                    <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-medium transition-colors">
                                        <TbShare3 className="w-4 h-4" />
                                        Share
                                    </button>

                                    {/* Report Button */}
                                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 font-medium transition-colors">
                                        <MdOutlineReportProblem className="w-4 h-4" />
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
                            postAuthorId={postAuthorId}
                            depth={depth + 1}
                            onReply={onReply}
                            onVoteUpdate={onVoteUpdate}
                            onAcceptAnswer={onAcceptAnswer}
                            onEditComment={onEditComment}
                            onDeleteComment={onDeleteComment}
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