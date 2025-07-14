'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import { programReviewAPI } from '@/lib/api';
import { 
    CriteriaRatings, 
    CRITERIA_LABELS, 
    CRITERIA_DESCRIPTIONS 
} from '@/types/ProgramReview';

interface ProgramScoreOverviewProps {
    programId: string;
    schoolName: string;
    hideIfNoReview?: boolean;
}

const ProgramScoreOverview: React.FC<ProgramScoreOverviewProps> = ({
    programId,
    schoolName,
    hideIfNoReview
}) => {
    const [averages, setAverages] = useState<(CriteriaRatings & { totalReviews: number }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAllDetails, setShowAllDetails] = useState(false);

    useEffect(() => {
        fetchAverages();
    }, [programId]);

    const fetchAverages = async () => {
        try {
            setLoading(true);
            const response = await programReviewAPI.getProgramReviews(programId);
            if (response.success) {
                setAverages(response.data.averages);
            }
        } catch (error) {
            console.error('Error fetching averages:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOverallScore = () => {
        if (!averages) return 0;
        
        const criteria = [
            'TeachingQuality', 'FacultySupport', 'LearningEnvironment',
            'LibraryResources', 'StudentSupport', 'CampusLife', 'OverallExperience'
        ] as const;
        
        const sum = criteria.reduce((acc, criterion) => acc + (averages[criterion] || 0), 0);
        return (sum / criteria.length);
    };

    const getMainCriteria = () => {
        return ['TeachingQuality', 'FacultySupport', 'LearningEnvironment'] as const;
    };

    const getAdditionalCriteria = () => {
        return ['LibraryResources', 'StudentSupport', 'CampusLife', 'OverallExperience'] as const;
    };

    if (loading || !averages) {
        if (hideIfNoReview) return null;
        return (
            <div className="bg-[#1f2021] rounded-2xl p-6 border border-[#36454F]">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                    <div className="h-12 bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const overallScore = calculateOverallScore();

    return (
        <div className="bg-[#1f2021] rounded-2xl p-6 border border-[#36454F] shadow-lg">
            {/* Overall Score */}
            <div className="mb-8 flex flex-col items-center justify-center">
                <div className="flex items-end mb-2">
                    <span className="text-7xl md:text-8xl font-extrabold text-amber-500 drop-shadow-lg">
                        {overallScore.toFixed(1)}
                    </span>
                    <span className="text-2xl md:text-4xl text-gray-400 ml-2 font-semibold mb-2">
                        /5
                    </span>
                </div>
                <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                            key={star} 
                            className={`w-6 h-6 ${star <= Math.round(overallScore) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
                        />
                    ))}
                </div>
                <div className="text-gray-400 text-lg font-medium">
                    {averages && averages.totalReviews} Review{averages && averages.totalReviews !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-700 mb-6" />

            {/* Ratings Details */}
            <h3 className="text-xl font-bold text-white mb-6 text-center">
                School Ratings & Details
            </h3>

            {/* Main Criteria */}
            <div className="space-y-4 mb-4">
                {getMainCriteria().map((criterion) => {
                    const rating = averages && averages[criterion] || 0;
                    const label = CRITERIA_LABELS[criterion];
                    const description = CRITERIA_DESCRIPTIONS[criterion];
                    
                    return (
                        <div key={criterion} className="space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white text-base">
                                        {label}
                                    </h4>
                                    <p className="text-sm text-gray-400 mb-3">
                                        {description}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star 
                                                key={star} 
                                                className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-amber-400 font-semibold text-sm">
                                        {rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Additional Criteria (collapsible) */}
            {showAllDetails && (
                <div className="space-y-4 mb-4">
                    {getAdditionalCriteria().map((criterion) => {
                        const rating = averages && averages[criterion] || 0;
                        const label = CRITERIA_LABELS[criterion];
                        const description = CRITERIA_DESCRIPTIONS[criterion];
                        
                        return (
                            <div key={criterion} className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white text-base">
                                            {label}
                                        </h4>
                                        <p className="text-sm text-gray-400">
                                            {description}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star 
                                                    key={star} 
                                                    className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
                                                />
                                            ))}
                                        </div>
                                        <span className="text-amber-400 font-semibold text-sm">
                                            {rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Show All Details Button */}
            <button
                onClick={() => setShowAllDetails(!showAllDetails)}
                className="w-full text-center py-2 text-amber-400 hover:text-amber-300 
                          font-medium text-sm transition-colors flex items-center justify-center"
            >
                {showAllDetails ? (
                    <>
                        Show Less Details
                        <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                ) : (
                    <>
                        Show All Details
                        <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                )}
            </button>
        </div>
    );
};

export default ProgramScoreOverview; 