import mongoose, { Document, Model } from 'mongoose';
export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'comment' | 'rating' | 'material-approved' | 'material-rejected' | 'new-material' | 'course-update' | 'reminder' | 'system' | 'enrollment' | 'achievement' | 'report-resolved';
    relatedModel?: 'StudyMaterial' | 'Course' | 'Program' | 'User' | 'Enrollment';
    relatedId?: mongoose.Types.ObjectId;
    metadata?: {
        course?: {
            id: mongoose.Types.ObjectId;
            name: string;
            code: string;
        };
        material?: {
            id: mongoose.Types.ObjectId;
            title: string;
            category: string;
        };
        user?: {
            id: mongoose.Types.ObjectId;
            name: string;
            profilePic?: string;
        };
        action?: string;
        grade?: string;
        points?: number;
    };
    isRead: boolean;
    isArchived: boolean;
    readAt?: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    channels: ('in-app' | 'email' | 'push')[];
    scheduledFor?: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface INotificationModel extends Model<INotification> {
    findByUser(userId: string, options?: any): Promise<INotification[]>;
    findUnread(userId: string): Promise<INotification[]>;
    markAsRead(userId: string, notificationIds: string[]): Promise<any>;
    markAllAsRead(userId: string): Promise<any>;
    createNotification(data: Partial<INotification>): Promise<INotification>;
    getNotificationStats(userId: string): Promise<any>;
    cleanupExpired(): Promise<any>;
}
export declare const Notification: INotificationModel;
export default Notification;
//# sourceMappingURL=Notification.d.ts.map