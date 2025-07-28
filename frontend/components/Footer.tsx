import { FaXTwitter, FaGithub, FaReddit, FaYoutube } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#F8FFE5] text-gray-400 pb-30 pt-10">
            {/* Border top - Light gray line */}
            <div className="w-full h-px bg-gray-300 mb-30"></div>
            
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