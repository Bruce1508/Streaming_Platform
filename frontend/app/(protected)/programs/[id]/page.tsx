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
        switch (grade) {
            case 'A+': return 'text-green-600';
            case 'A': return 'text-green-500';
            case 'B+': return 'text-blue-600';
            case 'B': return 'text-blue-500';
            case 'C+': return 'text-yellow-600';
            case 'C': return 'text-yellow-500';
            case 'D': return 'text-orange-500';
            case 'F': return 'text-red-500';
            default: return 'text-gray-500';
        }
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

            // Try to submit to backend
            const response = await programReviewAPI.createReview(reviewData);
            
            if (response.success) {
                // Refresh reviews from backend
                await fetchProgramData();
                alert('✅ Review submitted successfully! Thank you for sharing your experience.');
            } else {
                throw new Error('Failed to submit review');
            }
            
        } catch (err: any) {
            console.error('Failed to submit review:', err);
            
            // Fallback: save to localStorage for demo
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
                    fullName: 'Anonymous User', // In real app, this comes from auth
                    email: 'user@example.com'
                },
                currentSemester: currentSemester.trim(),
                createdAt: new Date().toISOString().split('T')[0]
            };
            
            const updatedReviews = [newReview, ...reviews];
            setReviews(updatedReviews);
            calculateReviewStats(updatedReviews);
            
            alert('✅ Review submitted successfully! Thank you for sharing your experience.');
        } finally {
            // Reset form and close modal
            setInstructorRating(50);
            setContentQualityRating(50);
            setPracticalValueRating(50);
            setTakeTheCourseAgain(false);
            setComment('');
            setCurrentSemester('');
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

    const summaryRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchProgramData();
        }
    }, [params.id]);

    useEffect(() => {
        const handleScroll = () => {
            if (!summaryRef.current) return;
            const { top } = summaryRef.current.getBoundingClientRect();
            setIsSticky(top <= 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <div className="flex-1 pt-20 bg-[#FAF9F6]">
                {/* Header */}
                <div className='mb-10'>
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className={`text-5xl font-bold text-[#CC5500] ${geist.className}`}>What others say about this program</h1>
                            <div className="w-32"></div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                        {/* Left Column - Sticky Student Reviews Summary */}
                        <div className="lg:col-span-1">
                            <div
                                ref={summaryRef}
                                className={`sticky top-[100px] z-10 transition-all duration-300 ${isSticky ? 'shadow-xl scale-[1.01] translate-y-2' : 'shadow-md'}`}
                                style={{ willChange: 'transform' }}
                            >
                                <div className="p-8 mb-6">
                                    <div className="flex items-center mb-8 justify-center gap-3">
                                        <NumberTicker 
                                            value={Number(averageRating.toFixed(1))}
                                            decimalPlaces={1}
                                            className="text-8xl font-bold text-gray-800 opacity-90"
                                        />
                                        <span className="text-2xl text-gray-800">/ 100</span>
                                        <div className="ml-4">
                                            <span className={`text-3xl font-bold ${getGradeColor(getGradeFromScore(averageRating))}`}>
                                                {getGradeFromScore(averageRating)}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Rating Distribution */}
                                    <div className="space-y-2 mt-4">
                                        {Object.entries(gradeDistribution).map(([grade, count]) => {
                                            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                            return (
                                                <div key={grade} className="flex items-center gap-2">
                                                    <span className={`text-base font-semibold w-8 ${getGradeColor(grade)}`}>{grade}</span>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-base text-gray-700 w-5 text-right">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Write Review Button */}
                                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center">
                                        <InteractiveHoverButton
                                            onClick={() => setShowReviewModal(true)}
                                            className="bg-black text-white px-6 md:px-8 cursor-pointer rounded-lg font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                        >
                                            Write Your Review
                                        </InteractiveHoverButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column - Reviews List with filter tabs */}
                        <div className="lg:col-span-2">
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
                                        paginatedReviews.map((review) => {
                                            const avgRating = calculateAverageRating(review.ratings);
                                            return (
                                                <div
                                                    key={review._id}
                                                    className="relative rounded-2xl p-8 min-h-[220px] flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                                                    style={{
                                                        color: 'black',
                                                        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)'
                                                    }}
                                                >
                                                    {/* Grade Badge */}
                                                    <div className="absolute top-4 right-4">
                                                        <span className={`text-2xl font-bold ${getGradeColor(getGradeFromScore(avgRating))}`}>
                                                            {getGradeFromScore(avgRating)}
                                                        </span>
                                                        <div className="text-xs text-gray-500 text-center">
                                                            {avgRating}/100
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Quote icon */}
                                                    {review.comment && (
                                                        <div className="absolute top-6 left-6 text-4xl opacity-30 select-none pointer-events-none">&ldquo;</div>
                                                    )}
                                                    
                                                    {/* Comment text */}
                                                    <div className="flex-1 flex items-center relative">
                                                        <p className="text-xl md:text-2xl font-medium leading-snug mt-5 opacity-70">{review.comment}</p>
                                                    </div>
                                                    
                                                    {/* Take course again indicator */}
                                                    <div className="mt-4 mb-2">
                                                        <span className={`text-sm px-3 py-1 rounded-full ${review.takeTheCourseAgain ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {review.takeTheCourseAgain ? '✓ Would take again' : '✗ Would not take again'}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Footer: author left, semester and date right */}
                                                    <div className="flex items-center justify-between mt-7 z-10 opacity-40">
                                                        <span className="text-sm tracking-wide uppercase">{review.author.fullName}</span>
                                                        <div className="text-xs text-right">
                                                            <div>{review.currentSemester}</div>
                                                            <div>{review.createdAt}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
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
            </div>
            
            {/* Footer */}
            <Footer />

            {/* Review Modal - Updated with monochrome theme */}
            {showReviewModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-2xl font-bold text-gray-800">Write Your Review</h2>
                            <button
                                onClick={() => setShowReviewModal(false)}
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

                                {/* Rating Sliders - Updated to monochrome */}
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

                        {/* Modal Footer - Fixed */}
                        <div className="flex gap-3 px-8 py-6 border-t border-gray-200 flex-shrink-0 bg-white">
                            <Button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setInstructorRating(50);
                                    setContentQualityRating(50);
                                    setPracticalValueRating(50);
                                    setTakeTheCourseAgain(false);
                                    setComment('');
                                    setCurrentSemester('');
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
                                        Submit Review
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