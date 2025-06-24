'use client';

import { BookCopy, Users, MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const accessLinks = [
    {
        icon: <BookCopy className="h-8 w-8 text-blue-600" />,
        title: "My Courses",
        href: "/dashboard",
        requiresAuth: true
    },
    {
        icon: <Users className="h-8 w-8 text-blue-600" />,
        title: "Study Groups",
        href: "/dashboard/friends",
        requiresAuth: true
    },
    {
        icon: <MessageSquareMore className="h-8 w-8 text-blue-600" />,
        title: "Community Forum",
        href: "/dashboard/materials",
        requiresAuth: true
    }
];

const QuickAccess = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const user = session?.user;

    const handleLinkClick = (link: typeof accessLinks[0], e: React.MouseEvent) => {
        if (link.requiresAuth && !user) {
            e.preventDefault();
            // Redirect to sign-in page with a message
            router.push('/sign-in?message=Please sign in to access this feature');
        }
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {accessLinks.map((link) => (
                        <Link href={user ? link.href : '/sign-in'} key={link.title}>
                            <div 
                                className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                                onClick={(e) => handleLinkClick(link, e)}
                            >
                                {link.icon}
                                <span className="ml-4 text-xl font-medium text-gray-800">{link.title}</span>
                                
                                {/* Show lock icon for unauthenticated users */}
                                {!user && link.requiresAuth && (
                                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                        Login Required
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
                
                {/* Show message for unauthenticated users */}
                {!user && (
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 mb-4">
                            Sign in to access all features and connect with other students
                        </p>
                        <Link 
                            href="/sign-in"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Sign In Now
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default QuickAccess; 