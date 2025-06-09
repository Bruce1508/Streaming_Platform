// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useSession, signOut as nextAuthSignOut, signOut, getSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { getAuthUser } from "@/lib/api"; // ✅ Import function có sẵn

interface User {
    _id: string;
    fullName: string;
    email: string;
    profilePic: string;
    isOnboarded: boolean;
    bio: string;
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
    refreshUser: () => Promise<void>; // ✅ Thêm vào interface
    isLoading: boolean;
    authMethod: 'oauth' | 'credentials' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authMethod, setAuthMethod] = useState<'oauth' | 'credentials' | null>(null);

    // ✅ Sử dụng getAuthUser thay vì fetchUserData
    const fetchUserData = useCallback(async (accessToken: string) => {
        try {
            // Token đã được set trong header bởi makeAuthenticationRequest
            const response = await getAuthUser();
            return response?.user || null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }, []);

    // Effect để xử lý authentication
    useEffect(() => {
        const initAuth = async () => {
            if (status === 'loading') {
                return;
            }

            if (session?.user && session?.accessToken) {
                console.log('🔐 NextAuth session detected');
                
                // Set token để makeAuthenticationRequest có thể sử dụng
                localStorage.setItem('auth_token', session.accessToken);
                
                const fullUserData = await fetchUserData(session.accessToken);
                
                if (fullUserData) {
                    setUser(fullUserData);
                    setToken(session.accessToken);
                    setAuthMethod('oauth');
                }
                
                // Clear localStorage sau khi dùng xong (OAuth không cần lưu)
                localStorage.removeItem('auth_token');
            } else {
                console.log('🔑 Checking localStorage for credentials auth');
                
                const savedToken = localStorage.getItem('auth_token');
                const savedUser = localStorage.getItem('auth_user');

                if (savedToken && savedUser) {
                    try {
                        const userData = await fetchUserData(savedToken);
                        
                        if (userData) {
                            setUser(userData);
                            setToken(savedToken);
                            setAuthMethod('credentials');
                        } else {
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('auth_user');
                        }
                    } catch (error) {
                        console.error('Error validating saved token:', error);
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('auth_user');
                    }
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, [session, status, fetchUserData]);

    // Login function cho credentials
    const login = useCallback((userData: User, token: string) => {
        console.log('🔐 Credentials login');
        setUser(userData);
        setToken(token);
        setAuthMethod('credentials');
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
    }, []);

    // Logout function
    const logout = async () => {
        console.log("🔴 Logout started");
        try {
            // Clear local storage
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            console.log("🗑️ Local storage cleared");
            
            // Clear state
            setUser(null);
            setAuthMethod(null);
            console.log("🔄 State cleared");
            
            // Clear NextAuth session if exists
            const session = await getSession();
            if (session) {
                console.log("🔐 Clearing NextAuth session");
                await signOut({ redirect: false });
            }
            
            console.log("✅ Logout complete");
            
            // Redirect to sign-in
            router.push("/sign-in");
        } catch (error) {
            console.error("❌ Logout error:", error);
        }
    };

    // Update user function
    const updateUser = useCallback((userData: User) => {
        console.log('🔄 Updating user data');
        setUser(userData);
        
        if (authMethod === 'credentials') {
            localStorage.setItem('auth_user', JSON.stringify(userData));
        }
    }, [authMethod]);

    // ✅ Refresh user function
    const refreshUser = useCallback(async () => {
        try {
            console.log('🔄 Refreshing user data...');
            
            // Đảm bảo có token
            if (!token && authMethod === 'oauth' && session?.accessToken) {
                // Tạm thời set token cho OAuth
                localStorage.setItem('auth_token', session.accessToken);
            }
            
            const response = await getAuthUser();
            
            if (response?.user) {
                setUser(response.user);
                console.log('✅ User data refreshed');
            }
            
            // Clear temp token nếu là OAuth
            if (authMethod === 'oauth') {
                localStorage.removeItem('auth_token');
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    }, [token, authMethod, session]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            refreshUser, 
            updateUser, 
            isLoading,
            authMethod
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}