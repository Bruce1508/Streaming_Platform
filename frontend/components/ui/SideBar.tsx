'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Home, 
    BookOpen, 
    Users, 
    FileText, 
    Settings, 
    LogOut,
    Menu,
    X
} from "lucide-react";

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Programs", icon: BookOpen, href: "/programs" },
    { name: "Courses", icon: FileText, href: "/courses" },
    { name: "Study Materials", icon: FileText, href: "/materials" },
    { name: "Community", icon: Users, href: "/community" },
    { name: "Settings", icon: Settings, href: "/settings" },
];

export default function SideBar({ isOpen, onClose }: SideBarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`w-64 bg-gray-50 h-screen fixed left-0 top-0 z-20 border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900">StudyBuddy</h1>
                        <button 
                            onClick={onClose}
                            className="md:hidden p-1 hover:bg-gray-200 rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                            isActive 
                                                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700" 
                                                : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                        onClick={onClose}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">U</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">User Name</p>
                            <p className="text-xs text-gray-500 truncate">user@example.com</p>
                        </div>
                    </div>
                    
                    <button className="flex items-center gap-3 px-3 py-2 mt-3 w-full text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}