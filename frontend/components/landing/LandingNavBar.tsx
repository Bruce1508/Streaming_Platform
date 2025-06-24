'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { SearchIcon, BookOpenCheck, UserIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

const LandingNavBar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="absolute top-0 left-0 right-0 z-50">
            {/* Nav Links - Centered */}
            <nav className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8 font-medium text-white">
                <Link href="/" className="hover:text-gray-200">Home</Link>
                <Link href="/courses" className="hover:text-gray-200">Courses</Link>
                <Link href="/programs" className="hover:text-gray-200">Programs</Link>
                <Link href="/resources" className="hover:text-gray-200">Resources</Link>
                <Link href="/about" className="hover:text-gray-200">About</Link>
            </nav>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 text-white">
                    {/* Left Side: Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2.5">
                             <BookOpenCheck className="size-8 text-white" />
                            <span className="text-2xl font-bold">
                                StudyBuddy
                            </span>
                        </Link>
                    </div>

                    {/* Right Side: Search, Auth buttons */}
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 w-48 rounded-full bg-white/20 border-transparent text-white placeholder-gray-300 focus:bg-white focus:border-gray-300 focus:ring-0 focus:text-black transition"
                            />
                        </div>
                        
                        {/* Conditional rendering based on authentication */}
                        {user ? (
                            // Logged in user
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard">
                                    <Button variant="secondary" className="rounded-full bg-white text-blue-600 hover:bg-gray-200">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                                
                                {/* User Avatar with Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/30">
                                            {(user as any)?.profilePic || user?.image ? (
                                                <Image
                                                    src={(user as any)?.profilePic || user?.image || ''}
                                                    alt="User Avatar"
                                                    width={32}
                                                    height={32}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <UserIcon className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <ChevronDownIcon className="w-4 h-4 text-white" />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                            <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Dashboard
                                            </Link>
                                            <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Profile
                                            </Link>
                                            <Link href="/materials" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                My Materials
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Not logged in
                            <>
                                <Link href="/sign-in">
                                    <Button variant="secondary" className="rounded-full bg-white text-blue-600 hover:bg-gray-200">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button variant="default" className="rounded-full">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LandingNavBar; 