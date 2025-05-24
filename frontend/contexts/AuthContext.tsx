'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    }

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
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
