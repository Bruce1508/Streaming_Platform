"use client";

import React from 'react';
import { useNotification } from '@/hooks/useNotification';
import { Loader2, Bell, Check, X, Clock } from 'lucide-react';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'like' | 'comment' | 'system' | 'general';
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

const NotificationsPage = () => {
    const { notifications, loading, error, markAsRead, markAllAsRead } = useNotification();

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                {notifications.length > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600 text-lg">Loading notifications...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <div className="flex items-center gap-2">
                        <X className="w-5 h-5" />
                        {error}
                    </div>
                </div>
            )}

            {!loading && notifications.length === 0 && (
                <div className="text-center py-16">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No notifications yet</h3>
                    <p className="text-gray-400">When you receive notifications, they'll appear here.</p>
                </div>
            )}

            <div className="space-y-3">
                {notifications.map((notification: Notification) => (
                    <div 
                        key={notification._id} 
                        className={`rounded-lg border p-6 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer ${
                            notification.read 
                                ? 'bg-white border-gray-200' 
                                : 'bg-blue-50 border-blue-200 shadow-sm'
                        }`}
                        onClick={() => markAsRead(notification._id)}
                    >
                        <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {notification.title}
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 ml-3"></div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                {formatDate(notification.createdAt)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'like':
            return <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
            </div>;
        case 'comment':
            return <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
            </div>;
        default:
            return <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
            </div>;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default NotificationsPage; 