import { Request, Response } from "express";
import Notification from "../models/Notification";
import User, { IUser } from "../models/User";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

// Create notification helper function
export const createNotification = async (data: {
    recipient: string;
    sender?: string;
    type: 'like' | 'comment' | 'system' | 'general';
    title: string;
    message: string;
    relatedId?: string;
    relatedModel?: string;
}) => {
    try {
        const notification = await Notification.create(data);
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Get user notifications
export async function getNotifications(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = Math.min(parseInt(limit as string), 50);
        const skip = (pageNum - 1) * limitNum;

        const query: any = { recipient: userId };
        if (unreadOnly === 'true') {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .populate('sender', 'fullName profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ 
            recipient: userId, 
            read: false 
        });

        return res.status(200).json({
            success: true,
            notifications,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            },
            unreadCount
        });

    } catch (error: any) {
        console.error("Error in getNotifications:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Mark notification as read
export async function markAsRead(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;
        const { notificationId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });

    } catch (error: any) {
        console.error("Error in markAsRead:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Mark all notifications as read
export async function markAllAsRead(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const result = await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );

        return res.status(200).json({
            success: true,
            message: `${result.modifiedCount} notifications marked as read`,
            modifiedCount: result.modifiedCount
        });

    } catch (error: any) {
        console.error("Error in markAllAsRead:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Delete notification
export async function deleteNotification(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;
        const { notificationId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted"
        });

    } catch (error: any) {
        console.error("Error in deleteNotification:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
} 