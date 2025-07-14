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
    Filter,
    ChevronLeft,
    ChevronRight
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
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({ 
        rating: 'All', 
        date: 'Newest', 
        helpfulness: 'Most Helpful' 
    });

    const REVIEWS_PER_PAGE = 6;

    useEffect(() => {
        fetchReviews();
        if (session) {
            fetchUserReview();
        }
    }, [programId, session]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            console.log('📥 Fetching reviews for program:', programId);
            const response = await programReviewAPI.getProgramReviews(programId);
            console.log('📥 API Response:', response);
            if (response.success) {
                setReviewData(response.data);
                console.log('✅ Review data loaded:', response.data);
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

    // Calculate rating distribution for the bar chart
    const getRatingDistribution = () => {
        if (!reviewData?.reviews.length) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const totalReviews = reviewData.reviews.length;

        reviewData.reviews.forEach(review => {
            const overallRating = Math.round(getOverallRating(review.criteriaRatings));
            if (overallRating >= 1 && overallRating <= 5) {
                distribution[overallRating as keyof typeof distribution]++;
            }
        });

        // Convert to percentages
        Object.keys(distribution).forEach(key => {
            const rating = parseInt(key) as keyof typeof distribution;
            distribution[rating] = Math.round((distribution[rating] / totalReviews) * 100);
        });

        return distribution;
    };

    // Get average overall rating
    const getAverageRating = (): number => {
        if (!reviewData?.reviews.length) return 0;
        
        const sum = reviewData.reviews.reduce((acc, review) => {
            return acc + getOverallRating(review.criteriaRatings);
        }, 0);
        
        return sum / reviewData.reviews.length;
    };

    // Get paginated reviews
    const getPaginatedReviews = () => {
        if (!reviewData?.reviews.length) return [];
        
        const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
        const endIndex = startIndex + REVIEWS_PER_PAGE;
        return reviewData.reviews.slice(startIndex, endIndex);
    };

    // Calculate total pages
    const getTotalPages = () => {
        if (!reviewData?.reviews.length) return 0;
        return Math.ceil(reviewData.reviews.length / REVIEWS_PER_PAGE);
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        // Scroll to top of reviews section
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle like/dislike review with optimistic update
    const handleLikeReview = async (reviewId: string, action: 'like' | 'dislike') => {
        if (!session) {
            toast.error('Please login to react to reviews');
            return;
        }

        const currentReview = reviewData?.reviews.find(r => r._id === reviewId);
        if (!currentReview || !reviewData) return;

        const originalReviewData = {
            ...reviewData,
            reviews: [...reviewData.reviews]
        };

        const updatedReviews = reviewData.reviews.map(review => {
            if (review._id === reviewId) {
                let newLikes = review.likes;
                let newDislikes = review.dislikes;
                let newUserLiked = review.userLiked;
                let newUserDisliked = review.userDisliked;

                if (action === 'like') {
                    if (review.userLiked) {
                        newLikes = Math.max(0, newLikes - 1);
                        newUserLiked = false;
                    } else {
                        newLikes = newLikes + 1;
                        newUserLiked = true;
                        
                        if (review.userDisliked) {
                            newDislikes = Math.max(0, newDislikes - 1);
                            newUserDisliked = false;
                        }
                    }
                } else {
                    if (review.userDisliked) {
                        newDislikes = Math.max(0, newDislikes - 1);
                        newUserDisliked = false;
                    } else {
                        newDislikes = newDislikes + 1;
                        newUserDisliked = true;
                        
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

        setReviewData({
            ...reviewData,
            reviews: updatedReviews
        });

        try {
            await programReviewAPI.likeReview(reviewId, action);
        } catch (error: any) {
            console.error(`Error ${action}ing review:`, error);
            setReviewData(originalReviewData);
            toast.error(`Failed to ${action} review`);
        }
    };

    console.log('🎨 Rendering review component. Loading:', loading, 'ReviewData:', reviewData);

    if (loading) {
        return (
            <div className="bg-[#1f2021] rounded-xl p-8 border border-[#36454F]">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                    <span className="ml-3 text-gray-400">Loading reviews...</span>
                </div>
            </div>
        );
    }

    if (!reviewData || reviewData.reviews.length === 0) {
        return (
            <div className="bg-[#1f2021] rounded-xl p-8 border border-[#36454F]">
                <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to share your experience with this program.</p>
                    {session && !userReview && (
                        <Button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Write a Review
                        </Button>
                    )}
                </div>
                {showReviewForm && (
                    <ProgramReviewForm
                        programId={programId}
                        programName={programName}
                        isOpen={showReviewForm}
                        onClose={() => setShowReviewForm(false)}
                        onSuccess={handleReviewSuccess}
                    />
                )}
            </div>
        );
    }

    const ratingDistribution = getRatingDistribution();
    const averageRating = getAverageRating();
    const totalReviews = reviewData.reviews.length;
    const totalPages = getTotalPages();
    const paginatedReviews = getPaginatedReviews();

    console.log('📊 Rating distribution:', ratingDistribution);
    console.log('⭐ Average rating:', averageRating);

    return (
        <div id="reviews-section" className="space-y-6">
            {/* Overall Rating Section */}
            <div className="bg-[#1f2021] rounded-xl p-8 border border-[#36454F]">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left side - Overall Score */}
                    <div className="flex flex-col items-center lg:items-start">
                        <div className="flex items-baseline mb-2">
                            <span className="text-6xl font-bold text-white">{averageRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            {[1, 2, 3, 4].map(star => (
                                <StarIcon 
                                    key={star} 
                                    className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
                                />
                            ))}
                            <StarIcon 
                                className={`w-6 h-6 ${5 <= Math.round(averageRating) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
                            />
                        </div>
                        <p className="text-gray-400 text-lg">{totalReviews} reviews</p>
                    </div>

                    {/* Right side - Rating Breakdown */}
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-white w-2">{rating}</span>
                                <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                        style={{ width: `${ratingDistribution[rating as keyof typeof ratingDistribution]}%` }}
                                    />
                                </div>
                                <span className="text-gray-400 text-sm w-8">{ratingDistribution[rating as keyof typeof ratingDistribution]}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filter Reviews Section */}
            <div className="bg-[#1f2021] rounded-xl p-6 border border-[#36454F]">
                <h3 className="text-2xl font-bold text-white mb-4">Filter Reviews</h3>
                <div className="flex flex-wrap gap-4">
                    {/* Rating Filter */}
                    <div className="relative">
                        <select 
                            value={filter.rating}
                            onChange={(e) => setFilter({...filter, rating: e.target.value})}
                            className="appearance-none bg-[#36454F] text-white px-4 py-2 pr-8 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
                        >
                            <option value="All">Rating</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <select 
                            value={filter.date}
                            onChange={(e) => setFilter({...filter, date: e.target.value})}
                            className="appearance-none bg-[#36454F] text-white px-4 py-2 pr-8 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
                        >
                            <option value="Newest">Date</option>
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Helpfulness Filter */}
                    <div className="relative">
                        <select 
                            value={filter.helpfulness}
                            onChange={(e) => setFilter({...filter, helpfulness: e.target.value})}
                            className="appearance-none bg-[#36454F] text-white px-4 py-2 pr-8 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
                        >
                            <option value="Most Helpful">Helpfulness</option>
                            <option value="Most Helpful">Most Helpful</option>
                            <option value="Least Helpful">Least Helpful</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
                {paginatedReviews.map((review, index) => {
                    const overallRating = getOverallRating(review.criteriaRatings);
                    
                    return (
                        <div key={review._id} className="bg-[#1f2021] rounded-xl p-6 border border-[#36454F]">
                            {/* Review Header */}
                            <div className="flex items-start gap-4 mb-4">
                                {/* User Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                    {review.user.fullName ? review.user.fullName.charAt(0).toUpperCase() : 'A'}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-white text-lg">
                                                {review.user.fullName || 'Anonymous'}
                                            </h4>
                                            <p className="text-gray-400 text-sm">{formatDate(review.createdAt)}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Star Rating */}
                                    <div className="flex items-center mt-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <StarIcon 
                                                key={star} 
                                                className={`w-5 h-5 ${star <= Math.round(overallRating) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mb-4">
                                <p className="text-gray-300 leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>

                            {/* Like/Dislike Buttons */}
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => handleLikeReview(review._id, 'like')}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                                        review.userLiked 
                                            ? 'bg-green-600/20 text-green-400' 
                                            : 'text-gray-400 hover:text-green-400 hover:bg-green-600/10'
                                    }`}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{review.likes}</span>
                                </button>
                                
                                <button
                                    onClick={() => handleLikeReview(review._id, 'dislike')}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                                        review.userDisliked 
                                            ? 'bg-red-600/20 text-red-400' 
                                            : 'text-gray-400 hover:text-red-400 hover:bg-red-600/10'
                                    }`}
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>{review.dislikes}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="border-[#36454F] text-gray-300 hover:bg-[#36454F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <Button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                className={
                                    currentPage === pageNum
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                        : "border-[#36454F] text-gray-300 hover:bg-[#36454F] hover:text-white"
                                }
                                size="sm"
                            >
                                {pageNum}
                            </Button>
                        ))}
                    </div>

                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="border-[#36454F] text-gray-300 hover:bg-[#36454F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* Pagination Info */}
            {totalPages > 1 && (
                <div className="text-center text-gray-400 text-sm">
                    Showing {((currentPage - 1) * REVIEWS_PER_PAGE) + 1} to {Math.min(currentPage * REVIEWS_PER_PAGE, totalReviews)} of {totalReviews} reviews
                </div>
            )}

            {/* Add Review Button */}
            {session && !userReview && (
                <div className="text-center">
                    <Button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Write a Review
                    </Button>
                </div>
            )}

            {/* Review Form Modal */}
            {showReviewForm && (
                <ProgramReviewForm
                    programId={programId}
                    programName={programName}
                    isOpen={showReviewForm}
                    onClose={() => setShowReviewForm(false)}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
};

export default ProgramReviewDisplay; 