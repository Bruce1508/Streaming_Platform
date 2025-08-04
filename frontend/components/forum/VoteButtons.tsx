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
    size?: 'sm' | 'md' | 'lg'; // Size của buttons
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
    size = 'md',
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

    // Size configurations
    const sizeConfig = {
        sm: {
            container: 'space-y-0.5',
            button: 'p-0.5',
            icon: 'w-3 h-3',
            text: 'text-xs'
        },
        md: {
            container: 'space-y-1',
            button: 'p-1',
            icon: 'w-4 h-4',
            text: 'text-sm'
        },
        lg: {
            container: 'space-y-1',
            button: 'p-1',
            icon: 'w-5 h-5',
            text: 'text-sm'
        }
    };

    const config = sizeConfig[size];

    return (
        <div className={`flex flex-col items-center bg-[#b5f3fa] rounded-full px-3 py-2 ${className}`}>
            {/* ===== UPVOTE BUTTON ===== */}
            <button
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`
                    ${config.button} rounded-md transition-all duration-200 hover:bg-blue-100
                    ${hasUpvoted 
                        ? 'text-green-600' 
                        : 'text-gray-600 hover:text-green-600'
                    }
                    ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                title="Upvote"
            >
                <ChevronUp className={config.icon} />
            </button>

            {/* ===== VOTE COUNT ===== */}
            <span className={`
                ${config.text} font-medium min-w-[20px] text-center text-gray-900
            `}>
                {localVoteCount}
            </span>

            {/* ===== DOWNVOTE BUTTON ===== */}
            <button
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`
                    ${config.button} rounded-md transition-all duration-200 hover:bg-blue-100
                    ${hasDownvoted 
                        ? 'text-red-600' 
                        : 'text-gray-600 hover:text-red-600'
                    }
                    ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                title="Downvote"
            >
                <ChevronDown className={config.icon} />
            </button>
        </div>
    );
};

export default VoteButtons; 