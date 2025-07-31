'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, Crown, Award, Star } from 'lucide-react';
import { TopUser } from '@/types/Forum';

// ===== FORUM RIGHT SIDEBAR COMPONENT =====
// Sidebar bên phải hiển thị Top Users, Trending Topics, Recent Activity
interface ForumRightSidebarProps {
    className?: string;
}

export const ForumRightSidebar: React.FC<ForumRightSidebarProps> = ({
    className = ''
}) => {
    // ===== STATES =====
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [loading, setLoading] = useState(true);

    // ===== FETCH TOP USERS =====
    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                setLoading(true);
                // TODO: Implement API call to get top users
                // const response = await forumAPI.getTopUsers();
                // setTopUsers(response.data);
                
                // For now, set empty array until API is implemented
                setTopUsers([]);
            } catch (error) {
                console.error('Failed to fetch top users:', error);
                setTopUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopUsers();
    }, []);

    // ===== HELPER FUNCTIONS =====
    const formatReputation = (reputation: number) => {
        if (reputation >= 1000) {
            return `${(reputation / 1000).toFixed(1)}k`;
        }
        return reputation.toString();
    };

    const getUserBadge = (index: number) => {
        if (index === 0) return <Crown className="w-4 h-4 text-yellow-500" />;
        if (index === 1) return <Award className="w-4 h-4 text-gray-400" />;
        if (index === 2) return <Award className="w-4 h-4 text-orange-400" />;
        return <Star className="w-4 h-4 text-gray-300" />;
    };

    // ===== FOOTER LINKS =====
    const footerSections = [
        {
            title: 'Help',
            links: ['Forum Pro', 'Careers']
        },
        {
            title: 'About',
            links: ['Topics', 'Press', 'Terms', 'Privacy Policy']
        }
    ];

    return (
        <div className={`h-full ${className}`}>
            <div className="p-6 space-y-6">
                {/* ===== START NEW TOPIC BUTTON ===== */}
                <Link href="/forum/create">
                    <button className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Start a New Topic
                    </button>
                </Link>

                {/* ===== TOP USERS SECTION ===== */}
                <div className="bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-white">Top Users</h3>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-center py-4 text-gray-400">Loading top users...</p>
                        ) : topUsers.length === 0 ? (
                            <p className="text-center py-4 text-gray-400">No top users data available.</p>
                        ) : (
                            topUsers.map((user, index) => (
                                <div
                                    key={user._id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-600 transition-all duration-200 cursor-pointer"
                                >
                                    {/* User Avatar */}
                                    <div className="relative">
                                        <img
                                            src={user.profilePic || '/default-avatar.png'}
                                            alt={user.fullName}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                                        />
                                        {index < 3 && (
                                            <div className="absolute -top-1 -right-1">
                                                {getUserBadge(index)}
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-white truncate">
                                                {user.fullName}
                                            </p>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                {formatReputation(user.reputation)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {user.postCount} posts
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* View All Link */}
                    <div className="mt-4 pt-3 border-t border-gray-600">
                        <Link
                            href="/forum/leaderboard"
                            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            View All Users →
                        </Link>
                    </div>
                </div>

                {/* ===== TRENDING TOPICS ===== */}
                <div className="bg-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-3">Trending Topics</h3>
                    <div className="space-y-2">
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
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
                            >
                                <span className="text-sm text-gray-300">#{topic.tag}</span>
                                <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded-full">
                                    {topic.count}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ===== RECENT ACTIVITY ===== */}
                <div className="bg-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-3">Recent Activity</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="text-gray-300">
                                    <span className="font-medium text-white">John Doe</span> answered 
                                    <Link href="/forum/123" className="text-blue-400 hover:text-blue-300 transition-colors ml-1">
                                        "How to deploy Next.js?"
                                    </Link>
                                </p>
                                <p className="text-gray-500 text-xs">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="text-gray-300">
                                    <span className="font-medium text-white">Sarah Kim</span> posted 
                                    <Link href="/forum/124" className="text-blue-400 hover:text-blue-300 transition-colors ml-1">
                                        "React State Management"
                                    </Link>
                                </p>
                                <p className="text-gray-500 text-xs">5 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="text-gray-300">
                                    <span className="font-medium text-white">Mike Chen</span> liked 
                                    <Link href="/forum/125" className="text-blue-400 hover:text-blue-300 transition-colors ml-1">
                                        "CSS Grid Layout"
                                    </Link>
                                </p>
                                <p className="text-gray-500 text-xs">10 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== FOOTER LINKS ===== */}
                <div className="pt-4 border-t border-gray-600">
                    {footerSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-4">
                            <h4 className="text-sm font-medium text-white mb-2">
                                {section.title}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {section.links.map((link, linkIndex) => (
                                    <Link
                                        key={linkIndex}
                                        href={`/${link.toLowerCase().replace(' ', '-')}`}
                                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ForumRightSidebar; 