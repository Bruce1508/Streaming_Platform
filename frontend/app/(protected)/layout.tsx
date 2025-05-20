'use client';

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";
import { usePathname } from "next/navigation";
import useAuthUser from "@/hooks/useAuthUser";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    
    // Kiểm tra nếu người dùng vừa đăng ký
    const justSignedUp = typeof window !== 'undefined' && 
        sessionStorage.getItem('justSignedUp') === 'true';

    const {isLoading, authUser} = useAuthUser();

    const isAuthenticated = Boolean(authUser) || justSignedUp;
    const isOnboarded = authUser?.isOnboarded || justSignedUp;

    console.log('Protected layout - Auth data:', authUser);
    console.log('Protected layout - isAuthenticated:', isAuthenticated);
    console.log('Protected layout - isOnboarded:', isOnboarded);
    console.log('Protected layout - justSignedUp:', justSignedUp);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                console.log("Redirecting to sign-up due to not authenticated");
                router.push("/sign-up");
            } else if (!isOnboarded && pathname !== "/onboarding") {
                console.log("Redirecting to onboarding due to not onboarded");
                router.push("/onboarding");
            }
        }
        
        // Xóa flag sau khi đã sử dụng
        if (justSignedUp && authUser) {
            sessionStorage.removeItem('justSignedUp');
        }
    }, [isLoading, isAuthenticated, isOnboarded, router, pathname, authUser, justSignedUp]);

    if (isLoading) return <PageLoader />;
    
    // Nếu không xác thực hoặc không onboarded (trừ trang onboarding),
    if (!isAuthenticated || (!isOnboarded && pathname !== "/onboarding")) {
        return <PageLoader />;
    }

    return <>{children}</>;
}