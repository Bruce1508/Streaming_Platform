'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
    showValue?: boolean;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    maxRating = 5,
    size = 'md',
    readonly = false,
    showValue = false,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const handleStarClick = (selectedRating: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(selectedRating);
        }
    };

    const handleStarHover = (hoveredRating: number) => {
        // Could add hover effects here
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className="flex items-center">
                {Array.from({ length: maxRating }, (_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= rating;
                    const isPartiallyFilled = starValue - 0.5 <= rating && rating < starValue;

                    return (
                        <button
                            key={index}
                            type="button"
                            className={`
                                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                                transition-transform duration-150
                                ${!readonly ? 'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 rounded' : ''}
                            `}
                            onClick={() => handleStarClick(starValue)}
                            onMouseEnter={() => handleStarHover(starValue)}
                            disabled={readonly}
                            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
                        >
                            <Star
                                className={`
                                    ${sizeClasses[size]}
                                    transition-colors duration-150
                                    ${isFilled || isPartiallyFilled
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-none text-gray-300 hover:text-amber-300'
                                    }
                                `}
                            />
                        </button>
                    );
                })}
            </div>
            
            {showValue && (
                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    ({rating.toFixed(1)})
                </span>
            )}
        </div>
    );
};

export default StarRating; 