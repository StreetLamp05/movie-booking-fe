'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserAPI } from '@/lib/api';
import type { Address, PaymentCard } from '@/lib/types';
import { validateRequired, validatePhone, validateZipCode, validateCardNumber, validateCVV, validateExpirationDate } from '@/lib/validation';


export default function ProfilePage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        subscribed_to_promotions: false
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);

    const [showAddAddress, setShowAddAddress] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip_code: ''
    });

    const [newCard, setNewCard] = useState({
        card_number: '',
        card_type: 'Visa',
        expiration_month: new Date().getMonth() + 1,
        expiration_year: new Date().getFullYear(),
        cvv: ''
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
            phone: user.phone || '',
            subscribed_to_promotions: user.subscribed_to_promotions
        });

        loadAddresses();
        loadPaymentCards();
    }, [user, router]);

    const loadAddresses = async () => {
        try {
            const data = await UserAPI.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error('Failed to load addresses:', error);
        }
    };

    const loadPaymentCards = async () => {
        try {
            const data = await UserAPI.getPaymentCards();
            setPaymentCards(data);
        } catch (error) {
            console.error('Failed to load payment cards:', error);
        }
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const validateProfileUpdate = (): boolean => {
        const newErrors: Record<string, string> = {};

        const firstNameError = validateRequired(profileData.first_name, 'First name');
        if (firstNameError) newErrors.first_name = firstNameError;

        const lastNameError = validateRequired(profileData.last_name, 'Last name');
        if (lastNameError) newErrors.last_name = lastNameError;

        if (profileData.phone) {
            const phoneError = validatePhone(profileData.phone);
            if (phoneError) newErrors.phone = phoneError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!validateProfileUpdate()) return;

        setLoading(true);

        try {
            await UserAPI.updateProfile(profileData);
            await refreshUser();
            setSuccessMessage('Profile updated successfully! A confirmation email has been sent.');
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

        if (!passwordData.current_password) {
            setErrorMessage('Please enter your current password.');
            return;
        }

        setLoading(true);

        try {
            await UserAPI.updateProfile({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
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

    const handleAddAddress = async (e: FormEvent) => {
        e.preventDefault();

        if (addresses.length >= 1) {
            setErrorMessage('You can only have one billing address.');
            return;
        }

        setLoading(true);

        try {
            await UserAPI.addAddress(newAddress);
            await loadAddresses();
            setNewAddress({ street: '', city: '', state: '', zip_code: '' });
            setShowAddAddress(false);
            setSuccessMessage('Address added successfully!');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to add address.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            await UserAPI.deleteAddress(id);
            await loadAddresses();
            setSuccessMessage('Address deleted successfully!');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to delete address.');
        }
    };

    const handleAddCard = async (e: FormEvent) => {
        e.preventDefault();

        if (paymentCards.length >= 4) {
            setErrorMessage('You can only have up to 4 payment cards.');
            return;
        }

        const cardError = validateCardNumber(newCard.card_number);
        if (cardError) {
            setErrorMessage(cardError);
            return;
        }

        const cvvError = validateCVV(newCard.cvv);
        if (cvvError) {
            setErrorMessage(cvvError);
            return;
        }

        const expirationError = validateExpirationDate(newCard.expiration_month, newCard.expiration_year);
        if (expirationError) {
            setErrorMessage(expirationError);
            return;
        }

        setLoading(true);

        try {
            await UserAPI.addPaymentCard(newCard);
            await loadPaymentCards();
            setNewCard({
                card_number: '',
                card_type: 'Visa',
                expiration_month: new Date().getMonth() + 1,
                expiration_year: new Date().getFullYear(),
                cvv: ''
            });
            setShowAddCard(false);
            setSuccessMessage('Payment card added successfully!');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to add payment card.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (id: number) => {
        if (!confirm('Are you sure you want to delete this payment card?')) return;

        try {
            await UserAPI.deletePaymentCard(id);
            await loadPaymentCards();
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
                                name="phone"
                                value={profileData.phone}
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
                                name="subscribed_to_promotions"
                                checked={profileData.subscribed_to_promotions}
                                onChange={handleProfileChange}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                                Subscribe to promotional emails
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
                            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>
                                Change Password
                            </h3>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.9rem'
                                }}>
                                    Current Password <span style={{ color: '#ff6b6b' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
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
                                    fontSize: '0.9rem'
                                }}>
                                    New Password <span style={{ color: '#ff6b6b' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
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
                                    fontSize: '0.9rem'
                                }}>
                                    Confirm New Password <span style={{ color: '#ff6b6b' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={passwordData.confirm_password}
                                    onChange={handlePasswordChange}
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

                {/* Billing Address */}
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
                            Billing Address
                        </h2>
                        {addresses.length === 0 && (
                            <button
                                onClick={() => setShowAddAddress(!showAddAddress)}
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
                                Add Address
                            </button>
                        )}
                    </div>

                    {addresses.map(addr => (
                        <div key={addr.id} style={{
                            padding: '16px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            marginBottom: '12px'
                        }}>
                            <p style={{ color: 'white', marginBottom: '4px' }}>{addr.street}</p>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {addr.city}, {addr.state} {addr.zip_code}
                            </p>
                            <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                style={{
                                    marginTop: '8px',
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

                    {showAddAddress && (
                        <form onSubmit={handleAddAddress} style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
                            <input
                                type="text"
                                placeholder="Street Address *"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <input
                                    type="text"
                                    placeholder="City *"
                                    value={newAddress.city}
                                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
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
                                <input
                                    type="text"
                                    placeholder="State *"
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
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
                                    placeholder="ZIP *"
                                    value={newAddress.zip_code}
                                    onChange={(e) => setNewAddress(prev => ({ ...prev, zip_code: e.target.value }))}
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
                                Save Address
                            </button>
                        </form>
                    )}

                    {addresses.length === 0 && !showAddAddress && (
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                            No billing address on file
                        </p>
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
                            Payment Cards (Max 4)
                        </h2>
                        {paymentCards.length < 4 && (
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

                    {paymentCards.map(card => (
                        <div key={card.id} style={{
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
                                    {card.card_type} •••• {card.card_number_last4}
                                </p>
                                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                                    Expires {card.expiration_month}/{card.expiration_year}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteCard(card.id)}
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
                            <input
                                type="text"
                                placeholder="Card Number *"
                                value={newCard.card_number}
                                onChange={(e) => setNewCard(prev => ({ ...prev, card_number: e.target.value }))}
                                required
                                maxLength={19}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                <select
                                    value={newCard.card_type}
                                    onChange={(e) => setNewCard(prev => ({ ...prev, card_type: e.target.value }))}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="Visa">Visa</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="Amex">Amex</option>
                                    <option value="Discover">Discover</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Month *"
                                    value={newCard.expiration_month}
                                    onChange={(e) => setNewCard(prev => ({ ...prev, expiration_month: parseInt(e.target.value) }))}
                                    required
                                    min={1}
                                    max={12}
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
                                    type="number"
                                    placeholder="Year *"
                                    value={newCard.expiration_year}
                                    onChange={(e) => setNewCard(prev => ({ ...prev, expiration_year: parseInt(e.target.value) }))}
                                    required
                                    min={new Date().getFullYear()}
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
                                    placeholder="CVV *"
                                    value={newCard.cvv}
                                    onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                                    required
                                    maxLength={4}
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

                    {paymentCards.length === 0 && !showAddCard && (
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                            No payment cards on file
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}
