'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/lib/auth';

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;
    if (!user) return null;
    return <>{children}</>;
}

export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== role)) router.replace('/'); // punt to home if no access
    }, [loading, user, role, router]);

    if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;
    if (!user || user.role !== role) return null;
    return <>{children}</>;
}
