import { FaXTwitter, FaGithub, FaReddit, FaYoutube } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#343434] text-gray-400 pt-16 sm:pt-24 md:pt-32 lg:pt-40 xl:pt-45 2xl:pt-50 pb-8 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 2xl:pb-28">
            <div className="flex flex-col md:flex-row items-center justify-between mb-30 max-w-7xl mx-auto w-full">
                {/* Left: Big text and button */}
                <div className="flex-1 flex flex-col items-center justify-center mb-10 md:mb-0 w-full">
                    <h1 className="whitespace-nowrap text-3xl md:text-4xl lg:text-[5rem] 2xl:text-[7rem] font-bold text-center mb-15 bg-gradient-to-r from-[#FFBF00] via-[#f2e8e6] to-[#CC6666] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] bg-[length:200%_100%] animate-[gradient_5s_ease-in-out_infinite] w-full flex justify-center">Try StudyBuddy Now</h1>
                    <Link href="/dashboard" className="flex items-center justify-center gap-2 sm:gap-3 bg-[#FFFFF0] text-black font-bold rounded-lg px-4 py-2 sm:px-6 sm:py-3 md:px-5 md:py-2 text-base sm:text-lg md:text-base shadow-lg hover:shadow-xl hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 mx-auto">
                        Get Started
                    </Link>
                </div>
                {/* Right: Illustration */}
                {/* <div className="flex-1 flex justify-center md:justify-end">
                    <Image src="/logo.png" alt="Classio Logo" width={400} height={400} className="h-[800px] w-[800px] object-contain" />
                </div> */}
            </div>
            {/* Footer links and info */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:justify-between gap-12 items-center w-full">
                {/* Left */}
                <div className="flex flex-col gap-6 min-w-[220px]">
                    <span className="text-white font-semibold text-lg">hi@studybuddy.com</span>
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
                        <div className="font-semibold text-white mb-2">Resources</div>
                        <ul className="space-y-1">
                            <li>Docs</li>
                            <li>Blog</li>
                            <li>Forum</li>
                            <li>Changelog</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold text-white mb-2">Community</div>
                        <ul className="space-y-1">
                            <li>Q&A</li>
                            <li>Customers</li>
                            <li>Developers</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-semibold text-white mb-2">Legal</div>
                        <ul className="space-y-1">
                            <li>Terms</li>
                            <li>Privacy</li>
                        </ul>
                    </div>
                </div>
                {/* Right - Language */}
                <div className="flex flex-col gap-4 min-w-[180px]">
                    <div>
                        <select className="bg-black border border-gray-700 rounded px-3 py-1 text-gray-400">
                            <option>English</option>
                            <option>Vietnamese</option>
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    );
} 