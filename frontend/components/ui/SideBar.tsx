'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
    ShipWheelIcon, 
    HomeIcon, 
    BookOpenIcon, 
    UsersIcon, 
    BellIcon, 
    UserIcon, 
    FolderIcon 
} from "lucide-react";
import ProfileDropDown from "./ProfileDropDown";

const Sidebar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const sidebarItems = [
        { icon: HomeIcon, label: "Dashboard", href: "/" },
        { icon: BookOpenIcon, label: "Materials", href: "/materials" },
        { icon: FolderIcon, label: "My Files", href: "/files" },
        { icon: UsersIcon, label: "Friends", href: "/friends" },
        { icon: BellIcon, label: "Notifications", href: "/notifications" },
        { icon: UserIcon, label: "Profile", href: "/profile" },
    ];

    return (
        <div className="w-64 bg-base-200 h-screen fixed left-0 top-0 z-20 border-r border-base-300 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-base-300">
                <Link href="/" className="flex items-center gap-2.5">
                    <ShipWheelIcon className="size-8 text-primary" />
                    <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                        StudyBuddy
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {sidebarItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                    isActive(item.href)
                                        ? "bg-primary text-primary-content"
                                        : "text-base-content hover:bg-base-300"
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-base-300">
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            {((user as any)?.profilePic || user?.image) ? (
                                <img 
                                    src={(user as any)?.profilePic || user?.image || ''} 
                                    alt="User Avatar" 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-primary" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-base-content truncate">
                            {(user as any)?.fullName || user?.name || 'User'}
                        </p>
                        <p className="text-xs text-base-content/60 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <ProfileDropDown className="w-full" />
            </div>
        </div>
    );
};

export default Sidebar;