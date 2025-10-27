'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';
import { useAuth } from '@/context/AuthContext';


export default function Header() {
    const router = useRouter();
    const { user, logout, loading } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <header style={{
            background: 'linear-gradient(135deg, #0f1829 0%, #1a1f3a 100%)',
            padding: '1.5rem 0',
            marginBottom: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
            <nav style={{
                maxWidth: 1100,
                margin: '0 auto',
                padding: '0 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <Link href="/" style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textDecoration: 'none',
                    letterSpacing: '0.5px'
                }}>
                    Movie Website
                </Link>
                <div style={{ flex: '0 1 400px' }}>
                    <SearchBar />
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    {!loading && (
                        <>
                            {user ? (
                                <>
                                    <Link href="/profile" style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        transition: 'all 0.2s'
                                    }}>
                                        {user.first_name}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                            color: '#ff6b6b',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        transition: 'all 0.2s'
                                    }}>
                                        Login
                                    </Link>
                                    <Link href="/register" style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        backgroundColor: '#6366f1',
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}>
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}