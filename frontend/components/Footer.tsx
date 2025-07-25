import { FaXTwitter, FaGithub, FaReddit, FaYoutube } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#FAF9F6] text-gray-400 pt-20 pb-30 relative">
            {/* Diagonal border top - Even thickness with black-red-white gradient */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-black via-red-600 to-white" 
                 style={{
                     clipPath: 'polygon(0 100%, 100% 0%, 100% 100%, 0% 100%)'
                 }}>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-30 max-w-7xl mx-auto w-full pt-6">
                
            </div>
            {/* Footer links and info */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:justify-between gap-12 items-center w-full">
                {/* Left */}
                <div className="flex flex-col gap-6 min-w-[220px]">
                    <span className="text-[#18191A] font-semibold text-lg">hi@studybuddy.com</span>
                    <div className="flex gap-4 text-2xl">
                        <FaXTwitter className="hover:text-white cursor-pointer" />
                        <FaGithub className="hover:text-white cursor-pointer" />
                        <FaReddit className="hover:text-white cursor-pointer" />
                        <FaYoutube className="hover:text-white cursor-pointer" />
                    </div>
                    <span className="text-xs mt-8">© 2025 Made by StudyBuddy Team</span>
                </div>
                {/* Center - Links */}
                <div className="flex flex-wrap gap-12 justify-between flex-1">
                    <div>
                        <div className="font-semibold text-[#18191A] mb-2">Resources</div>
                        <ul className="space-y-1">
                            <li>Docs</li>
                            <li>Blog</li>
                            <li>Forum</li>
                            <li>Changelog</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold text-[#18191A] mb-2">Community</div>
                        <ul className="space-y-1">
                            <li>Q&A</li>
                            <li>Customers</li>
                            <li>Developers</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold text-[#18191A] mb-2">Legal</div>
                        <ul className="space-y-1">
                            <li>Terms</li>
                            <li>Privacy</li>
                        </ul>
                    </div>
                </div>
                {/* Right - Language */}
                <div className="flex flex-col gap-4 min-w-[180px]">
                    <div>
                        <select className="border border-gray-700 rounded px-3 py-1 text-gray-400">
                            <option>English</option>
                            <option>French</option>
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    );
} 