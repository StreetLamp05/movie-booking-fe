'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserAPI } from '@/lib/api';
import type { BillingInfo } from '@/lib/types';

export default function ProfilePage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [subscribeToEmails, setSubscribeToEmails] = useState(false);

    const [cards, setCards] = useState<BillingInfo[]>([]);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCardType, setNewCardType] = useState<'credit' | 'debit'>('credit');
    const [newCardNumber, setNewCardNumber] = useState('');
    const [newCardExp, setNewCardExp] = useState('');
    const [newCardStreet, setNewCardStreet] = useState('');
    const [newCardState, setNewCardState] = useState('');
    const [newCardZip, setNewCardZip] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        setFirstName(user.first_name);
        setLastName(user.last_name);
        setPhone(user.phone_number || '');
        setStreet(user.home_street || '');
        setCity(user.home_city || '');
        setState(user.home_state || '');
        setZipCode(user.home_zip_code || '');
        setSubscribeToEmails(user.is_email_list);

        loadCards();
    }, [user, router]);

    const loadCards = async () => {
        try {
            const data = await UserAPI.getCards();
            setCards(data);
        } catch (err) {
            console.error('Failed to load cards');
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user) return;

        try {
            await UserAPI.updateUser(user.user_id, {
                first_name: firstName,
                last_name: lastName,
                phone_number: phone,
                is_email_list: subscribeToEmails,
                address: {
                    street: street,
                    city: city,
                    state: state,
                    zip_code: zipCode
                }
            });
            await refreshUser();
            setSuccess('Profile updated!');
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (cards.length >= 4) {
            setError('Max 4 cards allowed');
            return;
        }

        try {
            await UserAPI.addCard({
                card_type: newCardType,
                card_number: newCardNumber,
                card_exp: newCardExp,
                billing_street: newCardStreet,
                billing_state: newCardState,
                billing_zip_code: newCardZip
            });
            await loadCards();
            setNewCardNumber('');
            setNewCardExp('');
            setNewCardStreet('');
            setNewCardState('');
            setNewCardZip('');
            setShowAddCard(false);
            setSuccess('Card added!');
        } catch (err: any) {
            setError(err.message || 'Failed to add card');
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm('Delete this card?')) return;

        try {
            await UserAPI.deleteCard(cardId);
            await loadCards();
            setSuccess('Card deleted!');
        } catch (err: any) {
            setError(err.message || 'Failed to delete card');
        }
    };

    if (!user) return null;

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>My Profile</h1>

            {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '40px'
            }}>
                <form onSubmit={handleUpdateProfile}>
                    <h2 style={{ color: 'white', marginBottom: '20px' }}>Profile Info</h2>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#ddd' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <h3 style={{ color: 'white', marginTop: '20px', marginBottom: '10px' }}>Address</h3>

                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="Street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        maxLength={2}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="text"
                        placeholder="ZIP"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        maxLength={5}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={subscribeToEmails}
                            onChange={(e) => setSubscribeToEmails(e.target.checked)}
                        />
                        Subscribe to promotional emails
                    </label>
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Save Changes
                </button>
                </form>
            </div>

            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '30px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: 'white', margin: 0 }}>Payment Cards ({cards.length}/4)</h2>
                    {cards.length < 4 && (
                        <button
                            onClick={() => setShowAddCard(!showAddCard)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Card
                        </button>
                    )}
                </div>

                {cards.map(card => (
                    <div key={card.billing_info_id} style={{
                        padding: '15px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <p style={{ color: 'white', margin: 0 }}>
                                {card.card_type.toUpperCase()} •••• {card.card_number.slice(-4)}
                            </p>
                            <p style={{ color: '#ccc', fontSize: '14px', margin: '5px 0 0 0' }}>
                                Exp: {card.card_exp}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDeleteCard(card.billing_info_id)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}

                {cards.length === 0 && (
                    <p style={{ color: '#ccc' }}>No cards saved</p>
                )}

                {showAddCard && (
                    <form onSubmit={handleAddCard} style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}>
                        <h3 style={{ color: 'white', marginBottom: '15px' }}>Add New Card</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Card Type</label>
                            <select
                                value={newCardType}
                                onChange={(e) => setNewCardType(e.target.value as 'credit' | 'debit')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="credit">Credit Card</option>
                                <option value="debit">Debit Card</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Card Number</label>
                            <input
                                type="text"
                                value={newCardNumber}
                                onChange={(e) => setNewCardNumber(e.target.value)}
                                required
                                maxLength={16}
                                placeholder="1234567812345678"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Expiration (MM/YY)</label>
                            <input
                                type="text"
                                value={newCardExp}
                                onChange={(e) => setNewCardExp(e.target.value)}
                                required
                                maxLength={5}
                                placeholder="12/25"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Billing Street</label>
                            <input
                                type="text"
                                value={newCardStreet}
                                onChange={(e) => setNewCardStreet(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>State</label>
                                <input
                                    type="text"
                                    value={newCardState}
                                    onChange={(e) => setNewCardState(e.target.value)}
                                    required
                                    maxLength={2}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div>
                                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>ZIP</label>
                                <input
                                    type="text"
                                    value={newCardZip}
                                    onChange={(e) => setNewCardZip(e.target.value)}
                                    required
                                    maxLength={5}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Save Card
                        </button>
                    </form>
                )}
                </div>
        </div>
    );
}
