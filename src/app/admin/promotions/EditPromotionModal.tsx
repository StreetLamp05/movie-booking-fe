'use client';

import { useState, useEffect } from 'react';
import './promotions.css';

interface EditPromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (promotionId: string, formData: any) => Promise<void>;
    promotion: Promotion | null;
}

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

export default function EditPromotionModal({ isOpen, onClose, onSubmit, promotion }: EditPromotionModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discount_percent: '',
        starts_at: '',
        ends_at: '',
        max_uses: '',
        per_user_limit: '',
        is_active: true
    });

    useEffect(() => {
        if (promotion) {
            const starts = new Date(promotion.starts_at).toISOString().slice(0, 16);
            const ends = new Date(promotion.ends_at).toISOString().slice(0, 16);
            
            setFormData({
                code: promotion.code || '',
                description: promotion.description || '',
                discount_percent: String(promotion.discount_percent) || '',
                starts_at: starts || '',
                ends_at: ends || '',
                max_uses: promotion.max_uses ? String(promotion.max_uses) : '',
                per_user_limit: promotion.per_user_limit ? String(promotion.per_user_limit) : '',
                is_active: promotion.is_active || false
            });
        }
    }, [promotion, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as any;
        const { name, value, type } = target;
        const isCheckbox = type === 'checkbox';
        
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? target.checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!promotion) return;
        
        setError('');
        setLoading(true);

        try {
            const submitData = {
                code: formData.code.trim().toUpperCase(),
                description: formData.description.trim(),
                discount_percent: parseFloat(formData.discount_percent),
                starts_at: formData.starts_at,
                ends_at: formData.ends_at,
                max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
                per_user_limit: formData.per_user_limit ? parseInt(formData.per_user_limit) : null,
                is_active: formData.is_active
            };

            await onSubmit(promotion.promotion_id, submitData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update promotion');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !promotion) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content modal-large">
                <div className="modal-header">
                    <div>
                        <h2>Edit Promotion</h2>
                        <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>{promotion.code}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="code">Promo Code *</label>
                            <input
                                id="code"
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                maxLength="50"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="discount_percent">Discount % *</label>
                            <input
                                id="discount_percent"
                                type="number"
                                name="discount_percent"
                                value={formData.discount_percent}
                                onChange={handleChange}
                                required
                                min="0.01"
                                max="100"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="starts_at">Start Date *</label>
                            <input
                                id="starts_at"
                                type="datetime-local"
                                name="starts_at"
                                value={formData.starts_at}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ends_at">End Date *</label>
                            <input
                                id="ends_at"
                                type="datetime-local"
                                name="ends_at"
                                value={formData.ends_at}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="max_uses">Max Uses</label>
                            <input
                                id="max_uses"
                                type="number"
                                name="max_uses"
                                value={formData.max_uses}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="per_user_limit">Per User Limit</label>
                            <input
                                id="per_user_limit"
                                type="number"
                                name="per_user_limit"
                                value={formData.per_user_limit}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <label htmlFor="is_active">
                            <input
                                id="is_active"
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            <span>Active</span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Promotion'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
