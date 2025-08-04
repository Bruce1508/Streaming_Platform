'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { 
    Home, 
    Compass, 
    BookOpen, 
    TrendingUp,
    GraduationCap,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { ForumNavItem } from '@/types/Forum';

// ===== FORUM SIDEBAR COMPONENT =====
// Left sidebar navigation với filters
interface ForumSidebarProps {
    className?: string;
}

export const ForumSidebar: React.FC<ForumSidebarProps> = ({
    className = ''
}) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isSchoolsOpen, setIsSchoolsOpen] = useState(false);
    const [isTrendingOpen, setIsTrendingOpen] = useState(true);
    
    const currentSchool = searchParams.get('school') || '';

    // ===== NAVIGATION ITEMS =====
    // Chỉ giữ lại 3 items chính như Reddit
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
        }
    ];

    // ===== ICON COMPONENT =====
    const IconComponent = ({ iconName }: { iconName: string }) => {
        const icons: Record<string, any> = {
            Home,
            Compass,
            BookOpen,
            TrendingUp,
            GraduationCap
        };
        
        const Icon = icons[iconName] || Home;
        return <Icon className="w-5 h-5" />;
    };

    return (
        <div className={`bg-[#ffffff] border border-gray-200 h-full shadow-sm ${className}`}>
            <div className="p-4">

                {/* ===== MAIN NAVIGATION ===== */}
                <div className="mb-6">
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                    ${item.active 
                                        ? 'bg-gray-900 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                `}
                            >
                                <IconComponent iconName={item.icon} />
                                <span className="flex-1">{item.label}</span>
                                {item.count && (
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* ===== TRENDING TOPICS ===== */}
                <div className="mb-6">
                    <button
                        onClick={() => setIsTrendingOpen(!isTrendingOpen)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 hover:text-gray-700 transition-colors"
                    >
                        <span>TRENDING TOPICS</span>
                        {isTrendingOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {isTrendingOpen && (
                        <div className="space-y-1">
                            {[
                                { tag: 'javascript', count: 125 },
                                { tag: 'react', count: 89 },
                                { tag: 'nextjs', count: 67 },
                                { tag: 'typescript', count: 54 },
                                { tag: 'nodejs', count: 43 }
                            ].map((topic, index) => (
                                <Link
                                    key={index}
                                    href={`/forum?tag=${topic.tag}`}
                                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                        #{topic.tag}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                        {topic.count}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ===== SCHOOL FILTERS ===== */}
                <div className="mb-6">
                    <button
                        onClick={() => setIsSchoolsOpen(!isSchoolsOpen)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 hover:text-gray-700 transition-colors"
                    >
                        <span>SCHOOLS</span>
                        {isSchoolsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {isSchoolsOpen && (
                        <div className="space-y-1">
                            {[
                                { value: '', label: 'All Schools', icon: '🎓' },
                                { value: 'centennial', label: 'Centennial College', icon: '🏛️' },
                                { value: 'george-brown', label: 'George Brown College', icon: '🏫' },
                                { value: 'humber', label: 'Humber College', icon: '🎓' },
                                { value: 'seneca', label: 'Seneca College', icon: '🏛️' },
                                { value: 'tmu', label: 'Toronto Metropolitan University', icon: '🏫' },
                                { value: 'manitoba', label: 'University of Manitoba', icon: '🎓' }
                            ].map((school) => {
                                const handleClick = () => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    if (school.value) {
                                        params.set('school', school.value);
                                    } else {
                                        params.delete('school');
                                    }
                                    router.push(`/forum?${params.toString()}`);
                                };
                                
                                const isActive = currentSchool === school.value || (!currentSchool && school.value === '');
                                
                                return (
                                    <button
                                        key={school.value}
                                        onClick={handleClick}
                                        className={`w-full cursor-pointer text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-gray-200 text-gray-900' 
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className="text-lg">{school.icon}</span>
                                        <span className="flex-1 truncate">{school.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default ForumSidebar; 