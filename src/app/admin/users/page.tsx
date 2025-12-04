'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddUserModal, { UserFormData } from './AddUserModal';
import EditUserModal, { EditUserFormData } from './EditUserModal';
import ConfirmModal from './ConfirmModal';
import './users.css';

interface User {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_verified: boolean;
    phone_number?: string;
    home_street?: string;
    home_city?: string;
    home_state?: string;
    home_country?: string;
    home_zip_code?: string;
    is_email_list?: boolean;
    created_at: string;
}

type SortField = 'created_at' | 'email' | 'status';
type SortOrder = 'asc' | 'desc';

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalState, setEditModalState] = useState<{ isOpen: boolean; user: User | null }>({
        isOpen: false,
        user: null
    });
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; userId: string | null }>({
        isOpen: false,
        userId: null
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        checkAuth();
        fetchUsers();
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

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams();
            params.append('limit', '100');
            params.append('offset', '0');
            if (searchQuery) {
                params.append('query', searchQuery);
            }
            params.append('sort', `${sortField}.${sortOrder}`);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/users?${params}`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setLoading(true);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
        setLoading(true);
    };

    useEffect(() => {
        if (loading) {
            fetchUsers();
        }
    }, [searchQuery, sortField, sortOrder]);

    const handleDelete = (userId: string) => {
        setConfirmModal({ isOpen: true, userId });
    };

    const handleEdit = (user: User) => {
        setEditModalState({ isOpen: true, user });
    };

    const handleConfirmDelete = async () => {
        const userId = confirmModal.userId;
        if (!userId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/users/${userId}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to delete user');
            }

            setUsers(prevUsers => prevUsers.filter(u => u.user_id !== userId));
            setConfirmModal({ isOpen: false, userId: null });
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAddUser = async (formData: UserFormData) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/users`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to add user');
            }

            const newUser = await response.json();
            setUsers([newUser.data || newUser, ...users]);
            setError('');
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleEditUser = async (userId: string, formData: EditUserFormData) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/users/${userId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update user');
            }

            const updatedUser = await response.json();
            setUsers(prevUsers =>
                prevUsers.map(u => u.user_id === userId ? (updatedUser.data || updatedUser) : u)
            );
            setError('');
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return ' ↕';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    if (loading) {
        return (
            <div className="users-container">
                <div className="glass users-loading">
                    Loading users...
                </div>
            </div>
        );
    }

    return (
        <div className="users-container">
            <header className="users-header glass">
                <div>
                    <Link href="/admin" className="back-link">← Back to Dashboard</Link>
                    <h1 className="users-title">Manage Users</h1>
                    <p className="users-subtitle">View, search, and manage user accounts</p>
                </div>
                <button className="add-user-button" onClick={() => setIsModalOpen(true)}>
                    + Add User
                </button>
            </header>

            {error && (
                <div className="error-message glass-error">
                    {error}
                </div>
            )}

            <section className="users-controls glass">
                <input
                    type="text"
                    placeholder="Search by email, name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                />
            </section>

            <section className="users-section glass">
                <div className="users-table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('email')} className="sortable">
                                    Email{getSortIndicator('email')}
                                </th>
                                <th>Name</th>
                                <th onClick={() => handleSort('status')} className="sortable">
                                    Status{getSortIndicator('status')}
                                </th>
                                <th onClick={() => handleSort('created_at')} className="sortable">
                                    Joined{getSortIndicator('created_at')}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.user_id}>
                                        <td className="user-email">{user.email}</td>
                                        <td>{user.first_name} {user.last_name}</td>
                                        <td>
                                            <div className="status-cell">
                                                <span className={`status-badge ${user.is_verified ? 'verified' : 'unverified'}`}>
                                                    {user.is_verified ? 'Verified' : 'Unverified'}
                                                </span>
                                                {user.role === 'admin' && <span className="admin-badge">Admin</span>}
                                            </div>
                                        </td>
                                        <td className="user-date">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="action-button edit-btn"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="action-button delete-btn"
                                                onClick={() => handleDelete(user.user_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="empty-state">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddUser}
            />

            <EditUserModal
                isOpen={editModalState.isOpen}
                onClose={() => setEditModalState({ isOpen: false, user: null })}
                onSubmit={handleEditUser}
                user={editModalState.user}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModal({ isOpen: false, userId: null })}
                isLoading={deleteLoading}
                isDangerous={true}
            />
        </div>
    );
}
