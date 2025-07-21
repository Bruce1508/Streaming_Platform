"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New study material uploaded", time: "2 min ago" },
        { id: 2, message: "Course schedule updated", time: "1 hour ago" },
    ]);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
                        {notifications.length === 0 ? (
                            <p className="text-gray-500 text-sm">No new notifications</p>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}