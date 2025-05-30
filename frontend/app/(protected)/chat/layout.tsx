'use client';

import { ReactNode } from "react";
import Navbar from "@/components/ui/NavBar";

interface ChatLayoutProps {
    children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar only - no sidebar */}
            <Navbar />

            {/* Full-width chat content */}
            <main className="flex-1 overflow-hidden bg-base-100">
                {children}
            </main>
        </div>
    );
}