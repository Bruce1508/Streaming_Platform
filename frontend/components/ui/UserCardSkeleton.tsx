const UserCardSkeleton = () => {
        return (
        <div className="bg-base-100 border border-base-300 rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-base-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-base-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-base-200 rounded w-48 mb-1"></div>
                        <div className="h-3 bg-base-200 rounded w-24"></div>
                    </div>
                </div>
                <div className="w-24 h-10 bg-base-200 rounded-lg"></div>
            </div>
        </div>
    );
}

export default UserCardSkeleton