'use client';

import { useState, useEffect } from 'react';
import './AddUserModal.css';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userId: string, userData: EditUserFormData) => Promise<void>;
    user: User | null;
}

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

interface PaymentCard {
    billing_info_id: string;
    card_type: string;
    cardholder_name: string;
    card_last4: string;
    card_exp: string;
    billing_address: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
    };
}

export interface EditUserFormData {
    email?: string;
    role?: 'admin' | 'user';
    is_verified?: boolean;
    phone_number?: string;
    home_street?: string;
    home_city?: string;
    home_state?: string;
    home_country?: string;
    home_zip_code?: string;
    is_email_list?: boolean;
}

export default function EditUserModal({ isOpen, onClose, onSubmit, user }: EditUserModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'info' | 'cards'>('info');
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [cardsLoading, setCardsLoading] = useState(false);
    const [formData, setFormData] = useState<EditUserFormData>({
        email: user?.email || '',
        role: user?.role as 'admin' | 'user' || 'user',
        is_verified: user?.is_verified || false,
        phone_number: user?.phone_number || '',
        home_street: user?.home_street || '',
        home_city: user?.home_city || '',
        home_state: user?.home_state || '',
        home_country: user?.home_country || '',
        home_zip_code: user?.home_zip_code || '',
        is_email_list: user?.is_email_list !== undefined ? user.is_email_list : true
    });

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                role: user.role as 'admin' | 'user' || 'user',
                is_verified: user.is_verified || false,
                phone_number: user.phone_number || '',
                home_street: user.home_street || '',
                home_city: user.home_city || '',
                home_state: user.home_state || '',
                home_country: user.home_country || '',
                home_zip_code: user.home_zip_code || '',
                is_email_list: user.is_email_list !== undefined ? user.is_email_list : true
            });
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (isOpen && user && activeTab === 'cards') {
            fetchUserCards();
        }
    }, [isOpen, user, activeTab]);

    const fetchUserCards = async () => {
        if (!user) return;
        setCardsLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/users/${user.user_id}/cards`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch cards');
            }

            const data = await response.json();
            setCards(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCardsLoading(false);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!window.confirm('Delete this payment method?')) return;
        if (!user) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/admin/users/${user.user_id}/cards/${cardId}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete card');
            }

            setCards(prevCards => prevCards.filter(c => c.billing_info_id !== cardId));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;
        const isCheckbox = (target as HTMLInputElement).type === 'checkbox';
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setError('');
        setLoading(true);

        try {
            await onSubmit(user.user_id, formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content modal-large">
                <div className="modal-header">
                    <div>
                        <h2>Edit User</h2>
                        <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>{user.email}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        User Info
                    </button>
                    <button
                        className={`modal-tab ${activeTab === 'cards' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cards')}
                    >
                        Payment Cards
                    </button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                {activeTab === 'info' && (
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="role">Role *</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone_number">Phone Number</label>
                                <input
                                    id="phone_number"
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="(123) 456-7890"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="home_street">Street Address</label>
                            <input
                                id="home_street"
                                type="text"
                                name="home_street"
                                value={formData.home_street}
                                onChange={handleChange}
                                placeholder="123 Main St"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="home_city">City</label>
                                <input
                                    id="home_city"
                                    type="text"
                                    name="home_city"
                                    value={formData.home_city}
                                    onChange={handleChange}
                                    placeholder="New York"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="home_state">State</label>
                                <input
                                    id="home_state"
                                    type="text"
                                    name="home_state"
                                    value={formData.home_state}
                                    onChange={handleChange}
                                    placeholder="NY"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="home_zip_code">ZIP Code</label>
                                <input
                                    id="home_zip_code"
                                    type="text"
                                    name="home_zip_code"
                                    value={formData.home_zip_code}
                                    onChange={handleChange}
                                    placeholder="10001"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="home_country">Country</label>
                            <input
                                id="home_country"
                                type="text"
                                name="home_country"
                                value={formData.home_country}
                                onChange={handleChange}
                                placeholder="United States"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label htmlFor="is_verified">
                                <input
                                    id="is_verified"
                                    type="checkbox"
                                    name="is_verified"
                                    checked={formData.is_verified}
                                    onChange={handleChange}
                                />
                                <span>Verified</span>
                            </label>

                            <label htmlFor="is_email_list">
                                <input
                                    id="is_email_list"
                                    type="checkbox"
                                    name="is_email_list"
                                    checked={formData.is_email_list}
                                    onChange={handleChange}
                                />
                                <span>Subscribed to Promotions</span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? 'Updating...' : 'Update User'}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'cards' && (
                    <div className="cards-section">
                        {cardsLoading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                                Loading cards...
                            </div>
                        ) : cards.length > 0 ? (
                            <div className="cards-list">
                                {cards.map(card => (
                                    <div key={card.billing_info_id} className="card-item">
                                        <div className="card-info">
                                            <div className="card-row">
                                                <span className="card-badge">{card.card_type.toUpperCase()}</span>
                                                <span className="card-number">•••• •••• •••• {card.card_last4}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="card-label">Cardholder:</span>
                                                <span>{card.cardholder_name}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="card-label">Expires:</span>
                                                <span>{card.card_exp}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="card-label">Billing:</span>
                                                <span>{card.billing_address.street}</span>
                                            </div>
                                            <div className="card-row">
                                                <span>{card.billing_address.city}, {card.billing_address.state} {card.billing_address.zip_code}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="card-delete-btn"
                                            onClick={() => handleDeleteCard(card.billing_info_id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                                No payment methods on file
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
