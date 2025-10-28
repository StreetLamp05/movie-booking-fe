"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<{ first_name: string; last_name: string; email: string } | null>(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (err) {
                console.error('Failed to parse user data:', err);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
        router.refresh();
    };

    return (
        <header style={{ padding: '1rem 0' }}>
            <nav style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Link href="/">Team 5's Theatre</Link>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span style={{ fontSize: '14px' }}>
                                Welcome, {user.first_name}!
                            </span>
                            { (user as any)?.is_admin && (
                              <Link href="/admin">Admin</Link>
                            )}
                            <Link href="/profile/edit">Edit Profile</Link>
                            <button 
                                onClick={handleLogout}
                                style={{ 
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div style={{ display: "flex", gap: 12 }}>
                            <Link href="/signup">
                                <button style={{ padding: "8px 16px" }}>Sign Up</button>
                            </Link>
                            <Link href="/login">
                                <button style={{ padding: "8px 16px" }}>Login</button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}