'use client';

import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress: number;
    className?: string;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'error';
}

export function ProgressBar({ 
    progress, 
    className,
    showPercentage = true,
    size = 'md',
    variant = 'default'
}: ProgressBarProps) {
    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };

    const variantClasses = {
        default: 'bg-blue-500',
        success: 'bg-green-500',
        error: 'bg-red-500'
    };

    return (
        <div className={cn('w-full', className)}>
            <div className={cn(
                'w-full bg-gray-200 rounded-full overflow-hidden',
                sizeClasses[size]
            )}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-300 ease-out',
                        variantClasses[variant]
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
            </div>
            {showPercentage && (
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                        Uploading...
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
        </div>
    );
}