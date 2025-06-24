"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  HomeIcon, 
  SearchIcon, 
  BookOpenIcon, 
  BellIcon, 
  UserIcon,
  HelpCircleIcon,
  LogOutIcon,
  ArrowRightIcon,
  MenuIcon,
  XIcon
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

const SIDEBAR_MENU = [
  { key: "home", label: "Home", icon: HomeIcon, href: "/" },
  { key: "explore", label: "Explore", icon: SearchIcon, href: "/dashboard/materials" },
  { key: "library", label: "My Library", icon: BookOpenIcon, href: "/dashboard/files" },
  { key: "notifications", label: "Notifications", icon: BellIcon, href: "/dashboard/notifications" },
  { key: "profile", label: "Profile", icon: UserIcon, href: "/profile", active: true },
];

const PROFILE_TABS = [
  { key: "uploaded", label: "Uploaded Materials" },
  { key: "bookmarks", label: "Bookmarks" },
  { key: "settings", label: "Settings" },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("uploaded");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = session?.user;

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const avatarLetter = displayName[0]?.toUpperCase() || 'U';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <ProfileSidebar 
              user={user} 
              displayName={displayName}
              avatarLetter={avatarLetter}
              onMenuClick={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white flex-col">
        <ProfileSidebar 
          user={user} 
          displayName={displayName}
          avatarLetter={avatarLetter}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>

            {/* Profile Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8 overflow-x-auto justify-center lg:justify-start">
                {PROFILE_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="max-w-4xl mx-auto">
              {activeTab === "uploaded" && <UploadedMaterialsTab />}
              {activeTab === "bookmarks" && <BookmarksTab />}
              {activeTab === "settings" && <SettingsTab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileSidebar({ 
  user, 
  displayName, 
  avatarLetter,
  onMenuClick 
}: {
  user: any;
  displayName: string;
  avatarLetter: string;
  onMenuClick?: () => void;
}) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* User Profile Section */}
      <div className="p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            {user?.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-xl">{avatarLetter}</span>
            )}
          </div>
          <span className="font-medium text-gray-900">{displayName}</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {SIDEBAR_MENU.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={onMenuClick}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-2">
        <button className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full text-left">
          <HelpCircleIcon className="w-5 h-5" />
          <span className="font-medium">Help and Support</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full text-left"
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}

function UploadedMaterialsTab() {
  return (
    <div className="space-y-8">
      {/* Empty State */}
      <div className="text-center py-16">
        <div className="w-64 h-40 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-6xl">📄</div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No uploaded materials yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start sharing your study materials to help your peers and earn rewards.
        </p>
        <Button className="bg-gray-900 text-white hover:bg-gray-800">
          Upload Material
        </Button>
      </div>
    </div>
  );
}

function BookmarksTab() {
  return (
    <div className="space-y-8">
      {/* Empty State */}
      <div className="text-center py-16">
        <div className="w-64 h-40 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-6xl">🔖</div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Bookmark materials to easily access them later.
        </p>
        <Button className="bg-gray-900 text-white hover:bg-gray-800">
          Explore Materials
        </Button>
      </div>
    </div>
  );
}

function SettingsTab() {
  const settingsItems = [
    {
      title: "Account",
      description: "Manage your account details",
      href: "#"
    },
    {
      title: "Notifications", 
      description: "Manage your notification preferences",
      href: "#"
    },
    {
      title: "Privacy",
      description: "Manage your privacy settings", 
      href: "#"
    },
    {
      title: "About",
      description: "Learn more about StudyBuddy",
      href: "#"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Settings List */}
      <div className="space-y-6">
        {settingsItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
            <div>
              <h4 className="font-semibold text-gray-900">{item.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>

      
    </div>
  );
}