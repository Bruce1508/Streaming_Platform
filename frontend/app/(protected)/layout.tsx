'use client';

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";
import { useAuthSession } from "@/hooks/useAuthSession";

// app/(protected)/layout.tsx
export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const { user, isAuthenticated, isLoading } = useAuthSession();

    console.log('🏠 Protected Layout:', {
        isAuthenticated,
        isLoading,
        pathname
    });

    useEffect(() => {
        // QUAN TRỌNG: Phải check isLoading trước
        if (isLoading) {
            console.log("⏳ Auth still loading...");
            return;
        }

        // Nếu không có user VÀ không phải đang loading
        if (!user && !isLoading) {
            console.log('❌ No user, redirecting to sign-in');
            router.push("/sign-in"); // ← Đổi sang sign-in thay vì sign-up
            return;
        }

        // Check onboarding
        if (user && !user.isOnboarded && pathname !== "/onBoarding") {
            console.log('🔄 Redirecting to onboarding');
            router.push("/onBoarding");
            return;
        }
    }, [isLoading, user, router, pathname]);

    // Show loader while checking auth
    if (isLoading) {
        console.log('⏳ Showing loader - auth loading');
        return <PageLoader />;
    }

    // If no user after loading complete
    if (!user) {
        console.log('🔄 No user, showing loader while redirecting');
        return <PageLoader />;
    }

    // Render children if authenticated
    console.log('✅ Rendering protected content');
    return <>{children}</>;
}