'use client';

import React, { useState, useEffect } from 'react';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { useRouter } from 'next/navigation';
import { programAPI } from '@/lib/api';

interface ReviewSummaryProps {
    totalReviews: number;
    averageRating: number;
    gradeDistribution: Record<string, number>;
    userReview: any | null;
    onOpenReviewModal: () => void;
    reviews: Array<{
        ratings: {
            instructorRating: number;
            contentQualityRating: number;
            practicalValueRating: number;
        };
        takeTheCourseAgain: boolean;
    }>;
    program?: {
        _id: string;
        name: string;
        credential: string;
        school: string;
    };
}

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

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
    totalReviews,
    averageRating,
    gradeDistribution,
    userReview,
    onOpenReviewModal,
    reviews,
    program
}) => {
    const router = useRouter();
    const [similarPrograms, setSimilarPrograms] = useState<any[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    const maxCount = Math.max(...Object.values(gradeDistribution));

    // Function to get random programs from database
    const getRandomPrograms = async (excludeId: string, count: number = 3) => {
        try {
            // Get random programs from database
            const response = await programAPI.getPrograms({ 
                limit: 10, // Get more to have variety
                page: Math.floor(Math.random() * 3) + 1 // Random page to get different results
            });
            
            console.log('Random programs response:', response.data);
            
            // Handle different response structures
            let programs = response.data?.data?.data || response.data?.data || [];
            console.log('Programs found:', programs.length);
            
            // Filter out current program
            programs = programs.filter((p: any) => p._id !== excludeId);
            
            // Shuffle and return requested count
            const shuffled = programs.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        } catch (error) {
            console.error('Error fetching random programs:', error);
            return [];
        }
    };

    // Fetch similar programs
    useEffect(() => {
        if (!program) return;

        setLoadingSimilar(true);
        
        // Extract keywords from program name
        const keywords = program.name.split(' ').filter(word => 
            word.length > 2 && !['and', 'the', 'of', 'in', 'for', 'with'].includes(word.toLowerCase())
        );

        // Try to find similar programs
        const fetchSimilarPrograms = async () => {
            try {
                // First attempt: search by credential and keywords
                let searchQuery = keywords.slice(0, 2).join(' '); // Use first 2 keywords
                console.log('Searching for similar programs with query:', searchQuery, 'credential:', program.credential);
                
                let response = await programAPI.searchPrograms({ 
                    q: searchQuery,
                    credential: program.credential,
                    limit: 10 
                });

                console.log('Search response:', response.data);
                let programs = response.data?.data?.data || response.data?.data || [];
                console.log('Found programs from search:', programs.length);
                
                // Filter out current program
                programs = programs.filter((p: any) => p._id !== program._id);

                // If less than 2 programs, try broader search
                if (programs.length < 2) {
                    console.log('Not enough programs, trying broader search with:', keywords[0]);
                    response = await programAPI.searchPrograms({ 
                        q: keywords[0], // Use only first keyword
                        limit: 10 
                    });
                    programs = response.data?.data?.data || response.data?.data || [];
                    programs = programs.filter((p: any) => p._id !== program._id);
                    console.log('Broader search found:', programs.length);
                }

                // If still less than 3, get random programs from database
                if (programs.length < 3) {
                    const needed = 3 - programs.length;
                    const randomPrograms = await getRandomPrograms(program._id, needed);
                    programs = [...programs, ...randomPrograms];
                }

                setSimilarPrograms(programs.slice(0, 3));
            } catch (error) {
                console.error('Error fetching similar programs:', error);
                // Use random programs from database on error
                const randomPrograms = await getRandomPrograms(program._id, 3);
                setSimilarPrograms(randomPrograms);
            } finally {
                setLoadingSimilar(false);
            }
        };

        fetchSimilarPrograms();
    }, [program]);

    // Calculate would take again percentage from real data
    const wouldTakeAgain = reviews.length > 0 ? Math.round((reviews.filter(r => r.takeTheCourseAgain).length / reviews.length) * 100) : 0;
    // Calculate level of difficulty (average of all review averages, mapped to 1-5 scale)
    const levelOfDifficulty = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + ((r.ratings.instructorRating + r.ratings.contentQualityRating + r.ratings.practicalValueRating) / 3), 0) / reviews.length / 20).toFixed(1) : '-';

    return (
        <div className="w-full bg-white p-8 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row gap-10 px-4">
                {/* Left column: Average rating and stats */}
                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="flex items-end gap-3 mb-2">
                        {totalReviews === 0 ? (
                            <>
                                <span className="text-7xl font-bold text-gray-400">-</span>
                                <span className="text-2xl text-gray-400 mb-2">/ 100</span>
                            </>
                        ) : (
                            <>
                                <NumberTicker 
                                    value={Number(averageRating.toFixed(1))}
                                    decimalPlaces={1}
                                    className="text-7xl font-bold text-gray-800"
                                />
                                <span className="text-2xl text-gray-600 mb-2">/ 100</span>
                            </>
                        )}
                    </div>
                    <div className="mb-4 text-center">
                        <p className="text-lg text-gray-700">
                            Overall ratings out of <span className="font-semibold underline cursor-pointer">{totalReviews} ratings</span>
                        </p>
                    </div>
                    <div className="flex gap-8 mb-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-800">{wouldTakeAgain}%</div>
                            <div className="text-sm text-gray-500">Would take again</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-800">{levelOfDifficulty}</div>
                            <div className="text-sm text-gray-500">Level of Difficulty</div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <InteractiveHoverButton
                            onClick={onOpenReviewModal}
                            className="bg-black text-white px-8 py-3 cursor-pointer rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                        >
                            {userReview ? 'View your comment' : 'Write Your Review'}
                        </InteractiveHoverButton>
                    </div>
                </div>
                {/* Right column: Bar chart and similar courses */}
                <div className="flex-1 flex flex-col justify-start pt-4">
                    {/* Bar chart */}
                    <div className="space-y-2 mb-8">
                        {Object.entries(gradeDistribution).map(([grade, count]) => {
                            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                            return (
                                <div key={grade} className="flex items-center gap-2">
                                    <span className={`text-xs sm:text-base font-semibold w-6 sm:w-8 text-gray-800`}>{grade}</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                                        <div
                                            className={`rounded-full transition-all duration-300 ${count > 0 ? 'bg-gray-700' : 'bg-gray-300'}`}
                                            style={{ width: `${percentage}%`, height: '1rem' }}
                                        ></div>
                                    </div>
                                    <span className="text-xs sm:text-base text-gray-700 w-4 sm:w-5 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Similar Programs section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Similar Programs</h3>
                        {loadingSimilar ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-500">Finding similar programs...</span>
                            </div>
                        ) : similarPrograms.length === 0 ? (
                            <div className="text-gray-500 italic py-4">
                                No similar programs found. Debug: program={program?.name || 'none'}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {similarPrograms.map((prog) => {
                                    const rating = prog.averageRating ? (prog.averageRating / 20).toFixed(1) : prog.averageRating?.toFixed(1) || '-';
                                    return (
                                        <div 
                                            key={prog._id}
                                            onClick={() => router.push(`/programs/${prog._id}`)}
                                            className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        >
                                            <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm mr-3">
                                                {rating}
                                            </div>
                                            <div className="text-gray-800 font-medium">
                                                {prog.name} - {prog.school}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 