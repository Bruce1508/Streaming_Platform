'use client';

import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import ForumSidebar from './ForumSidebar';
import ForumRightSidebar from './ForumRightSidebar';
import LandingNavBar from '../landing/LandingNavBar';
import Link from 'next/link';

// ===== FORUM LAYOUT COMPONENT =====
// Layout 3 cột chính cho toàn bộ forum với navigation nhất quán
interface ForumLayoutProps {
    children: React.ReactNode;
    showRightSidebar?: boolean; // Option để ẩn right sidebar nếu cần
    className?: string;
}

export const ForumLayout: React.FC<ForumLayoutProps> = ({
    children,
    showRightSidebar = true,
    className = ''
}) => {
    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            {/* ===== MAIN NAVIGATION BAR ===== */}
            <LandingNavBar />

            {/* ===== FORUM HEADER WITH SEARCH ===== */}
            <header className="bg-white border-b border-gray-200 sticky top-20 z-40">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Forum Title */}
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-semibold text-gray-900">Forum</h1>
                        </div>

                        {/* Center: Search Bar */}
                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for Topics"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Right: Quick Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
                                <Bell className="h-6 w-6" />
                                {/* Notification Badge */}
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* Start New Topic Button */}
                            <Link href="/forum/create">
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                                    Start New Topic
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT AREA ===== */}
            <div className="flex">
                {/* ===== LEFT SIDEBAR ===== */}
                <aside className="w-64 flex-shrink-0 hidden lg:block">
                    <div className="h-[calc(100vh-8rem)] overflow-y-auto">
                        <ForumSidebar />
                    </div>
                </aside>

                {/* ===== MAIN CONTENT ===== */}
                <main className={`flex-1 min-w-0 ${showRightSidebar ? 'lg:mr-80' : ''}`}>
                    <div className="h-[calc(100vh-8rem)] overflow-y-auto">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            {children}
                        </div>
                    </div>
                </main>

                {/* ===== RIGHT SIDEBAR ===== */}
                {showRightSidebar && (
                    <aside className="w-80 flex-shrink-0 hidden lg:block fixed right-0 top-36 border-l border-gray-200">
                        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
                            <ForumRightSidebar />
                        </div>
                    </aside>
                )}
            </div>

            {/* ===== MOBILE MENU OVERLAY (Future Implementation) ===== */}
            {/* Có thể thêm mobile menu overlay ở đây nếu cần */}
        </div>
    );
};

export default ForumLayout; 