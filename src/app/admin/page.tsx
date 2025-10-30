'use client';

import { RequireRole } from '@/components/Guards';
import Link from 'next/link';

export default function AdminPage() {
    return (
        <RequireRole role="admin">
            <main style={{ display: 'grid', gap: 24 }}>
                <section className="glass" style={{ padding: 24 }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Management tools for movies, showtimes, and users.
                    </p>
                    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: 16 }}>
                        <div className="glass" style={{ padding: 16 }}>
                            <h3 style={{ margin: '0 0 8px 0' }}>Movies</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Create, update, or remove titles.</p>
                            <Link href="#" className="glass" style={{ padding: '8px 12px', display: 'inline-block', marginTop: 10 }}>
                                Manage Movies
                            </Link>
                        </div>
                        <div className="glass" style={{ padding: 16 }}>
                            <h3 style={{ margin: '0 0 8px 0' }}>Showtimes</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Schedule and pricing.</p>
                            <Link href="#" className="glass" style={{ padding: '8px 12px', display: 'inline-block', marginTop: 10 }}>
                                Manage Showtimes
                            </Link>
                        </div>
                        <div className="glass" style={{ padding: 16 }}>
                            <h3 style={{ margin: '0 0 8px 0' }}>Users</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Search, view roles, reset verification.</p>
                            <Link href="#" className="glass" style={{ padding: '8px 12px', display: 'inline-block', marginTop: 10 }}>
                                Manage Users
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </RequireRole>
    );
}
