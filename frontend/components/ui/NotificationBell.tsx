"use client";

import { useState, useEffect } from "react";
import { BellIcon } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";
import Link from "next/link";

export default function NotificationBell() {
    const { notifications } = useNotification();
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        setHasUnread(notifications.some(n => !n.read));
    }, [notifications]);

    return (
        <Link href="/dashboard/notifications">
            <button className="relative p-2 hover:bg-base-200 rounded-lg transition-colors">
                <BellIcon className="w-6 h-6" />
                {hasUnread && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                )}
            </button>
        </Link>
    );
}