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
        <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
            <nav className="flex items-center justify-between py-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                        🎬 Team 5's Theatre
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-sm text-slate-300">
                                Welcome, <span className="font-medium text-white">{user.first_name}</span>!
                            </span>
                            { (user as any)?.is_admin && (
                              <Link
                                href="/admin"
                                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                Admin
                              </Link>
                            )}
                            <Link
                              href="/profile/edit"
                              className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                            >
                              Edit Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <Link href="/signup">
                                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                                  Sign Up
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 hover:text-white transition-colors">
                                  Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}