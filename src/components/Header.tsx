'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    const dashHref = user?.role === 'admin' ? '/admin' : '/dashboard';

    return (
        <header
            className="glass"
            style={{
                padding: '1.5rem 2rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <Link
                    href="/"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    CineGlass Theatre
                </Link>

                <Link href="/" style={{ color: 'var(--text-secondary)' }}>Movies</Link>
                <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About</Link>

                {!loading && user && (
                    <Link href={dashHref} className="glass" style={{ padding: '6px 12px', borderRadius: 8 }}>
                        Dashboard
                    </Link>
                )}

                {!loading && user?.role === 'admin' && (
                    <Link href="/admin" className="glass" style={{ padding: '6px 12px', borderRadius: 8 }}>
                        Admin
                    </Link>
                )}
            </nav>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {loading ? (
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>…</span>
                ) : user ? (
                    <>
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {user.first_name ? `Hi, ${user.first_name}` : user.email}
                {!user.is_verified && (
                    <span style={{ marginLeft: 8, color: '#ffae42' }} title="Email not verified">
                  (unverified)
                </span>
                )}
                {user.role === 'admin' && (
                    <span style={{ marginLeft: 8, color: '#7dd3fc' }} title="Administrator">[admin]</span>
                )}
            </span>

                        <Link className="glass" href="/account" style={{ padding: '6px 12px', borderRadius: 8 }}>
                            Profile
                        </Link>

                        <button
                            onClick={async () => {
                                await logout();
                                router.push('/login');
                            }}
                            style={{ padding: '6px 12px' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link className="glass" href="/login" style={{ padding: '6px 12px', borderRadius: 8 }}>
                            Log in
                        </Link>
                        <Link
                            className="glass"
                            href="/signup"
                            style={{
                                padding: '6px 12px',
                                borderRadius: 8,
                                background: 'var(--accent)',
                                borderColor: 'var(--accent)',
                            }}
                        >
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
