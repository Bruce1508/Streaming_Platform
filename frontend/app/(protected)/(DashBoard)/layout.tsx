'use client';

import { ReactNode } from "react";
import Navbar from "@/components/ui/NavBar";
import Sidebar from "@/components/ui/SideBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (  
    <div className="min-h-screen flex">
      {/* Sidebar - hidden on mobile, visible on lg+ */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-base-100">
          {children}
        </main>
      </div>
    </div>
  );
}