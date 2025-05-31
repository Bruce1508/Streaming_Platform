'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

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

    // Hàm helper để fetch user data từ backend
    const fetchUserData = useCallback(async (accessToken: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.user;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }, []);

    // Effect để xử lý authentication
    useEffect(() => {
        const initAuth = async () => {
            // Đang load NextAuth session
            if (status === 'loading') {
                return;
            }

            // Nếu có NextAuth session (OAuth login)
            if (session?.user && session?.accessToken) {
                console.log('🔐 NextAuth session detected');
                
                // Fetch full user data từ backend
                const fullUserData = await fetchUserData(session.accessToken);
                
                if (fullUserData) {
                    const userData: User = {
                        _id: fullUserData._id,
                        email: fullUserData.email,
                        fullName: fullUserData.fullName,
                        profilePic: fullUserData.profilePic,
                        isOnboarded: fullUserData.isOnboarded,
                        bio: fullUserData.bio || '',
                        nativeLanguage: fullUserData.nativeLanguage || '',
                        learningLanguage: fullUserData.learningLanguage || '',
                        location: fullUserData.location || ''
                    };

                    setUser(userData);
                    setToken(session.accessToken);
                    setAuthMethod('oauth');
                    
                    // Không lưu vào localStorage cho OAuth
                    // NextAuth tự quản lý session
                }
            } 
            // Nếu không có NextAuth session, check localStorage (credentials login)
            else {
                console.log('🔑 Checking localStorage for credentials auth');
                
                const savedToken = localStorage.getItem('auth_token');
                const savedUser = localStorage.getItem('auth_user');

                if (savedToken && savedUser) {
                    try {
                        // Verify token với backend
                        const userData = await fetchUserData(savedToken);
                        
                        if (userData) {
                            setUser(userData);
                            setToken(savedToken);
                            setAuthMethod('credentials');
                        } else {
                            // Token invalid, clear localStorage
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
        
        // Chỉ lưu localStorage cho credentials auth
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
    }, []);

    // Unified logout function
    const logout = useCallback(async () => {
        console.log('🚪 Logging out...');
        
        // Clear local state
        setUser(null);
        setToken(null);
        setAuthMethod(null);
        
        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        
        // If using OAuth, sign out from NextAuth
        if (authMethod === 'oauth') {
            await nextAuthSignOut({ redirect: false });
        }
        
        // Redirect to sign-in
        router.push('/sign-in');
    }, [authMethod, router]);

    // Update user function
    const updateUser = useCallback((userData: User) => {
        console.log('🔄 Updating user data');
        setUser(userData);
        
        // Only update localStorage if using credentials auth
        if (authMethod === 'credentials') {
            localStorage.setItem('auth_user', JSON.stringify(userData));
        }
    }, [authMethod]);

    // Debug logs
    useEffect(() => {
        console.log('🔍 Auth State:', {
            user: user?._id,
            hasToken: !!token,
            authMethod,
            isLoading,
            nextAuthStatus: status
        });
    }, [user, token, authMethod, isLoading, status]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
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
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}