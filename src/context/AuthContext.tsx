'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthAPI, type AuthUser } from '@/lib/auth';

type AuthState = {
    user: AuthUser | null;
    loading: boolean;
    refresh: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        try {
            const res = await AuthAPI.verify();
            if ((res as any).error) setUser(null);
            else setUser(res as AuthUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email: string, password: string) => {
        await AuthAPI.login({ email, password });
        await refresh();
    };

    const logout = async () => {
        await AuthAPI.logout();
        setUser(null);
    };

    const value = useMemo(() => ({ user, loading, refresh, login, logout }), [user, loading]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
