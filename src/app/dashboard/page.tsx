'use client';

import Link from 'next/link';
import { RequireAuth } from '@/components/Guards';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
    const { user } = useAuth();
    const router = useRouter();

    // If an admin somehow lands here, punt them to the admin dashboard.
    useEffect(() => {
        if (user?.role === 'admin') router.replace('/admin');
    }, [user, router]);

    return (
        <RequireAuth>
            <main style={{ display: 'grid', gap: 24 }}>
                <section className="glass" style={{ padding: 24 }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: 8 }}>Your Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Quick links to your stuff.</p>

                    <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                        <Link className="glass" href="/account" style={{ padding: '10px 16px', borderRadius: 10 }}>
                            Edit Profile
                        </Link>
                        <Link className="glass" href="/" style={{ padding: '10px 16px', borderRadius: 10 }}>
                            Browse Movies
                        </Link>
                        {/* Future: add /bookings once implemented */}
                    </div>
                </section>
            </main>
        </RequireAuth>
    );
}
