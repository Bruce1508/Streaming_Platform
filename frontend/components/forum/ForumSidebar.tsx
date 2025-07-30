'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Home, 
    Compass, 
    BookOpen, 
    MessageSquare,
    TrendingUp,
    Users,
    Settings
} from 'lucide-react';
import { ForumNavItem } from '@/types/Forum';

// ===== FORUM SIDEBAR COMPONENT =====
// Left sidebar navigation giống như trong ảnh forum
interface ForumSidebarProps {
    className?: string;
}

export const ForumSidebar: React.FC<ForumSidebarProps> = ({
    className = ''
}) => {
    const pathname = usePathname();

    // ===== NAVIGATION ITEMS =====
    // Danh sách menu items giống như trong ảnh
    const navItems: ForumNavItem[] = [
        {
            id: 'home',
            label: 'Home',
            icon: 'Home',
            href: '/forum',
            active: pathname === '/forum'
        },
        {
            id: 'explore',
            label: 'Explore Topics',
            icon: 'Compass',
            href: '/forum/explore',
            active: pathname === '/forum/explore'
        },
        {
            id: 'my-topics',
            label: 'My Topics',
            icon: 'BookOpen',
            href: '/forum/my-topics',
            active: pathname === '/forum/my-topics'
        },
        {
            id: 'my-answers',
            label: 'My Answers',
            icon: 'MessageSquare',
            href: '/forum/my-answers',
            active: pathname === '/forum/my-answers'
        }
    ];

    // ===== ADDITIONAL SECTIONS =====
    const additionalSections = [
        {
            title: 'Categories',
            items: [
                { label: 'General', href: '/forum?category=general', count: 156 },
                { label: 'Questions', href: '/forum?category=question', count: 89 },
                { label: 'Discussions', href: '/forum?category=discussion', count: 234 },
                { label: 'Course Specific', href: '/forum?category=course-specific', count: 67 },
                { label: 'Assignments', href: '/forum?category=assignment', count: 45 },
                { label: 'Exams', href: '/forum?category=exam', count: 23 },
                { label: 'Career', href: '/forum?category=career', count: 34 }
            ]
        }
    ];

    // ===== ICON COMPONENT =====
    const IconComponent = ({ iconName }: { iconName: string }) => {
        const icons: Record<string, any> = {
            Home,
            Compass,
            BookOpen,
            MessageSquare,
            TrendingUp,
            Users,
            Settings
        };
        
        const Icon = icons[iconName] || Home;
        return <Icon className="w-5 h-5" />;
    };

    return (
        <div className={`bg-white border-r border-gray-200 h-full ${className}`}>
            <div className="p-4">
                {/* ===== FORUM LOGO/TITLE ===== */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        forume
                    </h2>
                </div>

                {/* ===== MAIN NAVIGATION ===== */}
                <div className="mb-6">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        MENU
                    </div>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                                    ${item.active 
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                `}
                            >
                                <IconComponent iconName={item.icon} />
                                <span className="flex-1">{item.label}</span>
                                {item.count && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* ===== CATEGORIES SECTION ===== */}
                {additionalSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            {section.title}
                        </div>
                        <div className="space-y-1">
                            {section.items.map((item, itemIndex) => (
                                <Link
                                    key={itemIndex}
                                    href={item.href}
                                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                                >
                                    <span>{item.label}</span>
                                    {item.count && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                            {item.count}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {/* ===== QUICK STATS ===== */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                        Quick Stats
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Total Posts</span>
                            <span className="font-medium">1,234</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Active Users</span>
                            <span className="font-medium">567</span>
                        </div>
                        <div className="flex justify-between">
                            <span>This Week</span>
                            <span className="font-medium text-green-600">+89</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumSidebar; 