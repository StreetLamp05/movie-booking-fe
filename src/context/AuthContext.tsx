'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '@/lib/types';
import { AuthAPI, UserAPI } from '@/lib/api';


type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    signup: (data: RegisterRequest) => Promise<{ message: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refreshUser();
    }, []);

    const refreshUser = async () => {
        try {
            // Try to get the user profile using the session cookie
            const userData = await UserAPI.getProfile();
            setUser(userData);
        } catch (error) {
            // No active session
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: LoginRequest) => {
        const response = await AuthAPI.login(data);
        setUser(response.user);
    };

    const signup = async (data: RegisterRequest) => {
        const response = await AuthAPI.signup(data);
        // Don't set user yet - they need to verify email first
        return { message: response.messege };
    };

    const logout = async () => {
        try {
            await AuthAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
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
