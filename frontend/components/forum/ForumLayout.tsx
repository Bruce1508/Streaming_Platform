'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Bell, User, Plus } from 'lucide-react';
import ForumSidebar from './ForumSidebar';
import ForumRightSidebar from './ForumRightSidebar';
import LandingNavBar from '../landing/LandingNavBar';
import Link from 'next/link';

// ===== FORUM LAYOUT COMPONENT =====
// Layout với sticky search bar và blur effect khi scroll
interface ForumLayoutProps {
    children: React.ReactNode;
    showRightSidebar?: boolean;
    className?: string;
}

export const ForumLayout: React.FC<ForumLayoutProps> = ({
    children,
    showRightSidebar = true,
    className = ''
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const searchBarRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

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
        <div className={`min-h-screen bg-[#0a0a0a] ${className}`}>
            {/* ===== MAIN NAVIGATION BAR ===== */}
            <LandingNavBar />

            {/* ===== SEARCH BAR SECTION ===== */}
            <div 
                ref={searchBarRef}
                className={`sticky top-0 z-40 transition-all duration-300 mt-20 ${
                    isScrolled 
                        ? 'bg-black/60 backdrop-blur-md shadow-lg py-2' 
                        : 'bg-[#0a0a0a]'
                }`}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-center gap-8">
                        {/* Search Bar - Centered */}
                        <form onSubmit={handleSearch} className="relative w-full max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search posts by title or tags..."
                                className="block w-full pl-10 pr-3 py-5 border border-gray-300 rounded-xl leading-5 bg-[#ffffff] text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                        </form>
                        
                        {/* Create Post Button */}
                        <Link
                            href="/forum/create"
                            className="flex items-center gap-2 px-4 py-3 bg-[#d93a00] text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            Create Post
                        </Link>
                    </div>
                </div>
            </div>

            {/* ===== MAIN CONTENT AREA ===== */}
            <div 
                ref={contentRef}
                className={`flex transition-all duration-300 ${
                    isScrolled ? 'blur-[0.5px]' : ''
                }`}
            >
                {/* ===== LEFT SIDEBAR ===== */}
                <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-36 h-[calc(100vh-9rem)]">
                    <div className="h-full overflow-y-auto">
                        <ForumSidebar />
                    </div>
                </aside>

                {/* ===== MAIN CONTENT ===== */}
                <main className="flex-1 min-w-0">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* ===== MOBILE MENU OVERLAY (Future Implementation) ===== */}
            {/* Có thể thêm mobile menu overlay ở đây nếu cần */}
        </div>
    );
};

export default ForumLayout; 