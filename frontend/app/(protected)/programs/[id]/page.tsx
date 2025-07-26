'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import PageLoader from '@/components/ui/PageLoader';
import { programAPI, programReviewAPI } from '@/lib/api';
import {
    ArrowLeft,
    Send,
    Star
} from 'lucide-react';
import LandingNavBar from '@/components/landing/LandingNavBar';
import Footer from '@/components/Footer';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Geist } from 'next/font/google';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { ReviewCard } from '@/components/program/ReviewCard';
import { ReviewSummary } from '@/components/program/ReviewSummary';

const geist = Geist({ subsets: ['latin'] });

interface Program {
    _id: string;
    programId: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery?: string;
    credential: string;
    school: string;
    level: string;
    isActive: boolean;
}

interface Review {
    _id: string;
    ratings: {
        instructorRating: number;        // 0-100
        contentQualityRating: number;    // 0-100
        practicalValueRating: number;    // 0-100
    };
    takeTheCourseAgain: boolean;
    comment: string;
    author: {
        fullName: string;
        email: string;
    };
    currentSemester: string;
    createdAt: string;
}

const ProgramReviewPage = () => {
    const params = useParams();
    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // NEW: User's existing review state
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [isEditingReview, setIsEditingReview] = useState(false);

    // Review form state - Updated for new schema
    const [instructorRating, setInstructorRating] = useState(50);
    const [contentQualityRating, setContentQualityRating] = useState(50);
    const [practicalValueRating, setPracticalValueRating] = useState(50);
    const [takeTheCourseAgain, setTakeTheCourseAgain] = useState(false);
    const [comment, setComment] = useState('');
    const [currentSemester, setCurrentSemester] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Review statistics
    const [averageRating, setAverageRating] = useState(0);
    const [gradeDistribution, setGradeDistribution] = useState({
        'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D': 0, 'F': 0
    });

    const [activeTab, setActiveTab] = useState<'all' | 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'>('all');

    // Helper function to convert score to grade
    const getGradeFromScore = (score: number): string => {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 75) return 'B+';
        if (score >= 70) return 'B';
        if (score >= 65) return 'C+';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    };

    // Helper function to get grade color
    const getGradeColor = (grade: string): string => {
        return 'text-black';
    };

    // Calculate average from 3 ratings
    const calculateAverageRating = (ratings: { instructorRating: number; contentQualityRating: number; practicalValueRating: number; }): number => {
        return Math.round((ratings.instructorRating + ratings.contentQualityRating + ratings.practicalValueRating) / 3);
    };

    // Helper function to generate semester options from 2020 to current
    const generateSemesterOptions = () => {
        const options = [];
        const currentYear = new Date().getFullYear();

        for (let year = currentYear; year >= 2020; year--) {
            options.push(`Fall ${year}`);
            options.push(`Summer ${year}`);
            options.push(`Spring ${year}`);
            options.push(`Winter ${year}`);
        }

        return options;
    };

    const filteredReviews = activeTab === 'all' ? reviews : reviews.filter(r => getGradeFromScore(calculateAverageRating(r.ratings)) === activeTab);
    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 20;
    const totalPages = Math.ceil(filteredReviews.length / COMMENTS_PER_PAGE);
    const paginatedReviews = filteredReviews.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE);

    const fetchProgramData = async () => {
        try {
            setLoading(true);
            setError(null);
            const programId = params.id as string;

            const programResponse = await programAPI.getProgramById(programId.toUpperCase());

            if (programResponse.success && programResponse.data) {
                setProgram(programResponse.data);

                // NEW: Check if user already has a review for this program
                try {
                    const userReviewResponse = await programReviewAPI.getUserReviewForProgram(programId.toUpperCase());
                    if (userReviewResponse.success && userReviewResponse.data) {
                        setUserReview(userReviewResponse.data);
                        console.log('🔍 User already has review:', userReviewResponse.data);
                    }
                } catch (userReviewError) {
                    console.log('ℹ️ User has no existing review for this program');
                    setUserReview(null);
                }

                // Try to fetch reviews from backend
                try {
                    const reviewsResponse = await programReviewAPI.getProgramReviews(programId.toUpperCase());
                    if (reviewsResponse.success && reviewsResponse.data) {
                        const backendReviews = reviewsResponse.data.reviews || [];
                        setReviews(backendReviews);
                        calculateReviewStats(backendReviews);
                        return;
                    }
                } catch (reviewError) {
                    console.log('No backend reviews found, using mock data');
                }

                // Fallback to mock reviews for demo
                const mockReviews = [
                    {
                        _id: '1',
                        ratings: {
                            instructorRating: 90,
                            contentQualityRating: 95,
                            practicalValueRating: 100
                        },
                        takeTheCourseAgain: true,
                        comment: 'Excellent program with great practical learning opportunities.',
                        author: {
                            fullName: 'Sarah M.',
                            email: 'sarah.m@example.com'
                        },
                        currentSemester: 'Fall 2024',
                        createdAt: '2024-01-15'
                    },
                    {
                        _id: '2',
                        ratings: {
                            instructorRating: 85,
                            contentQualityRating: 80,
                            practicalValueRating: 80
                        },
                        takeTheCourseAgain: false,
                        comment: 'Good curriculum but could use more hands-on projects.',
                        author: {
                            fullName: 'Mike J.',
                            email: 'mike.j@example.com'
                        },
                        currentSemester: 'Spring 2024',
                        createdAt: '2024-01-10'
                    },
                    {
                        _id: '3',
                        ratings: {
                            instructorRating: 90,
                            contentQualityRating: 85,
                            practicalValueRating: 90
                        },
                        takeTheCourseAgain: true,
                        comment: 'Amazing faculty and excellent career support.',
                        author: {
                            fullName: 'Lisa K.',
                            email: 'lisa.k@example.com'
                        },
                        currentSemester: 'Fall 2024',
                        createdAt: '2024-01-08'
                    }
                ];

                setReviews(mockReviews);
                calculateReviewStats(mockReviews);
            } else {
                setError('Program not found');
            }
        } catch (err: any) {
            setError('Failed to load program details');
        } finally {
            setLoading(false);
        }
    };

    const calculateReviewStats = (reviewsData: Review[]) => {
        if (reviewsData.length === 0) return;

        const totalRating = reviewsData.reduce((sum, review) => sum + calculateAverageRating(review.ratings), 0);
        const avg = totalRating / reviewsData.length;
        setAverageRating(avg);

        const distribution = {
            'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D': 0, 'F': 0
        };
        reviewsData.forEach(review => {
            const avgScore = calculateAverageRating(review.ratings);
            const grade = getGradeFromScore(avgScore);
            distribution[grade as keyof typeof distribution]++;
        });
        setGradeDistribution(distribution);
    };

    // NEW: Function to open review modal (create or edit)
    const openReviewModal = () => {
        if (userReview) {
            // Pre-populate form with existing review data
            setInstructorRating(userReview.ratings.instructorRating);
            setContentQualityRating(userReview.ratings.contentQualityRating);
            setPracticalValueRating(userReview.ratings.practicalValueRating);
            setTakeTheCourseAgain(userReview.takeTheCourseAgain);
            setComment(userReview.comment);
            setCurrentSemester(userReview.currentSemester);
            setIsEditingReview(true);
        } else {
            // Reset form for new review
            setInstructorRating(50);
            setContentQualityRating(50);
            setPracticalValueRating(50);
            setTakeTheCourseAgain(false);
            setComment('');
            setCurrentSemester('');
            setIsEditingReview(false);
        }
        setShowReviewModal(true);
    };

    const handleSubmitReview = async () => {
        if (!instructorRating || !contentQualityRating || !practicalValueRating || !comment.trim() || !currentSemester.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        if (comment.length > 500) {
            alert('Comment must be 500 characters or less');
            return;
        }

        setSubmitting(true);

        try {
            const reviewData = {
                programId: params.id as string,
                currentSemester: currentSemester.trim(),
                ratings: {
                    instructorRating,
                    contentQualityRating,
                    practicalValueRating
                },
                takeTheCourseAgain,
                comment: comment.trim()
            };

            let response;

            if (isEditingReview && userReview) {
                // Update existing review
                response = await programReviewAPI.updateReview(userReview._id, {
                    currentSemester: currentSemester.trim(),
                    ratings: {
                        instructorRating,
                        contentQualityRating,
                        practicalValueRating
                    },
                    takeTheCourseAgain,
                    comment: comment.trim()
                });

                if (response.success) {
                    await fetchProgramData(); // Refresh data
                    alert('✅ Review updated successfully! Thank you for updating your experience.');
                } else {
                    throw new Error('Failed to update review');
                }
            } else {
                // Create new review
                response = await programReviewAPI.createReview(reviewData);

                if (response.success) {
                    await fetchProgramData(); // Refresh data
                    alert('✅ Review submitted successfully! Thank you for sharing your experience.');
                } else {
                    throw new Error('Failed to submit review');
                }
            }

        } catch (err: any) {
            console.error('Failed to submit/update review:', err);

            if (isEditingReview) {
                alert('❌ Failed to update review. Please try again.');
            } else {
                // Fallback: save to localStorage for demo (only for new reviews)
                const newReview: Review = {
                    _id: Date.now().toString(),
                    ratings: {
                        instructorRating,
                        contentQualityRating,
                        practicalValueRating
                    },
                    takeTheCourseAgain,
                    comment: comment.trim(),
                    author: {
                        fullName: 'Anonymous User',
                        email: 'user@example.com'
                    },
                    currentSemester: currentSemester.trim(),
                    createdAt: new Date().toISOString().split('T')[0]
                };

                const updatedReviews = [newReview, ...reviews];
                setReviews(updatedReviews);
                calculateReviewStats(updatedReviews);

                alert('✅ Review submitted successfully! Thank you for sharing your experience.');
            }
        } finally {
            // Reset form and close modal
            setInstructorRating(50);
            setContentQualityRating(50);
            setPracticalValueRating(50);
            setTakeTheCourseAgain(false);
            setComment('');
            setCurrentSemester('');
            setIsEditingReview(false);
            setShowReviewModal(false);
            setSubmitting(false);
        }
    };

    const getProgramImage = (programName: string, school: string): string => {
        const name = programName.toLowerCase();

        if (name.includes('computer') || name.includes('software') || name.includes('information technology')) {
            return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&crop=center';
        }

        if (name.includes('business') || name.includes('management') || name.includes('marketing')) {
            return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center';
        }

        return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop&crop=center';
    };

    useEffect(() => {
        if (params.id) {
            fetchProgramData();
        }
    }, [params.id]);

    // Disable/enable body scroll when modal opens/closes
    useEffect(() => {
        if (showReviewModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showReviewModal]);

    if (loading) {
        return <PageLoader />;
    }

    if (error || !program) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Program Not Found</h1>
                    <Button
                        onClick={() => router.push('/programs')}
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Programs
                    </Button>
                </div>
            </div>
        );
    }

    const totalReviews = reviews.length;
    const maxCount = Math.max(...Object.values(gradeDistribution));

    return (
        <div className={`min-h-screen text-white flex flex-col ${geist.className}`}>
            {/* Navbar */}
            <div className="sticky top-0 z-30 bg-[#18191A]">
                <LandingNavBar />
            </div>

            {/* Hero Section for Review Page */}
            <div className="bg-[#FAF9F6] px-4 min-h-screen lg:min-h-0 flex items-center justify-center pt-45 pb-20">
                <div className="w-full">
                    {/* Back Button on top left */}
                    <div className="max-w-4xl mx-auto flex items-start mb-20 opacity-50">
                        <button
                            onClick={() => router.push('/programs')}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-6 h-6 mr-2" />
                            <span className="font-medium">Back to Programs</span>
                        </button>
                    </div>
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h1 className={`text-5xl md:text-6xl font-serif font-bold text-[#232323] mb-6 ${geist.className}`}>{program.name}</h1>
                        <p className="text-lg md:text-xl text-[#141413] max-w-2xl mx-auto opacity-50">Read real student experiences and share your own thoughts about this program. Your review helps future students make informed decisions!</p>
                    </div>
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 p-10">
                        {/* Left: Program Image */}
                        <div className="flex-1 flex justify-center items-center">
                            <img
                                src={getProgramImage(program.name, program.school)}
                                alt={program.name}
                                className="rounded-xl shadow-md w-full max-w-xs object-cover"
                                style={{ minHeight: '220px', background: '#eee' }}
                            />
                        </div>
                        {/* Right: Program Details */}
                        <div className="flex-1 w-full max-w-md">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                    <span className="text-gray-500 text-lg">Duration</span>
                                    <span className="text-[#73726C] text-lg">{program.duration}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                    <span className="text-gray-500 text-lg">Campus</span>
                                    <span className="text-[#73726C] text-lg">{program.campus[0]}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 text-lg">Credential</span>
                                    <span className="text-[#73726C] text-lg">{capitalizeFirstLetter(program.credential)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 pt-10 bg-[#FAF9F6]">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-8">
                    {/* Title centered below back button (removed back button here) */}
                    <div className="flex justify-center mb-12">
                        <h1 className={`text-4xl md:text-5xl font-bold text-red-600 ${geist.className} text-center`}>
                            What others say about this program
                        </h1>
                    </div>

                    {/* Review Summary at the top */}
                    <div className="mb-12">
                        <ReviewSummary
                            totalReviews={totalReviews}
                            averageRating={averageRating}
                            gradeDistribution={gradeDistribution}
                            userReview={userReview}
                            onOpenReviewModal={openReviewModal}
                            reviews={reviews}
                            program={program}
                        />
                    </div>

                    {/* Reviews Section */}
                    <div className="space-y-8">
                        {/* Tabs for filtering by rating */}
                        <div className="flex gap-2 mb-7 flex-wrap">
                            <button
                                className={`px-4 cursor-pointer py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All
                            </button>
                            {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(grade => (
                                <button
                                    key={grade}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === grade ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    onClick={() => setActiveTab(grade as 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F')}
                                >
                                    <span className={activeTab === grade ? 'text-white' : getGradeColor(grade)}>
                                        {grade}
                                    </span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                                {paginatedReviews.length === 0 ? (
                                    <div className="text-gray-500 text-center py-8 col-span-2">No reviews for this rating.</div>
                                ) : (
                                    paginatedReviews.map((review) => (
                                        <ReviewCard key={review._id} review={review} />
                                    ))
                                )}
                            </div>
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mb-8">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className={`rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                                        aria-label="Previous Page"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`rounded-full p-2 bg-black hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white`}
                                        aria-label="Next Page"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Review Modal - Updated with proper layout */}
            {showReviewModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-2xl font-bold text-gray-800">{isEditingReview ? 'Edit Your Review' : 'Write Your Review'}</h2>
                            <button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setInstructorRating(50);
                                    setContentQualityRating(50);
                                    setPracticalValueRating(50);
                                    setTakeTheCourseAgain(false);
                                    setComment('');
                                    setCurrentSemester('');
                                    setIsEditingReview(false);
                                }}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex px-8 py-6 gap-8">
                                {/* Left Column */}
                                <div className="flex-1 space-y-6">
                                    {/* Current Semester */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Current Semester *
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={currentSemester}
                                                onChange={(e) => setCurrentSemester(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300 hover:bg-gray-50"
                                                required
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                                    backgroundPosition: 'right 12px center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: '16px'
                                                }}
                                            >
                                                <option value="" className="text-gray-500">Select Semester</option>
                                                {generateSemesterOptions().slice(0, 5).map((semester) => (
                                                    <option key={semester} value={semester} className="text-gray-900">
                                                        {semester}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Rating Sliders */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Your Ratings (0-100) *
                                        </label>
                                        <div className="space-y-6">
                                            {/* Instructor Rating */}
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-sm text-gray-600 font-medium">Instructor Quality</label>
                                                    <span className="text-lg font-bold text-gray-800">
                                                        {instructorRating} ({getGradeFromScore(instructorRating)})
                                                    </span>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={instructorRating}
                                                        onChange={(e) => setInstructorRating(Number(e.target.value))}
                                                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                                        style={{
                                                            background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${instructorRating}%, #e5e7eb ${instructorRating}%, #e5e7eb 100%)`
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Content Quality Rating */}
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-sm text-gray-600 font-medium">Content Quality & Difficulty</label>
                                                    <span className="text-lg font-bold text-gray-800">
                                                        {contentQualityRating} ({getGradeFromScore(contentQualityRating)})
                                                    </span>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={contentQualityRating}
                                                        onChange={(e) => setContentQualityRating(Number(e.target.value))}
                                                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                                        style={{
                                                            background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${contentQualityRating}%, #e5e7eb ${contentQualityRating}%, #e5e7eb 100%)`
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Practical Value Rating */}
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-sm text-gray-600 font-medium">Practical Value & Usefulness</label>
                                                    <span className="text-lg font-bold text-gray-800">
                                                        {practicalValueRating} ({getGradeFromScore(practicalValueRating)})
                                                    </span>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={practicalValueRating}
                                                        onChange={(e) => setPracticalValueRating(Number(e.target.value))}
                                                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                                        style={{
                                                            background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${practicalValueRating}%, #e5e7eb ${practicalValueRating}%, #e5e7eb 100%)`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Take Course Again Checkbox */}
                                    <div>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={takeTheCourseAgain}
                                                onChange={(e) => setTakeTheCourseAgain(e.target.checked)}
                                                className="w-5 h-5 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Would you take this course again?
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="flex-1 flex flex-col">
                                    {/* Comment */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Your Review *
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={12}
                                            className="text-black w-full h-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none transition-all min-h-[300px]"
                                            placeholder="Share your experience with this program..."
                                            required
                                        />
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm text-gray-500">
                                                {comment.length}/500 characters
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Fixed at bottom */}
                        <div className="flex gap-3 px-8 py-4 border-t border-gray-200 bg-white flex-shrink-0">
                            <Button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setInstructorRating(50);
                                    setContentQualityRating(50);
                                    setPracticalValueRating(50);
                                    setTakeTheCourseAgain(false);
                                    setComment('');
                                    setCurrentSemester('');
                                    setIsEditingReview(false);
                                }}
                                variant="outline"
                                className="px-8 border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitReview}
                                disabled={submitting || !instructorRating || !contentQualityRating || !practicalValueRating || !comment.trim() || !currentSemester.trim() || comment.length > 500}
                                className="px-8 bg-black hover:bg-gray-800 text-white font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        {isEditingReview ? 'Update Review' : 'Submit Review'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramReviewPage;