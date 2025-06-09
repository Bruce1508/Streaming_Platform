// components/ProfileDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { 
    UserIcon, 
    SettingsIcon, 
    LogOutIcon,
    ChevronDownIcon,
    UserCircleIcon,
    BellIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            setIsOpen(false);
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
            // Still try to navigate even if there's an error
            router.push('/sign-in');
        }
    };

    if (!user) return null;

    // Get display name and email
    const displayName = user.fullName || user.email?.split('@')[0] || 'User';
    const userEmail = user.email;
    const avatarLetter = displayName[0]?.toUpperCase() || 'U';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-base-200 transition-colors"
                aria-label="User menu"
            >
                <div className="avatar">
                    <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        {user.profilePic ? (
                            <Image
                                src={user.profilePic}
                                alt={displayName}
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        ) : (
                            <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full">
                                <span className="text-lg font-semibold">
                                    {avatarLetter}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-base-100 rounded-lg shadow-lg border border-base-300 z-50 dropdown-menu">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-base-300">
                        <div className="flex items-center gap-3">
                            <div className="avatar">
                                <div className="w-12 rounded-full">
                                    {user.profilePic ? (
                                        <Image
                                            src={user.profilePic}
                                            alt={displayName}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full">
                                            <span className="text-xl font-semibold">
                                                {avatarLetter}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{displayName}</p>
                                <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 cursor-pointer transition-colors">
                                <UserCircleIcon className="w-5 h-5" />
                                <span>My Profile</span>
                            </div>
                        </Link>

                        <Link href="/friends" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 cursor-pointer transition-colors">
                                <UserIcon className="w-5 h-5" />
                                <span>Friends</span>
                            </div>
                        </Link>

                        <Link href="/notifications" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 cursor-pointer transition-colors">
                                <BellIcon className="w-5 h-5" />
                                <span>Notifications</span>
                            </div>
                        </Link>

                        <Link href="/settings" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 cursor-pointer transition-colors">
                                <SettingsIcon className="w-5 h-5" />
                                <span>Settings</span>
                            </div>
                        </Link>

                        <div className="border-t border-base-300 my-2"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 cursor-pointer transition-colors w-full text-left text-error"
                        >
                            <LogOutIcon className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}