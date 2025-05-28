import Link from "next/link";
import { UserPlusIcon, UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
    return (
        <div className="card bg-base-200 p-8 text-center">
            <div className="mb-6">
                <UsersIcon className="size-16 mx-auto text-base-content opacity-30 mb-4" />
                <h3 className="font-semibold text-xl mb-2">No Friends Yet</h3>
                <p className="text-base-content opacity-70 max-w-md mx-auto">
                    Start your language learning journey by connecting with other learners!
                    Send friend requests to people who share your language interests.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link href="/notifications" className="btn btn-outline">
                    <UsersIcon className="size-4 mr-2" />
                    Check Friend Requests
                </Link>

                <span className="text-sm opacity-70">or</span>

                <div className="flex items-center text-sm opacity-70">
                    <UserPlusIcon className="size-4 mr-1" />
                    Browse recommended users below
                </div>
            </div>
        </div>
    );
};

export default NoFriendsFound;