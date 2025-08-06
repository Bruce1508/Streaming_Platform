'use client';

import React, { useState, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { forumAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { debounce } from '@/lib/utils';

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
    console.log('🔧 VoteButtons - Component initialized for:', { id, type, voteCount });

    // ===== STATES =====
    const [isVoting, setIsVoting] = useState(false);
    const [localVoteCount, setLocalVoteCount] = useState(voteCount);
    const [localUpvotes, setLocalUpvotes] = useState(upvotes);
    const [localDownvotes, setLocalDownvotes] = useState(downvotes);

    const debouncedVote = useCallback(
        debounce(async (voteType: 'up' | 'down') => {
            if (!currentUserId) {
                console.log('🚫 VoteButtons - Please login to vote');
                toast.error('Please login to vote');
                return;
            }

            if (isVoting) {
                console.log('🚫 VoteButtons - Already voting, please wait');
                return;
            }

            console.log('🔄 VoteButtons - Starting debounced vote:', {
                id,
                type,
                voteType,
                currentUserId
            });

            try {
                setIsVoting(true);

                // Gọi API vote tương ứng
                const response = type === 'post'
                    ? await forumAPI.votePost(id, voteType)
                    : await forumAPI.voteComment(id, voteType);

                console.log('📥 VoteButtons response received:', response);

                if (response.success) {
                    const { upvotes, downvotes, voteCount } = response.data;

                    console.log('📊 VoteButtons updating with:', {
                        upvotes: upvotes?.length || 0,
                        downvotes: downvotes?.length || 0,
                        voteCount
                    });

                    // Cập nhật state local
                    setLocalVoteCount(voteCount);
                    setLocalUpvotes(upvotes || []);
                    setLocalDownvotes(downvotes || []);

                    // Save user vote status to localStorage for sync (only for posts, not vote count)
                    if (type === 'post' && currentUserId) {
                        const voteState = {
                            userId: currentUserId,
                            upvotes: upvotes || [],
                            downvotes: downvotes || [],
                            timestamp: Date.now()
                        };
                        localStorage.setItem(`vote_${id}`, JSON.stringify(voteState));
                        console.log('💾 VoteButtons - Saved user vote status to localStorage:', voteState);
                    }
                    // Callback để parent component update
                    onVoteUpdate?.({ voteCount, upvotes, downvotes });

                    console.log('✅ VoteButtons successful:', {
                        newUpvotes: upvotes?.length || 0,
                        newDownvotes: downvotes?.length || 0,
                        newVoteCount: voteCount
                    });

                    toast.success('Vote updated!');
                } else {
                    console.error('❌ VoteButtons - API response not successful:', response);
                }
            } catch (error: any) {
                console.error('❌ VoteButtons - Vote error:', error);
                console.error('❌ VoteButtons - Error details:', error.response?.data);
                
                // 🚫 XỬ LÝ RATE LIMITING VÀ CÁC ERROR KHÁC
                if (error.response?.status === 429) {
                    toast.error('⚠️ Too many requests! Please wait a moment before voting again.');
                } else if (error.response?.status === 401) {
                    toast.error('�� Please login again to vote');
                } else if (error.response?.status === 403) {
                    toast.error('🚫 You are not allowed to vote on this content');
                } else if (error.response?.status >= 500) {
                    toast.error('🔧 Server error. Please try again later.');
                } else {
                    toast.error(error.response?.data?.message || 'Failed to vote. Please try again.');
                }
            } finally {
                setIsVoting(false);
            }
        }, 500), // 500ms delay
        [id, type, currentUserId, isVoting, onVoteUpdate]
    );

    // ===== CHECK USER VOTE STATUS =====
    // Kiểm tra user hiện tại đã vote chưa
    const hasUpvoted = currentUserId ? localUpvotes.includes(currentUserId) : false;
    const hasDownvoted = currentUserId ? localDownvotes.includes(currentUserId) : false;

    // ===== HANDLE VOTE =====
    // ===== HANDLE VOTE =====
    const handleVote = (voteType: 'up' | 'down') => {
        console.log('🖱️ VoteButtons - Vote button clicked:', { voteType, id });

        // Basic validation
        if (!currentUserId) {
            console.log('🚫 VoteButtons - Please login to vote');
            toast.error('Please login to vote');
            return;
        }

        if (isVoting) {
            console.log('🚫 VoteButtons - Already voting, please wait');
            toast.success('Please wait, vote is being processed...');
            return;
        }

        // Show immediate feedback
        toast.success('Vote registered! Processing...');

        // Schedule debounced vote
        debouncedVote(voteType);
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