'use client';

import React, { useState } from 'react';
import { X, Send, MessageSquare, Calendar, School } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import {
    CriteriaRatings,
    CreateReviewData,
    CRITERIA_LABELS,
    CRITERIA_DESCRIPTIONS
} from '@/types/ProgramReview';
import { programReviewAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface ProgramReviewFormProps {
    programId: string;
    programName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ProgramReviewForm: React.FC<ProgramReviewFormProps> = ({
    programId,
    programName,
    isOpen,
    onClose,
    onSuccess
}) => {
    const { data: session, status } = useSession();
    const currentYear = new Date().getFullYear();

    const [formData, setFormData] = useState<CreateReviewData>({
        programId,
        year: currentYear,
        criteriaRatings: {
            TeachingQuality: 0,
            FacultySupport: 0,
            LearningEnvironment: 0,
            LibraryResources: 0,
            StudentSupport: 0,
            CampusLife: 0,
            OverallExperience: 0
        },
        comment: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingChange = (criteria: keyof CriteriaRatings, rating: number) => {
        setFormData(prev => ({
            ...prev,
            criteriaRatings: {
                ...prev.criteriaRatings,
                [criteria]: rating
            }
        }));
    };

    const handleYearChange = (year: number) => {
        setFormData(prev => ({
            ...prev,
            year
        }));
    };

    const handleCommentChange = (comment: string) => {
        setFormData(prev => ({
            ...prev,
            comment
        }));
    };

    const isFormValid = () => {
        // Check if all criteria have ratings > 0
        return Object.values(formData.criteriaRatings).every(rating => rating > 0) &&
            formData.year >= 2000 && formData.year <= currentYear + 2;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ Check authentication
        if (status === 'loading') {
            toast.error('Please wait while we verify your session...');
            return;
        }

        if (!session) {
            toast.error('Please sign in to submit a review');
            onClose();
            return;
        }

        if (!isFormValid()) {
            toast.error('Please rate all criteria and provide a valid year');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('🔄 Submitting review with session:', {
                userEmail: session.user?.email,
                hasAccessToken: !!session.accessToken
            });
            
            await programReviewAPI.createReview(formData);
            toast.success('Review submitted successfully!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error submitting review:', error);
            if (error.response?.status === 401) {
                toast.error('Please sign in to submit a review');
                onClose();
            } else {
                toast.error(error.response?.data?.message || 'Failed to submit review');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay blur - z-50 để luôn nằm dưới modal */}
            <div
                className="fixed inset-0 w-full h-full m-0 p-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300"
                aria-hidden="true"
                onClick={onClose}
            />
            {/* Modal popup content 80% screen - z-60 để nổi trên overlay */}
            <div className="fixed inset-0 z-60 flex items-center justify-center">
                <div className="bg-white dark:bg-[#1f2021] rounded-2xl w-[50vw] h-[80vh] border border-gray-200 dark:border-[#36454F] shadow-2xl overflow-y-auto" style={{ padding: 50 }}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Write a Review
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {programName}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            type="button"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Year Selection */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 mr-2" />
                                Year of Study/Graduation
                            </label>
                            <select
                                value={formData.year}
                                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                         focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                                {Array.from({ length: 10 }, (_, i) => currentYear - i + 2).map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Criteria Ratings */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <School className="w-5 h-5 mr-2" />
                                Rate Your Experience
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(CRITERIA_LABELS).map(([key, label]) => (
                                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {label}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {CRITERIA_DESCRIPTIONS[key as keyof CriteriaRatings]}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-amber-500">
                                                    {formData.criteriaRatings[key as keyof CriteriaRatings].toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                        <StarRating
                                            rating={formData.criteriaRatings[key as keyof CriteriaRatings]}
                                            onRatingChange={(rating) => handleRatingChange(key as keyof CriteriaRatings, rating)}
                                            size="lg"
                                            className="justify-center mt-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Additional Comments (Optional)
                            </label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => handleCommentChange(e.target.value)}
                                placeholder="Share your detailed experience, tips for future students, or any other thoughts..."
                                rows={4}
                                maxLength={2000}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                         focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                         resize-none"
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                                {formData.comment?.length || 0}/2000
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isFormValid() || isSubmitting}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Review
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProgramReviewForm; 