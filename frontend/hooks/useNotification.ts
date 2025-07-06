'use client';
import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/api';
import toast from 'react-hot-toast';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'like' | 'comment' | 'system' | 'general';
    read: boolean;
    createdAt: string;
    updatedAt: string;
    sender?: {
        _id: string;
        fullName: string;
        profilePic: string;
    };
    relatedId?: string;
    relatedModel?: string;
}

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getNotifications({ page: 1, limit: 50 });
            
            if (response.data?.success) {
                setNotifications(response.data.notifications || []);
                setUnreadCount(response.data.unreadCount || 0);
            } else {
                throw new Error('Failed to fetch notifications');
            }
            
        } catch (err: any) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications');
            
            // Fallback to mock data if API fails
            const mockNotifications: Notification[] = [
                {
                    _id: '1',
                    title: 'Welcome to StudyBuddy!',
                    message: 'Thanks for joining our platform. Start exploring programs and courses.',
                    type: 'system',
                    read: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    title: 'Your review was liked',
                    message: 'Someone liked your review on Computer Science program.',
                    type: 'like',
                    read: true,
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                }
            ];
            
            setNotifications(mockNotifications);
            setUnreadCount(mockNotifications.filter(n => !n.read).length);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            // Optimistic update
            setNotifications(prev => 
                prev.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, read: true }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            
            // API call
            await markNotificationAsRead(notificationId);
            
        } catch (err: any) {
            console.error('Error marking notification as read:', err);
            // Revert optimistic update on error
            setNotifications(prev => 
                prev.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, read: false }
                        : notification
                )
            );
            setUnreadCount(prev => prev + 1);
            toast.error('Failed to mark notification as read');
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            // Optimistic update
            const unreadNotifications = notifications.filter(n => !n.read);
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, read: true }))
            );
            setUnreadCount(0);
            
            // API call
            await markAllNotificationsAsRead();
            toast.success('All notifications marked as read');
            
        } catch (err: any) {
            console.error('Error marking all notifications as read:', err);
            // Revert optimistic update on error
            fetchNotifications();
            toast.error('Failed to mark all notifications as read');
        }
    }, [notifications, fetchNotifications]);

    const refreshNotifications = useCallback(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        loading,
        error,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications
    };
}; 