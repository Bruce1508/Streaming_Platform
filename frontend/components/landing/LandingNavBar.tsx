'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { SearchIcon, BookOpenCheck, UserIcon, ChevronDownIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LandingNavBar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // Đóng modal khi click ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowAccountModal(false);
            }
        }
        if (showAccountModal) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAccountModal]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`top-0 left-0 right-0 z-50 w-full transition-all duration-300
                ${isScrolled ? 'fixed backdrop-blur-sm bg-[#18191A]/70 shadow-lg' : 'absolute bg-transparent'}`}
        >
            {/* Nav Links - Centered */}
            <nav className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8 font-medium text-white">
                <Link href="/" className="hover:text-gray-200">Home</Link>
                <Link href="/courses" className="hover:text-gray-200">Courses</Link>
                <Link href="/programs" className="hover:text-gray-200">Programs</Link>
                <Link href="/resources" className="hover:text-gray-200">Resources</Link>
                <Link href="/about" className="hover:text-gray-200">About</Link>
            </nav>
            <div className="flex items-center justify-between h-20 w-full px-6 xl:px-16 2xl:px-32 text-white">
                {/* Left Side: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="text-3xl md:text-4xl font-bold">
                            StudyBuddy
                        </span>
                    </Link>
                </div>
                {/* Right Side: Search, Auth buttons */}
                <div className="flex items-center gap-4">
                    {/* <div className="relative hidden sm:block">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="pl-10 pr-4 py-2 w-64 md:w-80 rounded-full bg-white/20 border-transparent text-white placeholder-gray-300 focus:bg-white focus:border-gray-300 focus:ring-0 focus:text-black transition"
                        />
                    </div> */}
                    {/* Conditional rendering based on authentication */}
                    {user ? (
                        // Logged in user
                        <div className="flex items-center gap-3">

                            {/* User Avatar with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowAccountModal(true)}
                                    className="flex items-center gap-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/30">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt="User Avatar"
                                                width={28}
                                                height={28}
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
                                {/* Account Modal thay cho dropdown */}
                                {showAccountModal && user && (
                                    <div className="absolute top-full mt-5 right-0 z-[100]">
                                        <div ref={modalRef} className="relative bg-[#343434] rounded-3xl shadow-2xl w-80 max-w-full px-8 pt-8 pb-4 flex flex-col items-center animate-fade-in">
                                            {/* Close button */}
                                            <button onClick={() => setShowAccountModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none">&times;</button>
                                            {/* Email */}
                                            <p className="text-gray-300 text-sm mb-5 font-medium">{user.email}</p>
                                            {/* Avatar */}
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 mb-4 flex items-center justify-center border-2 border-white mx-auto">
                                                {user.image ? (
                                                    <Image src={user.image} alt="User Avatar" width={64} height={64} className="object-cover w-full h-full" />
                                                ) : (
                                                    <UserIcon className="w-10 h-10 text-white" />
                                                )}
                                            </div>
                                            {/* Name */}
                                            <h2 className="text-2xl font-semibold text-white mb-6">Hi, {user.name?.split(' ')[0] || user.email?.split('@')[0]}!</h2>
                                            {/* Actions */}
                                            <a href="/profile" className="w-full mb-5">
                                                <button className="w-full py-2 rounded-full text-white font-semibold text-base shadow-none bg-transparent hover:bg-white/10 transition cursor-pointer border border-gray-500">Manage your Account</button>
                                            </a>
                                            <button onClick={() => signOut({ redirect: true, callbackUrl: '/sign-in' })} className="w-full py-2 rounded-full text-gray-300 border border-gray-500 font-semibold text-base shadow-none bg-transparent hover:bg-white/10 transition cursor-pointer">Sign out</button>
                                            <div className="w-full flex justify-center mt-5">
                                                <span className="text-xs text-gray-500">Privacy policy &middot; Terms of Service</span>
                                            </div>
                                        </div>
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
        </header>
    );
};

export default LandingNavBar; 