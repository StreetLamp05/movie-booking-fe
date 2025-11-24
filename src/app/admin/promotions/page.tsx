'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddPromotionModal from './AddPromotionModal';
import EditPromotionModal from './EditPromotionModal';
import SendPromotionModal from './SendPromotionModal';
import ConfirmModal from './ConfirmModal';
import './promotions.css';

interface Promotion {
    promotion_id: string;
    code: string;
    description?: string;
    discount_percent: number;
    starts_at: string;
    ends_at: string;
    max_uses?: number;
    per_user_limit?: number;
    is_active: boolean;
    created_at: string;
}

type SortField = 'created_at' | 'code' | 'discount_percent';
type SortOrder = 'asc' | 'desc';

export default function PromotionsPage() {
    const router = useRouter();
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalState, setEditModalState] = useState<{ isOpen: boolean; promotion: Promotion | null }>({
        isOpen: false,
        promotion: null
    });
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; promotionId: string | null }>({
        isOpen: false,
        promotionId: null
    });
    const [sendEmailModalState, setSendEmailModalState] = useState<{ isOpen: boolean; promotion: Promotion | null }>({
        isOpen: false,
        promotion: null
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        checkAuth();
        fetchPromotions();
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
                return;
            }
        } catch (err) {
            router.push('/auth/login');
        }
    };

    const fetchPromotions = async () => {
        setLoading(true);
        setError('');
        try {
            const sortParam = `${sortField}.${sortOrder}`;
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/promotions?query=${encodeURIComponent(searchQuery)}&sort=${sortParam}`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch promotions');
            }

            const data = await response.json();
            setPromotions(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        // Refetch with new search
        setTimeout(() => {
            const sortParam = `${sortField}.${sortOrder}`;
            fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/promotions?query=${encodeURIComponent(value)}&sort=${sortParam}`,
                { credentials: 'include' }
            )
                .then(res => res.json())
                .then(data => setPromotions(data.data || []))
                .catch(err => setError(err.message));
        }, 300);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, [sortField, sortOrder]);

    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return ' ↕';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    const handleAddPromotion = async (formData: any) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/promotions`,
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
                throw new Error(errorData.error?.message || 'Failed to add promotion');
            }

            const newPromotion = await response.json();
            setPromotions(prev => [newPromotion, ...prev]);
            setIsModalOpen(false);
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleEdit = (promotion: Promotion) => {
        setEditModalState({ isOpen: true, promotion });
    };

    const handleEditPromotion = async (promotionId: string, formData: any) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/promotions/${promotionId}`,
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
                throw new Error(errorData.error?.message || 'Failed to update promotion');
            }

            const updatedPromotion = await response.json();
            setPromotions(prev =>
                prev.map(p => p.promotion_id === promotionId ? updatedPromotion : p)
            );
            setEditModalState({ isOpen: false, promotion: null });
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const handleDelete = (promotionId: string) => {
        setConfirmModal({ isOpen: true, promotionId });
    };

    const handleSendEmail = (promotion: Promotion) => {
        setSendEmailModalState({ isOpen: true, promotion });
    };

    const confirmDelete = async () => {
        if (!confirmModal.promotionId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/promotions/${confirmModal.promotionId}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete promotion');
            }

            setPromotions(prev => prev.filter(p => p.promotion_id !== confirmModal.promotionId));
            setConfirmModal({ isOpen: false, promotionId: null });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <Link href="/admin" className="back-link">← Back to Admin</Link>

            <div className="promotions-container">
                <div className="promotions-header glass">
                    <div>
                        <h1 className="promotions-title">Manage Promotions</h1>
                        <p className="promotions-subtitle">{promotions.length} total promotions</p>
                    </div>
                    <button className="add-promotion-button" onClick={() => setIsModalOpen(true)}>
                        + Add Promotion
                    </button>
                </div>

                {error && <div className="error-message glass-error">{error}</div>}

                <section className="promotions-controls glass">
                    <input
                        type="text"
                        placeholder="Search by code, description..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="search-input"
                    />
                </section>

                <section className="promotions-section glass">
                    <div className="promotions-table-wrapper">
                        <table className="promotions-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('code')} className="sortable">
                                        Code{getSortIndicator('code')}
                                    </th>
                                    <th>Description</th>
                                    <th onClick={() => handleSort('discount_percent')} className="sortable">
                                        Discount{getSortIndicator('discount_percent')}
                                    </th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Limits</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promotions.length > 0 ? (
                                    promotions.map(promotion => {
                                        const startDate = new Date(promotion.starts_at);
                                        const endDate = new Date(promotion.ends_at);
                                        const now = new Date();
                                        const isExpired = now > endDate;
                                        const isActive = promotion.is_active && !isExpired;

                                        return (
                                            <tr key={promotion.promotion_id}>
                                                <td className="promotion-code">{promotion.code}</td>
                                                <td className="promotion-desc">{promotion.description || '—'}</td>
                                                <td className="promotion-discount">{promotion.discount_percent}%</td>
                                                <td className="promotion-duration">
                                                    {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                                                        {isExpired ? 'Expired' : (isActive ? 'Active' : 'Inactive')}
                                                    </span>
                                                </td>
                                                <td className="promotion-limits">
                                                    {promotion.max_uses ? `${promotion.max_uses} uses` : '—'}
                                                    {promotion.per_user_limit && `, ${promotion.per_user_limit} per user`}
                                                </td>
                                                <td className="actions-cell">
                                                    <button
                                                        className="action-button send-btn"
                                                        onClick={() => handleSendEmail(promotion)}
                                                        title="Send promotion email to subscribers"
                                                    >
                                                        ✉
                                                    </button>
                                                    <button
                                                        className="action-button edit-btn"
                                                        onClick={() => handleEdit(promotion)}
                                                        title="Edit promotion"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="action-button delete-btn"
                                                        onClick={() => handleDelete(promotion.promotion_id)}
                                                        title="Delete promotion"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="empty-state">
                                            {loading ? 'Loading...' : 'No promotions found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <AddPromotionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPromotion}
            />

            <EditPromotionModal
                isOpen={editModalState.isOpen}
                onClose={() => setEditModalState({ isOpen: false, promotion: null })}
                onSubmit={handleEditPromotion}
                promotion={editModalState.promotion}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, promotionId: null })}
                onConfirm={confirmDelete}
                title="Delete Promotion"
                message="Are you sure you want to delete this promotion? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDangerous={true}
                isLoading={deleteLoading}
            />

            <SendPromotionModal
                isOpen={sendEmailModalState.isOpen}
                promotion={sendEmailModalState.promotion}
                onClose={() => setSendEmailModalState({ isOpen: false, promotion: null })}
                onSuccess={() => fetchPromotions()}
            />
        </>
    );
}
