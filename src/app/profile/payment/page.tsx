'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../profile.css';
import './payment.css';

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

export default function PaymentPage() {
    const router = useRouter();
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [addingNew, setAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        card_type: 'credit',
        card_number: '',
        card_exp: '',
        cardholder_name: '',
        billing_street: '',
        billing_city: '',
        billing_state: '',
        billing_zip_code: ''
    });

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/users/cards`, {
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Failed to fetch cards');
            }

            const data = await response.json();
            setCards(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/users/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error?.message || 'Failed to add card');
            }

            await fetchCards();
            setSuccess('Payment method added successfully!');
            setAddingNew(false);
            resetForm();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdateCard = async (cardId: string, updateData: any) => {
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/users/cards/${cardId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error?.message || 'Failed to update card');
            }

            await fetchCards();
            setSuccess('Payment method updated successfully!');
            setEditingId(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm('Are you sure you want to delete this payment method?')) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/users/cards/${cardId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete card');
            }

            await fetchCards();
            setSuccess('Payment method deleted successfully!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            card_type: 'credit',
            card_number: '',
            card_exp: '',
            cardholder_name: '',
            billing_street: '',
            billing_city: '',
            billing_state: '',
            billing_zip_code: ''
        });
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    if (loading) {
        return (
            <main className="profile-container">
                <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    Loading payment methods...
                </div>
            </main>
        );
    }

    return (
        <main className="profile-container">
            <div className="profile-header glass">
                <div>
                    <Link href="/profile" className="back-link">← Back to Profile</Link>
                    <h1 className="profile-title">Payment Methods</h1>
                </div>
            </div>

            {success && (
                <div className="success-message glass">
                    {success}
                </div>
            )}

            {error && (
                <div className="error-message glass-error">
                    {error}
                </div>
            )}

            <div className="profile-content">
                {cards.length < 4 && !addingNew && (
                    <button onClick={() => setAddingNew(true)} className="add-card-button glass">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Payment Method
                    </button>
                )}

                {addingNew && (
                    <section className="profile-section glass">
                        <h2>Add Payment Method</h2>
                        <form onSubmit={handleAddCard} className="payment-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Card Type</label>
                                    <select
                                        name="card_type"
                                        value={formData.card_type}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        name="card_number"
                                        value={formatCardNumber(formData.card_number)}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                            setFormData(prev => ({ ...prev, card_number: value }));
                                        }}
                                        maxLength={19}
                                        placeholder="1234 5678 9012 3456"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="cardholder_name"
                                        value={formData.cardholder_name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input
                                        type="text"
                                        name="card_exp"
                                        value={formData.card_exp}
                                        onChange={handleChange}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        pattern="\d{2}/\d{2}"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <h3>Billing Address</h3>
                            <div className="form-group">
                                <label>Street Address</label>
                                <input
                                    type="text"
                                    name="billing_street"
                                    value={formData.billing_street}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="billing_city"
                                        value={formData.billing_city}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="billing_state"
                                        value={formData.billing_state}
                                        onChange={handleChange}
                                        maxLength={2}
                                        placeholder="GA"
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>ZIP Code</label>
                                    <input
                                        type="text"
                                        name="billing_zip_code"
                                        value={formData.billing_zip_code}
                                        onChange={handleChange}
                                        maxLength={5}
                                        pattern="\d{5}"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAddingNew(false);
                                        resetForm();
                                    }}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="submit-button">
                                    Add Card
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                <div className="cards-grid">
                    {cards.map(card => (
                        <div key={card.billing_info_id} className="payment-card glass">
                            <div className="card-header">
                                <div className="card-type-badge">{card.card_type}</div>
                                <button
                                    onClick={() => handleDeleteCard(card.billing_info_id)}
                                    className="delete-button"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="card-number">•••• •••• •••• {card.card_last4}</div>
                            <div className="card-details">
                                <div>
                                    <div className="detail-label">Name</div>
                                    <div>{card.cardholder_name}</div>
                                </div>
                                <div>
                                    <div className="detail-label">Expires</div>
                                    <div>{card.card_exp}</div>
                                </div>
                            </div>
                            <div className="card-address">
                                <div className="detail-label">Billing Address</div>
                                <div>{card.billing_address.street}</div>
                                <div>{card.billing_address.city}, {card.billing_address.state} {card.billing_address.zip_code}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {cards.length === 0 && !addingNew && (
                    <div className="empty-state-card glass">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                            <line x1="2" y1="10" x2="22" y2="10"></line>
                        </svg>
                        <h3>No Payment Methods</h3>
                        <p>Add a payment method to make booking easier</p>
                    </div>
                )}
            </div>
        </main>
    );
}
