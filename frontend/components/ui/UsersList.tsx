import UserCard from "./UserCard";
import UserCardSkeleton from "./UserCardSkeleton";
import { User } from "@/types/User";
import { Search } from "lucide-react";

const UsersList: React.FC<{
    isLoading: boolean;
    users: User[];
    isSearching: boolean;
    searchQuery: string;
    getButtonConfig: (userId: string) => any;
}> = ({ isLoading, users, isSearching, searchQuery, getButtonConfig }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                    <UserCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-base-content/40 mb-4">
                    <Search className="w-12 h-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-base-content mb-2">
                    {isSearching ? 'No search results' : 'No users found'}
                </h3>
                <p className="text-base-content/60">
                    {isSearching
                        ? `No users found for "${searchQuery}". Try adjusting your search or filters.`
                        : 'Try adjusting your filters or check back later'
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <UserCard
                    key={user._id}
                    user={user}
                    buttonConfig={getButtonConfig(user._id)}
                />
            ))}
        </div>
    );
};

export default UsersList