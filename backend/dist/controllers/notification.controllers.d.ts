import { Request, Response } from "express";
import mongoose from "mongoose";
export declare const createNotification: (data: {
    recipient: string;
    sender?: string;
    type: "like" | "comment" | "system" | "general";
    title: string;
    message: string;
    relatedId?: string;
    relatedModel?: string;
}) => Promise<mongoose.Document<unknown, {}, import("../models/Notification").INotification, {}> & import("../models/Notification").INotification & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare function getNotifications(req: Request, res: Response): Promise<Response | any>;
export declare function markAsRead(req: Request, res: Response): Promise<Response | any>;
export declare function markAllAsRead(req: Request, res: Response): Promise<Response | any>;
export declare function deleteNotification(req: Request, res: Response): Promise<Response | any>;
//# sourceMappingURL=notification.controllers.d.ts.map