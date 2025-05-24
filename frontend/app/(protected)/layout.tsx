'use client';

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageLoader from "@/components/ui/PageLoader";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useAuth();

    // Check if user just signed up
    const justSignedUp = typeof window !== 'undefined' && 
        sessionStorage.getItem('justSignedUp') === 'true';

    const isAuthenticated = Boolean(user) || justSignedUp;
    const isOnboarded = user?.isOnboarded || false;

    console.log('🏠 Protected Layout:', {
        user,
        isAuthenticated,
        isOnboarded,
        justSignedUp,
        pathname,
        isLoading
    });

    useEffect(() => {
        if (isLoading) return;

        // If not authenticated, redirect to sign-up
        if (!isAuthenticated) {
            router.push("/sign-up");
            return;
        }

        // Handle different routes
        switch (pathname) {
            case "/onBoarding":
                // Allow access to onboarding page if authenticated
                break;

            case "/call":
            case "/chat":
            case "/notifications":
                // These routes require onboarding
                if (!isOnboarded) {
                    router.push("/onBoarding");
                }
                break;

            default:
                // For other protected routes, require onboarding
                if (!isOnboarded && pathname !== "/onBoarding") {
                    router.push("/onBoarding");
                }
        }

        // Clear sign-up flag after successful auth check
        if (justSignedUp && user) {
            sessionStorage.removeItem('justSignedUp');
        }
    }, [isLoading, isAuthenticated, isOnboarded, router, pathname, user, justSignedUp]);

    // Show loader while checking auth
    if (isLoading) {
        return <PageLoader />;
    }

    // Show loader for onboarding page if user is authenticated but not onboarded
    if (pathname === "/onBoarding" && isAuthenticated) {
        return <>{children}</>;
    }

    // Show loader if not authenticated or not onboarded (except onboarding page)
    if (!isAuthenticated || (!isOnboarded && pathname !== "/onBoarding")) {
        return <PageLoader />;
    }

    return <>{children}</>;
}