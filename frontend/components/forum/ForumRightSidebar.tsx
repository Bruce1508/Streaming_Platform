'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Clock, Users, Star, MessageCircle } from 'lucide-react';
import { forumAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

// ===== COLLAPSIBLE SECTION COMPONENT =====
interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    icon,
    children,
    defaultOpen = true
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-[#ffffff] border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="font-medium text-gray-900">{title}</h3>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
            </button>
            
            {isOpen && (
                <div className="border-t border-gray-200">
                    {children}
                </div>
            )}
        </div>
    );
};

// ===== MAIN RIGHT SIDEBAR COMPONENT =====
interface ForumRightSidebarProps {
    currentPostId?: string;
    showOtherDiscussions?: boolean;
}

const ForumRightSidebar: React.FC<ForumRightSidebarProps> = ({ 
    currentPostId, 
    showOtherDiscussions = false 
}) => {
    const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [topContributors, setTopContributors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch real data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const [trendingRes, activityRes, contributorsRes] = await Promise.all([
                    forumAPI.getTrendingTopics(),
                    forumAPI.getRecentActivity(),
                    forumAPI.getTopContributors()
                ]);

                if (trendingRes.success) setTrendingTopics(trendingRes.data || []);
                if (activityRes.success) setRecentActivity(activityRes.data || []);
                if (contributorsRes.success) setTopContributors(contributorsRes.data || []);
            } catch (error) {
                console.error('Error fetching sidebar data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatTimeAgo = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'unknown';
        }
    };

    return (
        <div className="space-y-4">
            {/* ===== OTHER DISCUSSIONS SECTION (only show on post detail) ===== */}
            {showOtherDiscussions && (
                <CollapsibleSection
                    title="Other discussions"
                    icon={<MessageCircle className="w-4 h-4 text-blue-400" />}
                    defaultOpen={true}
                >
                    <div className="p-4 space-y-3">
                        {[
                            { 
                                title: 'Best practices for Node.js development?', 
                                author: 'john_dev', 
                                time: '2h ago', 
                                votes: 45,
                                comments: 12,
                                category: 'question'
                            },
                            { 
                                title: 'Struggling with React hooks implementation', 
                                author: 'sarah_codes', 
                                time: '4h ago', 
                                votes: 32,
                                comments: 8,
                                category: 'discussion'
                            },
                            { 
                                title: 'Database design for student management system', 
                                author: 'mike_student', 
                                time: '6h ago', 
                                votes: 28,
                                comments: 15,
                                category: 'course-specific'
                            },
                            { 
                                title: 'Tips for acing the final exam?', 
                                author: 'anna_study', 
                                time: '8h ago', 
                                votes: 67,
                                comments: 23,
                                category: 'exam'
                            }
                        ].map((discussion, index) => (
                            <div key={index} className="hover:bg-gray-50 p-3 rounded-lg cursor-pointer transition-colors border-l-2 border-gray-300 hover:border-blue-500">
                                <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
                                    {discussion.title}
                                </h4>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <span>u/{discussion.author}</span>
                                        <span>•</span>
                                        <span>{discussion.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {discussion.votes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" />
                                            {discussion.comments}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-gray-200">
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                View more discussions →
                            </button>
                        </div>
                    </div>
                </CollapsibleSection>
            )}

            {/* ===== TRENDING TOPICS SECTION ===== */}
            <CollapsibleSection
                title="Trending Topics"
                icon={<TrendingUp className="w-4 h-4 text-red-400" />}
                defaultOpen={true}
            >
                <div className="p-4 space-y-3">
                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
                                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : trendingTopics.length > 0 ? (
                        trendingTopics.map((topic, index) => (
                            <div key={index} className="flex items-center justify-between hover:bg-gray-800/30 p-2 rounded-lg cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-400 hover:text-blue-300">#{topic.tag}</p>
                                        <p className="text-xs text-gray-400">{topic.postCount} posts</p>
                                    </div>
                                </div>
                                <span className="text-xs text-green-400 font-medium">+{topic.trendPercentage}%</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm">No trending topics yet</p>
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            {/* ===== RECENT ACTIVITY SECTION ===== */}
            <CollapsibleSection
                title="Recent Activity"
                icon={<Clock className="w-4 h-4 text-blue-400" />}
                defaultOpen={false}
            >
                <div className="p-4 space-y-3">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
                                        <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 hover:bg-gray-800/30 p-2 rounded-lg cursor-pointer transition-colors">
                                <img 
                                    src={activity.avatar} 
                                    alt={activity.user}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white">
                                        <span className="font-medium">{activity.user}</span>
                                        <span className="text-gray-400 ml-1">{activity.action}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{activity.target}</p>
                                    <p className="text-xs text-gray-500">{formatTimeAgo(activity.time)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm">No recent activity</p>
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            {/* ===== TOP CONTRIBUTORS SECTION ===== */}
            <CollapsibleSection
                title="Top Contributors"
                icon={<Users className="w-4 h-4 text-purple-400" />}
                defaultOpen={false}
            >
                <div className="p-4 space-y-3">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                                        <div>
                                            <div className="h-4 bg-gray-700 rounded w-20 mb-1"></div>
                                            <div className="h-3 bg-gray-800 rounded w-16"></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="h-4 bg-gray-700 rounded w-12 mb-1"></div>
                                        <div className="h-3 bg-gray-800 rounded w-8"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : topContributors.length > 0 ? (
                        topContributors.map((contributor, index) => {
                            const badges = ['🏆', '🥈', '🥉', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐'];
                            return (
                                <div key={index} className="flex items-center justify-between hover:bg-gray-800/30 p-2 rounded-lg cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{badges[index] || '⭐'}</span>
                                        <div>
                                            <p className="text-sm font-medium text-white">{contributor.name || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-400">{contributor.program || 'Unknown Program'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-yellow-400">{contributor.points}</p>
                                        <p className="text-xs text-gray-500">points</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm">No contributors yet</p>
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            {/* ===== FORUM RULES SECTION ===== */}
            <CollapsibleSection
                title="Forum Rules"
                icon={<Star className="w-4 h-4 text-green-400" />}
                defaultOpen={false}
            >
                <div className="p-4 space-y-2">
                    {[
                        'Be respectful and civil',
                        'No spam or self-promotion',
                        'Use descriptive titles',
                        'Search before posting',
                        'Stay on topic'
                    ].map((rule, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{rule}</span>
                        </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-gray-800">
                        <button className="text-xs text-blue-400 hover:text-blue-300 underline">
                            View full guidelines
                        </button>
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    );
};

export default ForumRightSidebar;