'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    role: string;
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, [pathname]);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/verify`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            router.push('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <header className="glass" style={{ 
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <Link href="/" style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    CineGlass Theatre
                </Link>
                <Link href="/" style={{ 
                    color: pathname === '/' ? 'var(--accent)' : 'var(--text-secondary)',
                    transition: 'color 0.2s'
                }}>
                    Movies
                </Link>
                {user && user.role === 'admin' && (
                    <Link href="/admin" style={{ 
                        color: pathname.startsWith('/admin') ? 'var(--accent)' : 'var(--text-secondary)',
                        transition: 'color 0.2s'
                    }}>
                        Admin
                    </Link>
                )}
            </nav>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                {!loading && (
                    <>
                        {user ? (
                            <>
                                <Link href="/profile" style={{ 
                                    color: pathname.startsWith('/profile') ? 'var(--accent)' : 'var(--text-secondary)',
                                    transition: 'color 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8" cy="7" r="4"></circle>
                                    </svg>
                                    {user.first_name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--border-radius-small)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--surface-primary)';
                                        e.currentTarget.style.borderColor = 'var(--accent)';
                                        e.currentTarget.style.color = 'var(--accent)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" style={{
                                    color: 'var(--text-secondary)',
                                    transition: 'color 0.2s'
                                }}>
                                    Sign In
                                </Link>
                                <Link href="/auth/signup" style={{
                                    background: 'var(--accent)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--border-radius-small)',
                                    fontWeight: 500,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--accent-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--accent)';
                                }}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}
