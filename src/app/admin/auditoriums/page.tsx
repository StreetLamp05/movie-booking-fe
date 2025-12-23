'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddAuditoriumModal, { AuditoriumFormData } from './AddAuditoriumModal';
import EditAuditoriumModal from './EditAuditoriumModal';
import ConfirmModal from './ConfirmModal';
import './auditoriums.css';

interface EditAuditoriumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (auditoriumId: string, auditoriumData: AuditoriumFormData) => Promise<void>;
    auditorium: {
        id: string;
        name: string;
        num_rows?: number;
        num_cols?: number;
    } | null;
}

interface LocalAuditorium {
    id: string;
    auditorium_id?: number;
    name: string;
    row_count?: number;
    col_count?: number;
    num_rows?: number;
    num_cols?: number;
    created_at?: string;
}

export default function AuditoriumsPage() {
    const router = useRouter();
    const [auditoriums, setAuditoriums] = useState<LocalAuditorium[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalState, setEditModalState] = useState<{ isOpen: boolean; auditorium: LocalAuditorium | null }>({
        isOpen: false,
        auditorium: null
    });
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; auditoriumId: string | null }>({
        isOpen: false,
        auditoriumId: null
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        checkAuth();
        fetchAuditoriums();
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

    const fetchAuditoriums = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auditoriums?limit=100`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch auditoriums');
            }

            const data = await response.json();
            setAuditoriums(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (auditoriumId: string) => {
        setConfirmModal({ isOpen: true, auditoriumId });
    };

    const handleEdit = (auditorium: LocalAuditorium) => {
        setEditModalState({ isOpen: true, auditorium });
    };

    const handleConfirmDelete = async () => {
        const auditoriumId = confirmModal.auditoriumId;
        if (!auditoriumId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auditoriums/${auditoriumId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to delete auditorium');
            }

            setConfirmModal({ isOpen: false, auditoriumId: null });
            setError('');
            // Refresh the page
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAddAuditorium = async (formData: AuditoriumFormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auditoriums`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    row_count: formData.num_rows,
                    col_count: formData.num_cols
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to add auditorium');
            }

            const newAuditorium = await response.json();
            const auditoriumToAdd = newAuditorium.data || newAuditorium;
            setAuditoriums([auditoriumToAdd, ...auditoriums]);
            setError('');
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleEditAuditorium = async (auditoriumId: string, formData: AuditoriumFormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auditoriums/${auditoriumId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    row_count: formData.num_rows,
                    col_count: formData.num_cols
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update auditorium');
            }

            const updatedAuditorium = await response.json();
            setAuditoriums(prevAuditoriums => prevAuditoriums.map(a => a.auditorium_id?.toString() === auditoriumId || a.id === auditoriumId ? (updatedAuditorium.data || updatedAuditorium) : a));
            setError('');
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    if (loading) {
        return (
            <div className="auditoriums-container">
                <div className="glass auditoriums-loading">
                    Loading auditoriums...
                </div>
            </div>
        );
    }

    // @ts-ignore
    return (
        <div className="auditoriums-container">
            <header className="auditoriums-header glass">
                <div>
                    <Link href="/admin" className="back-link">← Back to Dashboard</Link>
                    <h1 className="auditoriums-title">Manage Auditoriums</h1>
                    <p className="auditoriums-subtitle">Add, edit, and remove auditoriums from your cinema</p>
                </div>
                <button className="add-auditorium-button" onClick={() => setIsModalOpen(true)}>
                    + Add Auditorium
                </button>
            </header>

            {error && (
                <div className="error-message glass-error">
                    {error}
                </div>
            )}

            <section className="auditoriums-section glass">
                <div className="auditoriums-table-wrapper">
                    <table className="auditoriums-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Rows</th>
                                <th>Columns</th>
                                <th>Seats</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditoriums.length > 0 ? (
                                auditoriums.map(auditorium => (
                                    <tr key={auditorium.auditorium_id || auditorium.id}>
                                        <td className="auditorium-name">{auditorium.name}</td>
                                        <td>{auditorium.row_count || auditorium.num_rows || 0}</td>
                                        <td>{auditorium.col_count || auditorium.num_cols || 0}</td>
                                        <td>{(auditorium.row_count || auditorium.num_rows || 0) * (auditorium.col_count || auditorium.num_cols || 0)}</td>
                                        <td className="actions-cell">
                                            <button 
                                                className="action-button edit-btn"
                                                onClick={() => handleEdit(auditorium)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="action-button delete-btn"
                                                onClick={() => handleDelete(auditorium.auditorium_id?.toString() || auditorium.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="empty-state">
                                        No auditoriums found. Add one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <AddAuditoriumModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddAuditorium}
            />

            <EditAuditoriumModal 
                isOpen={editModalState.isOpen}
                onClose={() => setEditModalState({ isOpen: false, auditorium: null })}
                onSubmit={handleEditAuditorium}
                auditorium={editModalState.auditorium ? {
                    id: editModalState.auditorium.auditorium_id?.toString() || editModalState.auditorium.id,
                    name: editModalState.auditorium.name,
                    num_rows: editModalState.auditorium.row_count || editModalState.auditorium.num_rows || 0,
                    num_cols: editModalState.auditorium.col_count || editModalState.auditorium.num_cols || 0
                } : null}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title="Delete Auditorium"
                message="Are you sure you want to delete this auditorium? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModal({ isOpen: false, auditoriumId: null })}
                isLoading={deleteLoading}
                isDangerous={true}
            />
        </div>
    );
}
