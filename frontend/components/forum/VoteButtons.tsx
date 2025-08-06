'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { forumAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { voteStateManager } from '@/lib/voteStateManager';

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

    // ===== VOTE STATE MANAGER INTEGRATION =====
    useEffect(() => {
        // 🎯 CHỈ SUBSCRIBE CHO POST TYPE (không phải comment)
        if (type !== 'post') {
            console.log('🚫 VoteButtons - Skipping VoteStateManager for type:', type);
            return;
        }

        console.log('👂 VoteButtons - Subscribing to VoteStateManager for postId:', id);
        
        // Subscribe để lắng nghe thay đổi từ các component khác
        const unsubscribe = voteStateManager.subscribe(id, (state) => {
            console.log('📢 VoteButtons - Received vote state update:', { 
                postId: id, 
                newVoteCount: state.voteCount,
                newUpvotes: state.upvotes?.length || 0,
                newDownvotes: state.downvotes?.length || 0
            });

            // 🔄 CẬP NHẬT LOCAL STATE TỪ VOTE STATE MANAGER
            setLocalVoteCount(state.voteCount);
            setLocalUpvotes(state.upvotes || []);
            setLocalDownvotes(state.downvotes || []);
            
            console.log('✅ VoteButtons - Local state updated from VoteStateManager');
        });

        // 🔍 KIỂM TRA VÀ LOAD STATE BAN ĐẦU
        const existingState = voteStateManager.getVoteState(id);
        if (existingState) {
            console.log('📱 VoteButtons - Loading existing state from VoteStateManager:', existingState);
            setLocalVoteCount(existingState.voteCount);
            setLocalUpvotes(existingState.upvotes || []);
            setLocalDownvotes(existingState.downvotes || []);
        }

        // Cleanup subscription khi component unmount
        return () => {
            console.log('🧹 VoteButtons - Unsubscribing from VoteStateManager for postId:', id);
            unsubscribe();
        };
    }, [id, type]);

    // ===== CHECK USER VOTE STATUS =====
    // Kiểm tra user hiện tại đã vote chưa
    const hasUpvoted = currentUserId ? localUpvotes.includes(currentUserId) : false;
    const hasDownvoted = currentUserId ? localDownvotes.includes(currentUserId) : false;

    // ===== HANDLE VOTE =====
    const handleVote = async (voteType: 'up' | 'down') => {
        if (!currentUserId) {
            console.log('🚫 VoteButtons - Please login to vote');
            toast.error('Please login to vote');
            return;
        }

        if (isVoting) {
            console.log('🚫 VoteButtons - Already voting, please wait');
            return;
        }

        console.log('🔄 VoteButtons - Starting vote:', { 
            id, 
            type, 
            voteType, 
            currentUserId, 
            currentUpvotes: localUpvotes.length,
            currentDownvotes: localDownvotes.length,
            hasAlreadyUpvoted: hasUpvoted,
            hasAlreadyDownvoted: hasDownvoted
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
                
                // 🎯 CẬP NHẬT VOTE STATE MANAGER TRƯỚC (để đồng bộ với tất cả components)
                if (type === 'post') {
                    console.log('🎯 VoteButtons - Updating VoteStateManager...');
                    voteStateManager.updateVoteState(
                        id,
                        voteCount,
                        upvotes || [],
                        downvotes || []
                    );
                    console.log('✅ VoteButtons - VoteStateManager updated successfully');
                } else {
                    // 🔄 CHỈ CẬP NHẬT LOCAL STATE CHO COMMENTS (không dùng VoteStateManager)
                    console.log('📝 VoteButtons - Updating local state for comment');
                    setLocalVoteCount(voteCount);
                    setLocalUpvotes(upvotes || []);
                    setLocalDownvotes(downvotes || []);
                }
                
                // 📢 CALLBACK ĐỂ PARENT COMPONENT UPDATE (compatibility với code cũ)
                onVoteUpdate?.({ voteCount, upvotes, downvotes });
                
                console.log('✅ VoteButtons vote successful:', { 
                    id,
                    type,
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