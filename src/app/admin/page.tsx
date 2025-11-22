'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './admin.css';

interface DashboardStats {
    totalUsers: number;
    verifiedUsers: number;
    totalMovies: number;
    upcomingShowtimes: number;
}

interface User {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_verified: boolean;
    created_at: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        verifiedUsers: 0,
        totalMovies: 0,
        upcomingShowtimes: 0
    });
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuth();
        fetchDashboardData();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/verify`, {
                credentials: 'include'
            });

            if (!response.ok) {
                router.push('/auth/login');
                return;
            }

            const data = await response.json();
            if (!data.is_admin && data.role !== 'admin') {
                router.push('/');
            }
        } catch (err) {
            router.push('/auth/login');
        }
    };

    const fetchDashboardData = async () => {
        try {
            // Fetch users
            const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/users?limit=5&sort=created_at.desc`, {
                credentials: 'include'
            });

            if (!usersResponse.ok) {
                throw new Error('Failed to fetch users');
            }

            const usersData = await usersResponse.json();
            setRecentUsers(usersData.data);

            // Fetch all users for stats
            const allUsersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/users?limit=100`, {
                credentials: 'include'
            });
            const allUsersData = await allUsersResponse.json();
            
            // Fetch movies
            const moviesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/movies?limit=100`);
            const moviesData = await moviesResponse.json();

            // Fetch showtimes
            const now = new Date();
            const showtimesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/showtimes?from=${now.toISOString()}&limit=100`);
            const showtimesData = await showtimesResponse.json();

            setStats({
                totalUsers: allUsersData.page.total,
                verifiedUsers: allUsersData.data.filter((u: User) => u.is_verified).length,
                totalMovies: moviesData.page.total,
                upcomingShowtimes: showtimesData.page.total
            });
        } catch (err: any) {
            setError(err.message);
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
            router.push('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="glass admin-loading">
                    Loading admin dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <header className="admin-header glass">
                <div>
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-subtitle">CineGlass Theatre Management System</p>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>

            {error && (
                <div className="error-message glass-error">
                    {error}
                </div>
            )}

            <div className="dashboard-grid">
                <div className="stat-card glass">
                    <div className="stat-icon users-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-label">Total Users</div>
                        <div className="stat-detail">{stats.verifiedUsers} verified</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon movies-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                            <line x1="7" y1="2" x2="7" y2="22"></line>
                            <line x1="17" y1="2" x2="17" y2="22"></line>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <line x1="2" y1="7" x2="7" y2="7"></line>
                            <line x1="2" y1="17" x2="7" y2="17"></line>
                            <line x1="17" y1="17" x2="22" y2="17"></line>
                            <line x1="17" y1="7" x2="22" y2="7"></line>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalMovies}</div>
                        <div className="stat-label">Movies</div>
                        <div className="stat-detail">In catalog</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon showtimes-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.upcomingShowtimes}</div>
                        <div className="stat-label">Showtimes</div>
                        <div className="stat-detail">Upcoming</div>
                    </div>
                </div>
            </div>

            <div className="admin-sections">
                <section className="admin-section glass">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="quick-actions">
                        <Link href="/admin/movies" className="action-card glass-secondary">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                                <line x1="7" y1="2" x2="7" y2="22"></line>
                                <line x1="17" y1="2" x2="17" y2="22"></line>
                            </svg>
                            <h3>Manage Movies</h3>
                            <p>Add, edit, or remove movies from catalog</p>
                        </Link>

                        <Link href="/admin/showtimes" className="action-card glass-secondary">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <h3>Manage Showtimes</h3>
                            <p>Schedule movie showtimes and pricing</p>
                        </Link>

                        <Link href="/admin/users" className="action-card glass-secondary">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <h3>Manage Users</h3>
                            <p>View and manage user accounts</p>
                        </Link>

                        <Link href="/admin/auditoriums" className="action-card glass-secondary">
                            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
                                <text x="11" y="18" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="none">%</text>
                            </svg>
                            <h3>Manage Promotions</h3>
                            <p>Configure promotions</p>
                        </Link>
                    </div>
                </section>

                <section className="admin-section glass">
                    <div className="section-header">
                        <h2>Recent Users</h2>
                        <Link href="/admin/users" className="view-all-link">
                            View All →
                        </Link>
                    </div>
                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.first_name} {user.last_name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`status-badge ${user.is_verified ? 'verified' : 'unverified'}`}>
                                                {user.is_verified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
