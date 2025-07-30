'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { forumAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

// ===== VOTE BUTTONS COMPONENT =====
// Component để hiển thị và xử lý upvote/downvote giống như trong ảnh forum
interface VoteButtonsProps {
    id: string; // ID của post hoặc comment
    type: 'post' | 'comment'; // Loại để biết gọi API nào
    voteCount: number; // Tổng điểm vote (upvotes - downvotes)
    upvotes: string[]; // Array user IDs đã upvote
    downvotes: string[]; // Array user IDs đã downvote
    currentUserId?: string; // ID user hiện tại
    onVoteUpdate?: (newVoteData: any) => void; // Callback khi vote thành công
    className?: string;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
    id,
    type,
    voteCount,
    upvotes,
    downvotes,
    currentUserId,
    onVoteUpdate,
    className = ''
}) => {
    // ===== STATES =====
    const [isVoting, setIsVoting] = useState(false);
    const [localVoteCount, setLocalVoteCount] = useState(voteCount);
    const [localUpvotes, setLocalUpvotes] = useState(upvotes);
    const [localDownvotes, setLocalDownvotes] = useState(downvotes);

    // ===== CHECK USER VOTE STATUS =====
    // Kiểm tra user hiện tại đã vote chưa
    const hasUpvoted = currentUserId ? localUpvotes.includes(currentUserId) : false;
    const hasDownvoted = currentUserId ? localDownvotes.includes(currentUserId) : false;

    // ===== HANDLE VOTE =====
    const handleVote = async (voteType: 'up' | 'down') => {
        if (!currentUserId) {
            toast.error('Please login to vote');
            return;
        }

        if (isVoting) return;

        try {
            setIsVoting(true);

            // Gọi API vote tương ứng
            const response = type === 'post' 
                ? await forumAPI.votePost(id, voteType)
                : await forumAPI.voteComment(id, voteType);

            if (response.data.success) {
                const newVoteData = response.data.data;
                
                // Cập nhật state local
                setLocalVoteCount(newVoteData.voteCount);
                
                // Cập nhật arrays (giả lập từ response)
                // Trong thực tế API có thể trả về arrays mới
                if (voteType === 'up') {
                    if (hasUpvoted) {
                        // Remove upvote
                        setLocalUpvotes(prev => prev.filter(id => id !== currentUserId));
                    } else {
                        // Add upvote, remove downvote if exists
                        setLocalUpvotes(prev => [...prev.filter(id => id !== currentUserId), currentUserId]);
                        setLocalDownvotes(prev => prev.filter(id => id !== currentUserId));
                    }
                } else {
                    if (hasDownvoted) {
                        // Remove downvote
                        setLocalDownvotes(prev => prev.filter(id => id !== currentUserId));
                    } else {
                        // Add downvote, remove upvote if exists
                        setLocalDownvotes(prev => [...prev.filter(id => id !== currentUserId), currentUserId]);
                        setLocalUpvotes(prev => prev.filter(id => id !== currentUserId));
                    }
                }

                // Callback để parent component update
                onVoteUpdate?.(newVoteData);
                
                toast.success('Vote updated!');
            }
        } catch (error: any) {
            console.error('Vote error:', error);
            toast.error(error.response?.data?.message || 'Failed to vote');
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className={`flex flex-col items-center space-y-1 ${className}`}>
            {/* ===== UPVOTE BUTTON ===== */}
            <button
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`
                    p-1 rounded-md transition-all duration-200 hover:bg-gray-100
                    ${hasUpvoted 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-gray-400 hover:text-green-600'
                    }
                    ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                title="Upvote"
            >
                <ChevronUp className="w-5 h-5" />
            </button>

            {/* ===== VOTE COUNT ===== */}
            <span className={`
                text-sm font-medium min-w-[20px] text-center
                ${localVoteCount > 0 
                    ? 'text-green-600' 
                    : localVoteCount < 0 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                }
            `}>
                {localVoteCount}
            </span>

            {/* ===== DOWNVOTE BUTTON ===== */}
            <button
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`
                    p-1 rounded-md transition-all duration-200 hover:bg-gray-100
                    ${hasDownvoted 
                        ? 'text-red-600 bg-red-50' 
                        : 'text-gray-400 hover:text-red-600'
                    }
                    ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                title="Downvote"
            >
                <ChevronDown className="w-5 h-5" />
            </button>
        </div>
    );
};

export default VoteButtons; 