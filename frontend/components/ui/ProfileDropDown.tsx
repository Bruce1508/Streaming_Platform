// components/ProfileDropdown.tsx
"use client";

import React from 'react';
import { ChevronDownIcon, UserIcon, LogOutIcon } from 'lucide-react';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

interface ProfileDropDownProps {
    className?: string;
}

const ProfileDropDown: React.FC<ProfileDropDownProps> = ({ className }) => {
    const { data: session } = useSession();
    const user = session?.user;

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: '/sign-in' });
    };

    if (!user) {
        return null;
    }

    return (
        <div className={`dropdown dropdown-end ${className}`}>
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    {(user as any)?.profilePic || user.image ? (
                        <Image
                            src={(user as any)?.profilePic || user.image || ''}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-primary" />
                        </div>
                    )}
                </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-primary text-primary-content border border-primary rounded-2xl w-56">
                <li className="hover:bg-primary/80 rounded-lg transition-colors">
                    <Link href="/profile" className="justify-between">
                        Profile
                        <span className="badge badge-accent ml-2">New</span>
                    </Link>
                </li>
                <li className="hover:bg-primary/80 rounded-lg transition-colors"><a>Settings</a></li>
                <li className="hover:bg-primary/80 rounded-lg transition-colors">
                    <button onClick={handleLogout} className="flex items-center gap-2">
                        <LogOutIcon className="w-4 h-4" />
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ProfileDropDown;