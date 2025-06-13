import { useState } from 'react';

interface AvatarProps {
    user: any; // Pass whole user object
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
    const [imageError, setImageError] = useState(false);
    
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-lg', 
        lg: 'w-16 h-16 text-xl'
    };
    
    // 🎯 Priority order: profilePic first (for Google users), then avatar
    const getAvatarUrl = () => {
        const avatar = user.profilePic || user.avatar || user.profile_pic || user.profilePicture || user.picture;
        
        if (!avatar) return null;
        
        // Google avatars và external URLs
        if (avatar.startsWith('https://') || avatar.startsWith('http://')) {
            return avatar;
        }
        
        // Server avatars
        if (avatar.startsWith('/')) {
            return `${process.env.NEXT_PUBLIC_API_URL}${avatar}`;
        } else {
            return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${avatar}`;
        }
    };
    
    const avatarUrl = getAvatarUrl();
    const displayName = user.fullName || user.username || user.email || 'User';
    const fallbackText = displayName.charAt(0).toUpperCase();
    
    // 🎯 Debug log
    console.log('🖼️ Avatar component debug:', {
        userId: user._id,
        userName: displayName,
        profilePic: user.profilePic,
        avatar: user.avatar,
        finalUrl: avatarUrl,
        hasError: imageError
    });
    
    return (
        <div className={`relative ${sizeClasses[size]} bg-gray-200 rounded-full flex items-center justify-center overflow-hidden ${className}`}>
            {avatarUrl && !imageError ? (
                <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        console.log('❌ Avatar failed to load:', avatarUrl);
                        setImageError(true);
                    }}
                    onLoad={() => {
                        console.log('✅ Avatar loaded successfully:', avatarUrl);
                        setImageError(false);
                    }}
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">
                        {fallbackText}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Avatar;