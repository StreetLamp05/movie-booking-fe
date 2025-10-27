'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '@/lib/types';
import { AuthAPI } from '@/lib/api';


type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            refreshUser();
        } else {
            setLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            // Note: This would need the backend to implement a /users/profile endpoint
            // For now, we'll just mark as not loading
            setLoading(false);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            localStorage.removeItem('auth_token');
            setUser(null);
            setLoading(false);
        }
    };

    const login = async (data: LoginRequest) => {
        const response = await AuthAPI.login(data);
        localStorage.setItem('auth_token', response.token);
        if (data.remember_me) {
            localStorage.setItem('remember_me', 'true');
        }
        setUser(response.user);
    };

    const register = async (data: RegisterRequest) => {
        const response = await AuthAPI.register(data);
        setUser(response.user);
    };

    const logout = async () => {
        try {
            await AuthAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('remember_me');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
