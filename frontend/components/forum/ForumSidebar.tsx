'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { 
    Home, 
    Compass, 
    BookOpen, 
    MessageSquare,
    TrendingUp,
    Users,
    Settings,
    Clock,
    MessageCircle,
    FileText,
    HelpCircle
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
            MessageSquare,
            TrendingUp,
            Users,
            Settings,
            Clock,
            MessageCircle,
            FileText,
            HelpCircle
        };
        
        const Icon = icons[iconName] || Home;
        return <Icon className="w-5 h-5" />;
    };

    return (
        <div className={` border-r border-gray-700 h-full ${className}`}>
            <div className="p-4">

                {/* ===== MAIN NAVIGATION ===== */}
                <div className="mb-6">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        MENU
                    </div>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                                    ${item.active 
                                        ? 'bg-gray-700 text-white' 
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }
                                `}
                            >
                                <IconComponent iconName={item.icon} />
                                <span className="flex-1">{item.label}</span>
                                {item.count && (
                                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* ===== TRENDING TOPICS ===== */}
                <div className="mb-6">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        TRENDING TOPICS
                    </div>
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
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                            >
                                <span>#{topic.tag}</span>
                                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                                    {topic.count}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ===== SCHOOL FILTERS ===== */}
                <div className="mb-6">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        SCHOOLS
                    </div>
                    <div className="space-y-1">
                        {[
                            { value: '', label: 'All Schools' },
                            { value: 'centennial', label: 'Centennial College' },
                            { value: 'george-brown', label: 'George Brown College' },
                            { value: 'humber', label: 'Humber College' },
                            { value: 'seneca', label: 'Seneca College' },
                            { value: 'tmu', label: 'Toronto Metropolitan University' },
                            { value: 'manitoba', label: 'University of Manitoba' }
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
                                    className={`w-full cursor-pointer text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        isActive 
                                            ? 'bg-gray-700 text-white' 
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {school.label}
                                </button>
                            );
                        })}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ForumSidebar; 