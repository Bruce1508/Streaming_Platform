"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
exports.getNotifications = getNotifications;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
exports.deleteNotification = deleteNotification;
const Notification_1 = __importDefault(require("../models/Notification"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create notification helper function
const createNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield Notification_1.default.create(data);
        return notification;
    }
    catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
});
exports.createNotification = createNotification;
// Get user notifications
function getNotifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const { page = 1, limit = 20, unreadOnly = false } = req.query;
            const pageNum = parseInt(page);
            const limitNum = Math.min(parseInt(limit), 50);
            const skip = (pageNum - 1) * limitNum;
            const query = { recipient: userId };
            if (unreadOnly === 'true') {
                query.read = false;
            }
            const notifications = yield Notification_1.default.find(query)
                .populate('sender', 'fullName profilePic')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);
            const total = yield Notification_1.default.countDocuments(query);
            const unreadCount = yield Notification_1.default.countDocuments({
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
        }
        catch (error) {
            console.error("Error in getNotifications:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
// Mark notification as read
function markAsRead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            const { notificationId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(notificationId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid notification ID"
                });
            }
            const notification = yield Notification_1.default.findOneAndUpdate({ _id: notificationId, recipient: userId }, { read: true }, { new: true });
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
        }
        catch (error) {
            console.error("Error in markAsRead:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
// Mark all notifications as read
function markAllAsRead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const result = yield Notification_1.default.updateMany({ recipient: userId, read: false }, { read: true });
            return res.status(200).json({
                success: true,
                message: `${result.modifiedCount} notifications marked as read`,
                modifiedCount: result.modifiedCount
            });
        }
        catch (error) {
            console.error("Error in markAllAsRead:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
// Delete notification
function deleteNotification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            const { notificationId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(notificationId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid notification ID"
                });
            }
            const notification = yield Notification_1.default.findOneAndDelete({
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
        }
        catch (error) {
            console.error("Error in deleteNotification:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
//# sourceMappingURL=notification.controllers.js.map