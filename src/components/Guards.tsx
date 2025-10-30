'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/lib/auth';

type GuardProps = {
    children: React.ReactNode;
    /** Where to send the user if the guard blocks them. Defaults to '/'. */
    redirectTo?: string;
    /** Optional: render this while auth state is loading. */
    loadingFallback?: React.ReactNode;
};

export function RequireAuth({
                                children,
                                redirectTo = '/login',
                                loadingFallback = <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>,
                            }: GuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace(redirectTo);
    }, [loading, user, router, redirectTo]);

    if (loading) return <>{loadingFallback}</>;
    if (!user) return null;
    return <>{children}</>;
}

export function RequireRole({
                                role,
                                children,
                                redirectTo = '/',
                                loadingFallback = <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>,
                            }: GuardProps & { role: Role }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== role)) router.replace(redirectTo);
    }, [loading, user, role, router, redirectTo]);

    if (loading) return <>{loadingFallback}</>;
    if (!user || user.role !== role) return null;
    return <>{children}</>;
}
