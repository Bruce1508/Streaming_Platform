'use client';

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    
    // Kiểm tra nếu người dùng vừa đăng ký
    const justSignedUp = typeof window !== 'undefined' && 
        sessionStorage.getItem('justSignedUp') === 'true';

    const { data: authData, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/auth/me");
                return res.data;
            } catch (error) {
                console.error("Auth check failed:", error);
                return null;
            }
        },
        retry: false,
    });

    const authUser = authData?.user;
    const isAuthenticated = Boolean(authUser) || justSignedUp;
    const isOnboarded = authUser?.isOnboarded || justSignedUp;

    console.log('Protected layout - Auth data:', authData);
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
    // không hiển thị nội dung nhưng không chuyển hướng ở đây
    if (!isAuthenticated || (!isOnboarded && pathname !== "/onboarding")) {
        return <PageLoader />;
    }

    return <>{children}</>;
}