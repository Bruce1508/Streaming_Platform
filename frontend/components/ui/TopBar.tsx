// components/ui/TopBar.tsx
"use client";

import ProfileDropdown from "@/components/ui/ProfileDropDown";
import NotificationBell from "./NotificationBell";
import { MenuIcon } from "lucide-react";

interface TopBarProps {
    onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 bg-white px-4 md:px-6 shadow-sm border-b border-gray-200">
            {/* Mobile menu button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
            >
                <MenuIcon className="h-6 w-6" />
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side items */}
            <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <NotificationBell />
                
                {/* Profile Dropdown */}
                <ProfileDropdown />
            </div>
        </header>
    );
}