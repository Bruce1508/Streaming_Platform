'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Menu, Plus, X, Bell, User, ChevronDown } from 'lucide-react';
import ForumSidebar from './ForumSidebar';
import ForumRightSidebar from './ForumRightSidebar';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

// ===== FORUM LAYOUT COMPONENT =====
// Reddit-style layout với collapsible sidebar
interface ForumLayoutProps {
    children: React.ReactNode;
    showRightSidebar?: boolean;
    showOtherDiscussions?: boolean;
    currentPostId?: string;
    className?: string;
}

export const ForumLayout: React.FC<ForumLayoutProps> = ({
    children,
    showRightSidebar = true,
    showOtherDiscussions = false,
    currentPostId,
    className = ''
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);

    // Close avatar dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
                setShowAvatarDropdown(false);
            }
        };

        if (showAvatarDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAvatarDropdown]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 700);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ===== SEARCH HANDLERS =====
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const params = new URLSearchParams(searchParams);
            params.set('search', searchQuery.trim());
            router.push(`${window.location.pathname}?${params.toString()}`);
        } else {
            const params = new URLSearchParams(searchParams);
            params.delete('search');
            router.push(`${window.location.pathname}?${params.toString()}`);
        }
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(e as any);
        }
    };

    return (
        <div className={`min-h-screen bg-[#ffffff] ${className}`}>
            {/* ===== MAIN NAVBAR ===== */}
            <div className="sticky top-0 z-50 bg-[#ffffff] border-b border-gray-200">
                <div className="flex items-center h-14 px-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-2">
                        {/* Sidebar Toggle */}
                        <button
                            onClick={toggleLeftSidebar}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            {isLeftSidebarOpen ? (
                                <X className="w-5 h-5 text-gray-600" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        {/* Logo/Home */}
                        <Link href="/" className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">S</span>
                            </div>
                            <span className="font-bold text-gray-900 hidden sm:block">StudyHub</span>
                        </Link>
                    </div>

                    {/* Center - Navigation Links */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer hover:underline">
                                Home
                            </Link>
                            <Link href="/forum" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer hover:underline">
                                Forum
                            </Link>
                            <Link href="/programs" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer hover:underline">
                                Programs
                            </Link>
                            <Link href="/resources" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer hover:underline">
                                Resources
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer hover:underline">
                                About
                            </Link>
                        </div>
                    </div>

                    {/* Right Section - Search + Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar - Smaller and closer to Create */}
                        <form onSubmit={handleSearch} className="relative w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search posts by title or tags..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-[#e4ebee] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 focus:bg-white transition-all duration-200 text-sm cursor-text"
                            />
                        </form>

                        {/* Create Button - text only with hover */}
                        <Link
                            href="/forum/create"
                            className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium transition-all duration-200 text-sm cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create</span>
                        </Link>

                        {/* Inbox Button */}
                        <button 
                            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 cursor-pointer"
                            title="Open inbox"
                        >
                            <Bell className="w-5 h-5" />
                        </button>

                        {/* Avatar with Dropdown */}
                        <div className="relative" ref={avatarRef}>
                            <button 
                                onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                                className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded-md transition-all duration-200 cursor-pointer"
                            >
                                {session?.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                )}
                                <ChevronDown className="w-3 h-3 text-gray-500" />
                            </button>

                            {showAvatarDropdown && (
                                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="py-1">
                                        <div className="px-3 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {session?.user?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {session?.user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/forum/my-topics"
                                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            My Posts
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            Settings
                                        </Link>
                                        <div className="border-t border-gray-100">
                                            <button 
                                                onClick={() => signOut({ redirect: true, callbackUrl: '/sign-in' })}
                                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
            </div>

            {/* ===== MAIN LAYOUT ===== */}
            <div className="flex">
                {/* ===== LEFT SIDEBAR ===== */}
                <aside className={`${isLeftSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-[#ffffff] sticky top-12 h-[calc(100vh-3rem)]`}>
                    <div className="h-full overflow-y-auto">
                        <ForumSidebar />
                    </div>
                </aside>

                {/* ===== MAIN CONTENT ===== */}
                <main className="flex-1 min-h-[calc(100vh-3rem)] bg-[#f2fcfd]">
                    <div className="max-w-3xl mx-auto px-4 py-6">
                        {children}
                    </div>
                </main>

                {/* ===== RIGHT SIDEBAR (Only for post detail pages) ===== */}
                {showRightSidebar && showOtherDiscussions && (
                    <aside className="w-80 border-l border-gray-200 bg-white hidden xl:block sticky top-12 h-[calc(100vh-3rem)]">
                        <div className="h-full overflow-y-auto">
                            <ForumRightSidebar 
                                currentPostId={currentPostId}
                                showOtherDiscussions={showOtherDiscussions}
                            />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default ForumLayout; 