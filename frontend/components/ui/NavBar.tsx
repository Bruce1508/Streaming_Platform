'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Check if current page is chat page
    const isChatPage = pathname?.startsWith("/chat");

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
        router.push("/sign-up");
    };

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between w-full">

                    {/* LOGO - ONLY IN THE CHAT PAGE (when sidebar is hidden) */}
                    {isChatPage && (
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2.5">
                                <ShipWheelIcon className="size-8 text-primary" />
                                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                                    STREAMIFY
                                </span>
                            </Link>
                        </div>
                    )}

                    {/* RIGHT SIDE CONTROLS */}
                    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        {/* Notifications - only show in navbar if not in sidebar */}
                        {isChatPage && (
                            <Link href="/notifications">
                                <button className="btn btn-ghost btn-circle">
                                    <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                                </button>
                            </Link>
                        )}

                        {/* Theme Selector */}
                        <ThemeSelector />

                        {/* User Avatar */}
                        <div className="avatar">
                            <div className="w-9 rounded-full relative overflow-hidden">
                                {user?.profilePic && (
                                    <Image
                                        src={user.profilePic}
                                        alt="User Avatar"
                                        fill
                                        className="object-cover"
                                        sizes="36px"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Logout button */}
                        <button
                            className="btn btn-ghost btn-circle"
                            onClick={handleLogout}
                        >
                            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;