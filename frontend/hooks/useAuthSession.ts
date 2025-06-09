import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";

export function useAuthSession() {
    const { data: session, status } = useSession({
        required: false,
        // Không refetch liên tục
        onUnauthenticated() {
            console.log("Session unauthenticated");
        },
    });
    
    const { user, isLoading } = useAuth();
    
    // Combine both auth methods
    const isAuthenticated = !!(session || user);
    const isSessionLoading = status === "loading" || isLoading;
    
    return {
        session,
        user,
        isAuthenticated,
        isLoading: isSessionLoading,
        status
    };
}