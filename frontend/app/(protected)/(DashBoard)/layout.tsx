"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/SideBar";
import TopBar from "@/components/ui/TopBar";

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {

    console.log("📦 DashboardLayout rendering");
    console.log("👶 Children:", children);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-base-100">
            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
                <Sidebar />
            </div>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-base-100">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                
                {/* Page content - ĐÂY LÀ NƠI HIỂN THỊ NỘI DUNG */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}