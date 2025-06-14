import Avatar from "./Avatar";
import { Languages, MapPin, Loader2 } from "lucide-react";
import { User } from "@/types/User";

const UserCard: React.FC<{
    user: User;
    buttonConfig: {
        text: string;
        icon: any;
        className: string;
        onClick: () => void;
        disabled: boolean;
    };
}> = ({ user, buttonConfig }) => {
    const IconComponent = buttonConfig.icon;

    return (
        <div className="bg-base-100 border border-base-300 rounded-lg p-6 
                     transition-all duration-300 ease-in-out 
                     hover:shadow-xl hover:border-primary hover:scale-[1.05] hover:bg-base-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <Avatar user={user} size="md" />

                    {/* User Info */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-base-content">
                            {user.fullName || user.username || 'Unknown User'}
                        </h3>

                        {/* Languages */}
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                                <Languages className="w-4 h-4 text-primary" />
                                <span className="text-base-content/60">
                                    Native: <span className="font-medium">{user.nativeLanguage}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Languages className="w-4 h-4 text-accent" />
                                <span className="text-base-content/60">
                                    Learning: <span className="font-medium">{user.learningLanguage}</span>
                                </span>
                            </div>
                        </div>

                        {/* Location */}
                        {user.location && (
                            <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4 text-base-content/40" />
                                <span className="text-base-content/60">{user.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dynamic Button */}
                <button
                    onClick={buttonConfig.onClick}
                    disabled={buttonConfig.disabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonConfig.className}`}
                >
                    <IconComponent className={`w-4 h-4 ${buttonConfig.icon === Loader2 ? 'animate-spin' : ''}`} />
                    {buttonConfig.text}
                </button>
            </div>
        </div>
    );
};

export default UserCard