'use client';

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import PageLoader from "@/components/ui/PageLoader";

// app/(protected)/layout.tsx
export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();

    console.log('🏠 Protected Layout:', {
        status,
        hasSession: !!session,
        pathname,
        userEmail: session?.user?.email
    });

    useEffect(() => {
        // Wait for session to load
        if (status === 'loading') {
            console.log("⏳ Session still loading...");
            return;
        }

        // If not authenticated, redirect to sign-in
        if (status === 'unauthenticated' || !session) {
            console.log('❌ No session, redirecting to sign-in');
            router.push("/sign-in");
            return;
        }
    }, [status, session, router, pathname]);

    // Show loader while checking auth
    if (status === 'loading') {
        console.log('⏳ Showing loader - session loading');
        return <PageLoader />;
    }

    // If no session after loading complete
    if (status === 'unauthenticated' || !session) {
        console.log('🔄 No session, showing loader while redirecting');
        return <PageLoader />;
    }

    // Render children if authenticated
    console.log('✅ Rendering protected content');
    return <>{children}</>;
}