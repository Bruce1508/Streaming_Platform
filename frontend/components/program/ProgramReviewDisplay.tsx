'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    MessageSquare, 
    Calendar, 
    User,
    ChevronDown,
    ChevronUp,
    Loader2,
    ThumbsUp,
    ThumbsDown,
    Star as StarIcon,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import ProgramReviewForm from './ProgramReviewForm';
import { 
    ProgramReview, 
    ProgramReviewsResponse, 
    CriteriaRatings,
    CRITERIA_LABELS,
    CRITERIA_DESCRIPTIONS 
} from '@/types/ProgramReview';
import { programReviewAPI } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface ProgramReviewDisplayProps {
    programId: string;
    programName: string;
    schoolName: string;
}

const ProgramReviewDisplay: React.FC<ProgramReviewDisplayProps> = ({
    programId,
    programName,
    schoolName
}) => {
    const { data: session } = useSession();
    const [reviewData, setReviewData] = useState<ProgramReviewsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState<ProgramReview | null>(null);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [filter, setFilter] = useState({ 
        rating: 'All', 
        date: 'Newest', 
        helpfulness: 'Most Helpful' 
    });

    useEffect(() => {
        fetchReviews();
        if (session) {
            fetchUserReview();
        }
    }, [programId, session]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await programReviewAPI.getProgramReviews(programId);
            if (response.success) {
                setReviewData(response.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReview = async () => {
        try {
            const response = await programReviewAPI.getUserReviewForProgram(programId);
            if (response.success) {
                setUserReview(response.data);
            }
        } catch (error) {
            // User hasn't reviewed yet - this is expected
            setUserReview(null);
        }
    };

    const handleReviewSuccess = () => {
        fetchReviews();
        fetchUserReview();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getOverallRating = (criteriaRatings: CriteriaRatings): number => {
        const ratings = Object.values(criteriaRatings);
        return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    };

    // Handle like/dislike review with optimistic update
    const handleLikeReview = async (reviewId: string, action: 'like' | 'dislike') => {
        if (!session) {
            toast.error('Please login to react to reviews');
            return;
        }

        // Find current review
        const currentReview = reviewData?.reviews.find(r => r._id === reviewId);
        if (!currentReview || !reviewData) return;

        // Save original state for rollback
        const originalReviewData = {
            ...reviewData,
            reviews: [...reviewData.reviews]
        };

        // Optimistic update - update UI immediately
        const updatedReviews = reviewData.reviews.map(review => {
            if (review._id === reviewId) {
                let newLikes = review.likes;
                let newDislikes = review.dislikes;
                let newUserLiked = review.userLiked;
                let newUserDisliked = review.userDisliked;

                if (action === 'like') {
                    if (review.userLiked) {
                        // Remove like
                        newLikes = Math.max(0, newLikes - 1);
                        newUserLiked = false;
                    } else {
                        // Add like
                        newLikes = newLikes + 1;
                        newUserLiked = true;
                        
                        // Remove dislike if exists
                        if (review.userDisliked) {
                            newDislikes = Math.max(0, newDislikes - 1);
                            newUserDisliked = false;
                        }
                    }
                } else { // dislike
                    if (review.userDisliked) {
                        // Remove dislike
                        newDislikes = Math.max(0, newDislikes - 1);
                        newUserDisliked = false;
                    } else {
                        // Add dislike
                        newDislikes = newDislikes + 1;
                        newUserDisliked = true;
                        
                        // Remove like if exists
                        if (review.userLiked) {
                            newLikes = Math.max(0, newLikes - 1);
                            newUserLiked = false;
                        }
                    }
                }

                return {
                    ...review,
                    likes: newLikes,
                    dislikes: newDislikes,
                    userLiked: newUserLiked,
                    userDisliked: newUserDisliked
                };
            }
            return review;
        });

        // Update UI immediately
        setReviewData({
            ...reviewData,
            reviews: updatedReviews
        });

        try {
            // Call API in background
            await programReviewAPI.likeReview(reviewId, action);
            // Don't show success toast to avoid spam
        } catch (error: any) {
            console.error(`Error ${action}ing review:`, error);
            
            // Rollback on error
            setReviewData(originalReviewData);
            
            toast.error(`Failed to ${action} review`);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-8 border border-gray-200">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">Loading reviews...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Review Button */}
            <div className="flex justify-between items-center">
                <div className="text-gray-600">
                    <span className="font-medium">{schoolName}</span>
                    {reviewData && (
                        <span className="ml-2">
                            • {reviewData.averages.totalReviews} review{reviewData.averages.totalReviews !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                
                {session && !userReview && (
                    <Button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {reviewData && reviewData.averages.totalReviews === 0 ? 'Write First Review' : 'Add Review'}
                    </Button>
                )}
            </div>

            {/* Filter Bar */}
            {reviewData && reviewData.reviews.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex flex-wrap gap-4 items-center">
                        <span className="font-semibold text-lg text-gray-800">Filter Reviews</span>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Button 
                                    variant="outline" 
                                    className="flex items-center gap-2 text-gray-700 border-gray-300"
                                >
                                    Rating <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="relative">
                                <Button 
                                    variant="outline" 
                                    className="flex items-center gap-2 text-gray-700 border-gray-300"
                                >
                                    Date <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="relative">
                                <Button 
                                    variant="outline" 
                                    className="flex items-center gap-2 text-gray-700 border-gray-300"
                                >
                                    Helpfulness <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User's Review (if exists) */}
            {userReview && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-blue-800">Your Review</h3>
                        <span className="text-sm text-blue-600">
                            {userReview.year} • {formatDate(userReview.createdAt)}
                        </span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                        {[1,2,3,4,5].map(i => (
                            <StarIcon 
                                key={i} 
                                className={`w-5 h-5 ${i <= getOverallRating(userReview.criteriaRatings) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill={i <= getOverallRating(userReview.criteriaRatings) ? '#facc15' : 'none'} 
                            />
                        ))}
                    </div>
                    
                    {userReview.comment && (
                        <p className="text-gray-700">
                            {userReview.comment}
                        </p>
                    )}
                </div>
            )}

            {/* Reviews List */}
            {reviewData && reviewData.reviews.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="space-y-8">
                        {(showAllReviews ? reviewData.reviews : reviewData.reviews.slice(0, 3))
                            .filter(review => review._id !== userReview?._id)
                            .map((review) => (
                            <div key={review._id} className="flex gap-4 border-b border-gray-200 pb-8 last:border-b-0">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {review.user.profilePic ? (
                                            <img 
                                                src={review.user.profilePic} 
                                                alt={review.user.fullName}
                                                className="w-12 h-12 object-cover"
                                            />
                                        ) : (
                                            <User className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                
                                {/* Review Content */}
                                <div className="flex-1">
                                    {/* Name and Date */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-base text-gray-900">
                                            {review.user.fullName || 'Anonymous'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                    
                                    {/* Star Rating */}
                                    <div className="flex items-center mb-3">
                                        {[1,2,3,4,5].map(i => (
                                            <StarIcon 
                                                key={i} 
                                                className={`w-4 h-4 ${i <= getOverallRating(review.criteriaRatings) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                fill={i <= getOverallRating(review.criteriaRatings) ? '#facc15' : 'none'} 
                                            />
                                        ))}
                                    </div>
                                    
                                    {/* Comment */}
                                    {review.comment && (
                                        <div className="text-gray-800 mb-4 leading-relaxed">
                                            {review.comment}
                                        </div>
                                    )}
                                    
                                    {/* Like/Dislike Buttons */}
                                    <div className="flex gap-6 items-center text-gray-500 text-sm">
                                        <button 
                                            className={`flex items-center gap-1 cursor-pointer transition-colors ${
                                                review.userLiked ? 'text-blue-500' : 'hover:text-blue-500'
                                            } disabled:opacity-50`}
                                            onClick={() => handleLikeReview(review._id, 'like')}
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            {review.likes > 0 && <span>{review.likes}</span>}
                                        </button>
                                        <button 
                                            className={`flex items-center gap-1 cursor-pointer transition-colors ${
                                                review.userDisliked ? 'text-red-500' : 'hover:text-red-500'
                                            } disabled:opacity-50`}
                                            onClick={() => handleLikeReview(review._id, 'dislike')}
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                            {review.dislikes > 0 && <span>{review.dislikes}</span>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Show More/Less Button */}
                    {reviewData.reviews.length > 3 && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="flex items-center mx-auto text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {showAllReviews ? (
                                    <>
                                        Show Less <ChevronUp className="w-4 h-4 ml-1" />
                                    </>
                                ) : (
                                    <>
                                        Show All Reviews <ChevronDown className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* No Reviews State */}
            {reviewData && reviewData.reviews.length === 0 && (
                <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-6">
                        Be the first to share your experience with this program!
                    </p>
                    {session && (
                        <Button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Write First Review
                        </Button>
                    )}
                </div>
            )}

            {/* Review Form Modal */}
            <ProgramReviewForm
                programId={programId}
                programName={programName}
                isOpen={showReviewForm}
                onClose={() => setShowReviewForm(false)}
                onSuccess={handleReviewSuccess}
            />
        </div>
    );
};

export default ProgramReviewDisplay; 