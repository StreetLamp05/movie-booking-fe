'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserAPI } from '@/lib/api';
import type { BillingInfo } from '@/lib/types';
import { validateRequired, validatePhone, validateZipCode, validateCardNumber, validateCVV } from '@/lib/validation';


export default function ProfilePage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        is_email_list: false,
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zip_code: ''
        }
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [billingCards, setBillingCards] = useState<BillingInfo[]>([]);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);

    const [newCard, setNewCard] = useState({
        card_type: 'credit' as 'credit' | 'debit',
        card_number: '',
        card_exp: '',
        billing_street: '',
        billing_state: '',
        billing_zip_code: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        setProfileData({
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number || '',
            is_email_list: user.is_email_list,
            address: {
                street: user.home_street || '',
                city: user.home_city || '',
                state: user.home_state || '',
                country: user.home_country || '',
                zip_code: user.home_zip_code || ''
            }
        });

        loadCards();
    }, [user, router]);

    const loadCards = async () => {
        try {
            const data = await UserAPI.getCards();
            setBillingCards(data);
        } catch (error) {
            console.error('Failed to load cards:', error);
        }
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleProfileSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        setLoading(true);

        try {
            await UserAPI.updateProfile(profileData);
            await refreshUser();
            setSuccessMessage('Profile updated successfully!');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (passwordData.new_password !== passwordData.confirm_password) {
            setErrorMessage('New passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await UserAPI.updateProfile({
                password: passwordData.new_password
            });

            setSuccessMessage('Password updated successfully!');
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            setShowChangePassword(false);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (billingCards.length >= 4) {
            setErrorMessage('You can only have up to 4 payment cards.');
            return;
        }

        setLoading(true);

        try {
            await UserAPI.addCard(newCard);
            await loadCards();
            setNewCard({
                card_type: 'credit',
                card_number: '',
                card_exp: '',
                billing_street: '',
                billing_state: '',
                billing_zip_code: ''
            });
            setShowAddCard(false);
            setSuccessMessage('Payment card added successfully!');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to add payment card.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm('Are you sure you want to delete this payment card?')) return;

        try {
            await UserAPI.deleteCard(cardId);
            await loadCards();
            setSuccessMessage('Payment card deleted successfully!');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to delete payment card.');
        }
    };

    if (!user) return null;

    return (
        <main style={{ padding: '40px 16px', marginBottom: '60px' }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '300',
                color: 'white',
                marginBottom: '32px',
                letterSpacing: '0.5px'
            }}>
                My Profile
            </h1>

            {successMessage && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    border: '1px solid rgba(76, 175, 80, 0.5)',
                    color: '#4caf50',
                    fontSize: '0.9rem',
                    marginBottom: '24px'
                }}>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    border: '1px solid rgba(255, 107, 107, 0.5)',
                    color: '#ff6b6b',
                    fontSize: '0.9rem',
                    marginBottom: '24px'
                }}>
                    {errorMessage}
                </div>
            )}

            <div style={{ display: 'grid', gap: '32px' }}>
                {/* Profile Information */}
                <section style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '32px'
                }}>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '300',
                        color: 'white',
                        marginBottom: '24px'
                    }}>
                        Profile Information
                    </h2>

                    <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}>
                                    First Name <span style={{ color: '#ff6b6b' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={profileData.first_name}
                                    onChange={handleProfileChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}>
                                    Last Name <span style={{ color: '#ff6b6b' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={profileData.last_name}
                                    onChange={handleProfileChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}>
                                Email Address (Cannot be changed)
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontSize: '1rem',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={profileData.phone_number}
                                onChange={handleProfileChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <h3 style={{ color: 'white', fontSize: '1.2rem', marginTop: '8px' }}>Address</h3>

                        <input
                            type="text"
                            name="street"
                            value={profileData.address.street}
                            onChange={handleAddressChange}
                            placeholder="Street Address"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <input
                                type="text"
                                name="city"
                                value={profileData.address.city}
                                onChange={handleAddressChange}
                                placeholder="City"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                            <input
                                type="text"
                                name="state"
                                value={profileData.address.state}
                                onChange={handleAddressChange}
                                placeholder="State"
                                maxLength={2}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                            <input
                                type="text"
                                name="zip_code"
                                value={profileData.address.zip_code}
                                onChange={handleAddressChange}
                                placeholder="ZIP Code"
                                maxLength={5}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}>
                            <input
                                type="checkbox"
                                name="is_email_list"
                                checked={profileData.is_email_list}
                                onChange={handleProfileChange}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                                Register for promotional emails
                            </span>
                        </label>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowChangePassword(!showChangePassword)}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Change Password
                            </button>
                        </div>
                    </form>

                    {showChangePassword && (
                        <form onSubmit={handlePasswordSubmit} style={{
                            marginTop: '24px',
                            paddingTop: '24px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'grid',
                            gap: '16px'
                        }}>
                            <h3 style={{ color: 'white', fontSize: '1.2rem' }}>
                                Change Password
                            </h3>

                            <input
                                type="password"
                                placeholder="New Password *"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />

                            <input
                                type="password"
                                placeholder="Confirm New Password *"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Update Password
                            </button>
                        </form>
                    )}
                </section>

                {/* Payment Cards */}
                <section style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '32px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '300',
                            color: 'white',
                            margin: 0
                        }}>
                            Payment Cards ({billingCards.length}/4)
                        </h2>
                        {billingCards.length < 4 && (
                            <button
                                onClick={() => setShowAddCard(!showAddCard)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Card
                            </button>
                        )}
                    </div>

                    {billingCards.map(card => (
                        <div key={card.billing_info_id} style={{
                            padding: '16px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            marginBottom: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ color: 'white', marginBottom: '4px' }}>
                                    {card.card_type.toUpperCase()} •••• {card.card_number.slice(-4)}
                                </p>
                                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                                    Expires {card.card_exp}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteCard(card.billing_info_id)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                    color: '#ff6b6b',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}

                    {showAddCard && (
                        <form onSubmit={handleAddCard} style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
                            <select
                                value={newCard.card_type}
                                onChange={(e) => setNewCard(prev => ({ ...prev, card_type: e.target.value as 'credit' | 'debit' }))}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="credit">Credit</option>
                                <option value="debit">Debit</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Card Number (16 digits) *"
                                value={newCard.card_number}
                                onChange={(e) => setNewCard(prev => ({ ...prev, card_number: e.target.value }))}
                                required
                                maxLength={16}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Expiration (MM/YY) *"
                                value={newCard.card_exp}
                                onChange={(e) => setNewCard(prev => ({ ...prev, card_exp: e.target.value }))}
                                required
                                maxLength={5}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Billing Street *"
                                value={newCard.billing_street}
                                onChange={(e) => setNewCard(prev => ({ ...prev, billing_street: e.target.value }))}
                                required
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <input
                                    type="text"
                                    placeholder="State *"
                                    value={newCard.billing_state}
                                    onChange={(e) => setNewCard(prev => ({ ...prev, billing_state: e.target.value }))}
                                    required
                                    maxLength={2}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="ZIP Code *"
                                    value={newCard.billing_zip_code}
                                    onChange={(e) => setNewCard(prev => ({ ...prev, billing_zip_code: e.target.value }))}
                                    required
                                    maxLength={5}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Save Card
                            </button>
                        </form>
                    )}

                    {billingCards.length === 0 && !showAddCard && (
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                            No payment cards on file
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}
