import React from 'react';
import { CheckCircle, GraduationCap, Users, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
    isVerified: boolean;
    verificationStatus: 'unverified' | 'email-verified' | 'edu-verified' | 'manual-verified' | 'non-student';
    verificationMethod: 'none' | 'email-link' | 'edu-domain' | 'edu-pattern' | 'admin-manual' | 'oauth-pending' | 'magic-link';
    institutionInfo?: {
        name: string;
        domain: string;
        type: 'university' | 'college' | 'polytechnic' | 'institute' | '';
    };
    size?: 'sm' | 'md' | 'lg';
    showTooltip?: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
    isVerified,
    verificationStatus,
    verificationMethod,
    institutionInfo,
    size = 'md',
    showTooltip = true
}) => {
    const getVerificationInfo = () => {
        if (!isVerified) {
            if (verificationStatus === 'non-student') {
                return {
                    icon: Users,
                    text: 'General User',
                    color: 'gray',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-600',
                    borderColor: 'border-gray-200',
                    tooltip: 'Regular user - Sign in with Google'
                };
            }
            return {
                icon: AlertCircle,
                text: 'Unverified',
                color: 'orange',
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-600',
                borderColor: 'border-orange-200',
                tooltip: 'Use student email to get verified status'
            };
        }

        // Verified users
        switch (verificationStatus) {
            case 'edu-verified':
                return {
                    icon: GraduationCap,
                    text: 'Verified Student',
                    color: 'green',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-200',
                    tooltip: `Verified ${institutionInfo?.name || 'educational institution'} student`
                };
            case 'email-verified':
                return {
                    icon: CheckCircle,
                    text: 'Student',
                    color: 'blue',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    borderColor: 'border-blue-200',
                    tooltip: `Verified student via magic link`
                };
            case 'manual-verified':
                return {
                    icon: CheckCircle,
                    text: 'Verified',
                    color: 'purple',
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-700',
                    borderColor: 'border-purple-200',
                    tooltip: 'Manually verified by admin'
                };
            default:
                return {
                    icon: CheckCircle,
                    text: 'Verified',
                    color: 'green',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-200',
                    tooltip: 'Verified user'
                };
        }
    };

    const info = getVerificationInfo();
    const Icon = info.icon;

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const badge = (
        <div
            className={`
                inline-flex items-center gap-2 rounded-full border font-medium
                ${sizeClasses[size]}
                ${info.bgColor}
                ${info.textColor}
                ${info.borderColor}
            `}
        >
            <Icon className={iconSizes[size]} />
            <span>{info.text}</span>
            {isVerified && verificationStatus === 'edu-verified' && (
                <span className="text-xs">🎓</span>
            )}
        </div>
    );

    if (showTooltip) {
        return (
            <div className="relative group">
                {badge}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {info.tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
            </div>
        );
    }

    return badge;
};

export default VerificationBadge; 