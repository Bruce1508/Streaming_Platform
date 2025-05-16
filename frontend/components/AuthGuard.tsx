'use client';

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();

    const { data: authData, isLoading, error } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await axiosInstance.get("/auth/me");
            return res.data;
        },
        retry: false,
    });

    const authUser = authData?.user;
    const isAuthenticated = Boolean(authUser);
    const isOnboarded = authUser?.isOnboarded;

    // Thêm logs để debug
    console.log('Auth data:', authData);
    console.log('isLoading:', isLoading);
    console.log('Error:', error);
    console.log('isAuthenticated:', Boolean(authData?.user));
    console.log('isOnboarded:', authData?.user?.isOnboarded);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push("/sign-up");
            } else if (!isOnboarded) {
                router.push("/onboarding");
            }
        }
    }, [isLoading, isAuthenticated, isOnboarded, router]);

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated || !isOnboarded) return null;

    return <>{children}</>;
}