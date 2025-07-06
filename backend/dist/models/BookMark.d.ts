import mongoose, { Document, Model } from 'mongoose';
export interface IBookmark extends Document {
    user: mongoose.Types.ObjectId;
    studyMaterial: mongoose.Types.ObjectId;
    folder?: string;
    tags: string[];
    notes?: string;
    isPrivate: boolean;
    priority: 'low' | 'medium' | 'high';
    reminderDate?: Date;
    accessCount: number;
    lastAccessedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBookmarkModel extends Model<IBookmark> {
    findByUser(userId: string, options?: any): Promise<IBookmark[]>;
    findByFolder(userId: string, folder: string): Promise<IBookmark[]>;
    getUserFolders(userId: string): Promise<string[]>;
    getMostAccessed(userId: string, limit?: number): Promise<IBookmark[]>;
    getUpcomingReminders(userId: string): Promise<IBookmark[]>;
}
export declare const Bookmark: IBookmarkModel;
export default Bookmark;
//# sourceMappingURL=BookMark.d.ts.map