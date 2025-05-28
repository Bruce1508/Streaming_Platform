import Link from "next/link";
import Image from "next/image";
import { LANGUAGE_TO_FLAG } from "@/constants";

interface Friend {
    _id: string;
    fullName: string;
    profilePic: string;
    nativeLanguage: string;
    learningLanguage: string;
    bio?: string;
    location?: string;
}

interface FriendCardProps {
    friend: Friend;
}

const FriendCard = ({ friend }: FriendCardProps) => {
    return (
        <div className="card bg-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
                {/* USER INFO */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12 rounded-full overflow-hidden relative">
                        <Image
                            src={friend.profilePic}
                            alt={friend.fullName}
                            fill
                            className="object-cover"
                            sizes="48px"
                            priority={false}
                        />
                    </div>
                    <h3 className="font-semibold truncate">{friend.fullName}</h3>
                </div>

                {/* LANGUAGES */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(friend.nativeLanguage)}
                        Native: {friend.nativeLanguage}
                    </span>
                    <span className="badge badge-outline text-xs">
                        {getLanguageFlag(friend.learningLanguage)}
                        Learning: {friend.learningLanguage}
                    </span>
                </div>

                {/* MESSAGE BUTTON */}
                <Link href={`/chat/${friend._id}`} className="btn btn-outline w-full">
                    Message
                </Link>
            </div>
        </div>
    );
};

export default FriendCard;

// Language flag helper function with Next.js Image
export function getLanguageFlag(language: string) {
    if (!language) return null;

    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower as keyof typeof LANGUAGE_TO_FLAG];

    if (countryCode) {
        return (
            <div className="inline-block w-6 h-[18px] mr-1 relative">
                <Image
                    src={`https://flagcdn.com/24x18/${countryCode}.png`}
                    alt={`${langLower} flag`}
                    width={24}
                    height={18}
                    className="object-cover"
                    unoptimized // For external images
                />
            </div>
        );
    }

    return null;
}