'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, MessageSquare, Eye, Clock, Tag, Share2, Flag, Bookmark } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import ForumCommentThread from '@/components/forum/ForumCommentThread';
import VoteButtons from '@/components/forum/VoteButtons';
import PageLoader from '@/components/ui/PageLoader';
import { forumAPI } from '@/lib/api';
import { ForumPost, ForumComment } from '@/types/Forum';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

// ===== FORUM POST DETAIL PAGE =====
// Trang chi tiết post với comment system giống Reddit
const ForumPostDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const postId = params.id as string;
    const currentUserId = session?.user?.id;

    // ===== STATES =====
    const [post, setPost] = useState<ForumPost | null>(null);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [replyToComment, setReplyToComment] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // ===== FETCH POST & COMMENTS =====
    const fetchPostDetail = async () => {
        try {
            setLoading(true);
            
            console.log('🔄 Fetching post detail:', postId);
            
            const response = await forumAPI.getPost(postId);
            
            console.log('📨 API Response:', response);
            console.log('📊 Response data:', response.data);
            
            if (response && response.data) {
                // Check if response has success flag and valid data structure
                const isSuccess = response.success === true || response.statusCode === 200;
                
                if (isSuccess && response.data.post) {
                    const postData = response.data.post;
                    const commentsData = response.data.comments || [];
                    
                    setPost(postData);
                    setComments(commentsData);
                    
                    console.log('✅ Post detail loaded:', postData.title);
                } else {
                    console.error('❌ API Error - Invalid post data:', response.data);
                    setPost(null);
                    setComments([]);
                    toast.error('Failed to load post - invalid response data');
                }
            } else {
                console.error('❌ API Error - No response data');
                setPost(null);
                setComments([]);
                toast.error('Failed to load post - no response data');
            }
        } catch (error: any) {
            console.error('❌ Fetch post detail error:', error);
            setPost(null);
            setComments([]);
            toast.error('Failed to load post from server');
        } finally {
            setLoading(false);
        }
    };

    // ===== EFFECTS =====
    useEffect(() => {
        if (postId) {
            fetchPostDetail();
        }
    }, [postId]);

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

    // ===== HANDLE ACTIONS =====
    const handleVoteUpdate = (newVoteData: any) => {
        if (post) {
            setPost(prev => prev ? { ...prev, voteCount: newVoteData.voteCount } : null);
        }
    };

    const handleCommentVoteUpdate = (commentId: string, newVoteData: any) => {
        setComments(prev => prev.map(comment => 
            comment._id === commentId 
                ? { ...comment, voteCount: newVoteData.voteCount }
                : comment
        ));
    };

    const handleReply = (parentCommentId: string) => {
        setReplyToComment(parentCommentId);
        setShowCommentForm(true);
        // Scroll to comment form
        setTimeout(() => {
            document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleAcceptAnswer = (commentId: string) => {
        setComments(prev => prev.map(comment => 
            comment._id === commentId 
                ? { ...comment, isAcceptedAnswer: true }
                : { ...comment, isAcceptedAnswer: false } // Unaccept others
        ));
    };

    const handleSubmitComment = async () => {
        if (!commentContent.trim() || submittingComment) return;

        try {
            setSubmittingComment(true);
            
            const commentData = {
                content: commentContent,
                parentComment: replyToComment,
                isAnonymous: false
            };

            await forumAPI.createComment(postId, commentData);
            
            // Refresh comments
            await fetchPostDetail();
            
            // Reset form
            setCommentContent('');
            setShowCommentForm(false);
            setReplyToComment(null);
            
            toast.success('Comment posted!');
        } catch (error: any) {
            console.error('Submit comment error:', error);
            toast.error('Failed to post comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <ForumLayout 
                showRightSidebar={true}
                showOtherDiscussions={true}
                currentPostId={postId}
            >
                <div className="flex justify-center py-12">
                    <PageLoader />
                </div>
            </ForumLayout>
        );
    }

    if (!post) {
        return (
            <ForumLayout 
                showRightSidebar={true}
                showOtherDiscussions={true}
                currentPostId={postId}
            >
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Post not found</h3>
                    <button 
                        onClick={() => router.back()}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        Go back
                    </button>
                </div>
            </ForumLayout>
        );
    }

    return (
        <ForumLayout 
            showRightSidebar={true}
            showOtherDiscussions={true}
            currentPostId={postId}
        >
            <div className="max-w-4xl mx-auto">
                {/* ===== BACK BUTTON ===== */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Forum
                </button>

                {/* ===== SINGLE UNIFIED CONTENT BLOCK ===== */}
                <div className="space-y-6">
                    {/* ===== POST CONTENT ===== */}
                    <div className="flex gap-4">
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
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(post.category)}`}>
                                    {post.category.toUpperCase()}
                                </span>
                                
                                {post.isPinned && (
                                    <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                        PINNED
                                    </span>
                                )}

                                {post.status === 'resolved' && (
                                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                        RESOLVED
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {post.title}
                            </h1>

                            {/* Author & Meta Info - Reddit Style */}
                            <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                                <Image
                                    src={post.displayAuthor?.profilePic || '/default-avatar.jpg'}
                                    alt={post.displayAuthor?.fullName || 'Anonymous'}
                                    className="w-5 h-5 rounded-full object-cover"
                                    width={20}
                                    height={20}
                                />
                                <span className="font-medium text-gray-900">
                                    u/{post.displayAuthor?.fullName}
                                </span>
                                <span>•</span>
                                <span>{formatTimeAgo(post.createdAt)}</span>
                            </div>

                            {/* Post Content */}
                            <div className="prose max-w-none mb-6">
                                {post.content.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4 text-gray-700 leading-relaxed text-base">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-2 mb-6 flex-wrap">
                                    {post.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons with Vote Buttons */}
                            <div className="flex items-center gap-4 py-4">
                                {/* Vote Buttons with blue background */}
                                <div className="flex items-center bg-blue-50 rounded-full px-2 py-1">
                                    <VoteButtons
                                        id={post._id}
                                        type="post"
                                        voteCount={post.voteCount}
                                        upvotes={post.upvotes}
                                        downvotes={post.downvotes}
                                        currentUserId={currentUserId}
                                        onVoteUpdate={handleVoteUpdate}
                                        size="sm"
                                        className="scale-90"
                                    />
                                </div>

                                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                                
                                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                                    <Bookmark className="w-4 h-4" />
                                    Save
                                </button>
                                
                                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                                    <Flag className="w-4 h-4" />
                                    Report
                                </button>
                            </div>

                            {/* Comment Form */}
                            <div className="border-t border-gray-200 pt-6 mb-6">
                                <div className="space-y-4">
                                    <textarea
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder="What are your thoughts?"
                                        className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setCommentContent('');
                                                setShowCommentForm(false);
                                                setReplyToComment(null);
                                            }}
                                            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        
                                        <button
                                            onClick={handleSubmitComment}
                                            disabled={!commentContent.trim() || submittingComment}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submittingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-700">{comments.length} comments</span>
                                        
                                        {/* Sort Dropdown - Reddit Style */}
                                        <div className="relative">
                                            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer">
                                                <option value="best">🏆 Best</option>
                                                <option value="top">⬆️ Top</option>
                                                <option value="new">🆕 New</option>
                                                <option value="controversial">⚡ Controversial</option>
                                                <option value="old">📅 Old</option>
                                                <option value="qa">❓ Q&A</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {comments.map((comment) => (
                                            <ForumCommentThread
                                                key={comment._id}
                                                comment={comment}
                                                currentUserId={currentUserId}
                                                onVoteUpdate={handleCommentVoteUpdate}
                                                onReply={handleReply}
                                                onAcceptAnswer={handleAcceptAnswer}
                                                depth={0}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">Be the first one to comment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ForumLayout>
    );
};

export default ForumPostDetailPage; 