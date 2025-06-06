"use client";

import { useState, useEffect } from "react";
import { BellIcon } from "lucide-react";
import { useNotifications } from "@/hooks/useNotification";
import Link from "next/link";

export default function NotificationBell() {
    const { friendRequests } = useNotifications();
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        setHasUnread(friendRequests.incomingRequests.length > 0);
    }, [friendRequests]);

    return (
        <Link href="/notifications">
            <button className="relative p-2 hover:bg-base-200 rounded-lg transition-colors">
                <BellIcon className="w-6 h-6" />
                {hasUnread && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                )}
            </button>
        </Link>
    );
}