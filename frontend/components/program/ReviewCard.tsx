'use client';

import React from 'react';

interface Review {
    _id: string;
    ratings: {
        instructorRating: number;
        contentQualityRating: number;
        practicalValueRating: number;
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

interface ReviewCardProps {
    review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div
            className="relative rounded-2xl p-8 min-h-[220px] flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
                color: 'black',
                boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)'
            }}
        >
            {/* Top Row: Quote icon and Semester Badge */}
            <div className="flex items-start justify-between w-full mb-2">
                <div className="text-4xl opacity-30 select-none pointer-events-none">&ldquo;</div>
                <div className="text-base text-gray-700 opacity-40 whitespace-nowrap">{review.currentSemester}</div>
            </div>
            {/* Comment text */}
            <div className="flex-1 flex items-center relative">
                <p className="text-xl md:text-2xl font-medium leading-snug mt-2 opacity-70">{review.comment}</p>
            </div>
            {/* Take course again indicator */}
            <div className="mt-4 mb-2">
                <span className={`text-sm px-3 py-1 rounded-full ${review.takeTheCourseAgain ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{review.takeTheCourseAgain ? '✓ Would take again' : '✗ Would not take again'}</span>
            </div>
            {/* Footer: author left only */}
            <div className="flex items-center mt-7 z-10 opacity-40">
                <span className="text-sm tracking-wide uppercase">{review.author.fullName}</span>
            </div>
        </div>
    );
}; 