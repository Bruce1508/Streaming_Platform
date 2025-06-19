'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
    HomeIcon,
    BellIcon,
    UsersIcon,
    FolderOpenIcon,
    BookOpenIcon,
    CalendarIcon,
    TargetIcon,
    BookmarkIcon,
    SettingsIcon,
    ShipWheelIcon,
    PanelLeftCloseIcon,
    PanelLeftOpenIcon,
    FileIcon
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 transition-[width] duration-500 ease-out`}>
            {/* LOGO SECTION */}
            <div className="p-5 border-base-300">
                <Link href="/" className="flex items-center gap-2.5" title="Home">
                    <ShipWheelIcon className="size-9 text-primary" />
                    {!isCollapsed && (
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider animate-fade-in">
                            LINGUEX
                        </span>
                    )}
                </Link>
            </div>

            {/* NAVIGATION SECTION */}
            <nav className="flex-1 p-4 space-y-3">
                <Link
                    href="/"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/" ? "btn-active" : ""}`}
                    title="Home"
                >
                    <HomeIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Home</span>}
                </Link>

                <Link
                    href="/notifications"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/notifications" ? "btn-active" : ""}`}
                    title="Notifications"
                >
                    <BellIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Notifications</span>}
                </Link>

                <Link
                    href="/friends"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/learning-resources" ? "btn-active" : ""}`}
                    title="Friends"
                >
                    <UsersIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Friends</span>}
                </Link>

                <Link
                    href="/materials"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/materials" ? "btn-active" : ""}`}
                    title="Study Materials"
                >
                    <FolderOpenIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Study Materials</span>}
                </Link>

                <Link
                    href="/files"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/files" ? "btn-active" : ""}`}
                    title="My Files"
                >
                    <FileIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">My Files</span>}
                </Link>

                <Link
                    href="/study-groups"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/study-groups" ? "btn-active" : ""}`}
                    title="Study Groups"
                >
                    <BookOpenIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Study Groups</span>}
                </Link>

                <Link
                    href="/schedule"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/schedule" ? "btn-active" : ""}`}
                    title="Study Schedule"
                >
                    <CalendarIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Study Schedule</span>}
                </Link>

                <Link
                    href="/goals"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/goals" ? "btn-active" : ""}`}
                    title="Learning Goals"
                >
                    <TargetIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Learning Goals</span>}
                </Link>

                <Link
                    href="/saved"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/saved" ? "btn-active" : ""}`}
                    title="Saved Resources"
                >
                    <BookmarkIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Saved Resources</span>}
                </Link>

                <Link
                    href="/settings"
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${pathname === "/settings" ? "btn-active" : ""}`}
                    title="Settings"
                >
                    <SettingsIcon className="size-5 text-base-content opacity-70" />
                    {!isCollapsed && <span className="animate-fade-in whitespace-nowrap overflow-hidden">Settings</span>}
                </Link>
            </nav>

            {/* USER PROFILE SECTION */}
            <div className="p-4 border-t border-base-300 mt-auto">
                {!isCollapsed ? (
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="w-10 rounded-full relative overflow-hidden">
                                {user?.profilePic && (
                                    <Image
                                        src={user.profilePic}
                                        alt="User Avatar"
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                        priority
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-sm">{user?.fullName}</p>
                                        <p className="text-xs text-success flex items-center gap-1">
                                            <span className="size-2 rounded-full bg-success inline-block" />
                                            Online
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsCollapsed(!isCollapsed)}
                                        className="btn btn-ghost btn-sm p-2 hover:bg-base-300 transition-colors"
                                        title="Collapse sidebar"
                                    >
                                        <PanelLeftCloseIcon className="size-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="btn btn-ghost btn-sm p-2 hover:bg-base-300 transition-colors"
                            title="Expand sidebar"
                        >
                            <PanelLeftOpenIcon className="size-7" />
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;