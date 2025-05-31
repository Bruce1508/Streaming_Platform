'use client';

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "next-auth/react";
import PageLoader from "@/components/ui/PageLoader";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading: authLoading } = useAuth();
    const { status: sessionStatus } = useSession();

    // Combined loading state
    const isLoading = authLoading || sessionStatus === 'loading';

    // Check if user just signed up
    const justSignedUp = typeof window !== 'undefined' && 
        sessionStorage.getItem('justSignedUp') === 'true';

    const isAuthenticated = Boolean(user) || justSignedUp;
    const isOnboarded = user?.isOnboarded || false;

    console.log('🏠 Protected Layout:', {
        user: user?._id,
        isAuthenticated,
        isOnboarded,
        justSignedUp,
        pathname,
        isLoading,
        authMethod: user ? 'detected' : 'none'
    });

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // If not authenticated, redirect to sign-up
        if (!isAuthenticated) {
            console.log('❌ Not authenticated, redirecting to sign-up');
            router.push("/sign-up");
            return;
        }

        // If authenticated but not onboarded
        if (isAuthenticated && !isOnboarded) {
            // Allow access to onboarding page
            if (pathname === "/onBoarding") {
                console.log('✅ Allowing access to onboarding page');
                return;
            }
            
            // Redirect other pages to onboarding
            console.log('🔄 Redirecting to onboarding');
            router.push("/onBoarding");
            return;
        }

        // Clear sign-up flag after successful auth check
        if (justSignedUp && user) {
            sessionStorage.removeItem('justSignedUp');
        }
    }, [isLoading, isAuthenticated, isOnboarded, router, pathname, user, justSignedUp]);

    // Show loader while checking auth
    if (isLoading) {
        console.log('⏳ Loading auth state...');
        return <PageLoader />;
    }

    // If not authenticated, show loader (redirect is happening)
    if (!isAuthenticated) {
        console.log('🔄 Redirecting to sign-up...');
        return <PageLoader />;
    }

    // If authenticated but not onboarded and not on onboarding page
    if (isAuthenticated && !isOnboarded && pathname !== "/onBoarding") {
        console.log('🔄 Redirecting to onboarding...');
        return <PageLoader />;
    }

    // Render children if all checks pass
    console.log('✅ Rendering protected content');
    return <>{children}</>;
}