'use client';

import { useState } from 'react';
import './promotions.css';

interface AddPromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => Promise<void>;
}

export default function AddPromotionModal({ isOpen, onClose, onSubmit }: AddPromotionModalProps) {
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

            await onSubmit(submitData);
            setFormData({
                code: '',
                description: '',
                discount_percent: '',
                starts_at: '',
                ends_at: '',
                max_uses: '',
                per_user_limit: '',
                is_active: true
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add promotion');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content modal-large">
                <div className="modal-header">
                    <h2>Add New Promotion</h2>
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
                                placeholder="SAVE20"
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
                                placeholder="20"
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
                            placeholder="Optional description"
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
                                placeholder="Optional"
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
                                placeholder="Optional"
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
                            {loading ? 'Adding...' : 'Add Promotion'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
