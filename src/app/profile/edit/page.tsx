'use client';
import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/config';

interface PaymentCard {
    billing_info_id: string;
    card_type: 'credit' | 'debit';
    card_number: string;
    card_exp: string;
    billing_address: {
        street: string;
        state: string;
        zip_code: string;
    };
}

interface UserProfile {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_email_list: boolean;
    phone_number: string | null;
    address: {
        street: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        zip_code: string | null;
    };
    payment_cards: PaymentCard[];
}

export default function EditProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [newCard, setNewCard] = useState({
        card_type: 'credit',
        card_number: '',
        card_exp: '',
        billing_street: '',
        billing_state: '',
        billing_zip_code: ''
    });

    // Fetch user profile
    useEffect(() => {
        fetch(`${API_BASE}/users/profile`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error.message);
                setProfile(data);
            })
            .catch(err => setError(err.message));
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        try {
            const res = await fetch(`${API_BASE}/users/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    is_email_list: profile.is_email_list,
                    phone_number: profile.phone_number,
                    address: profile.address
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/users/cards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCard)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            // Refresh profile to get updated cards
            const profileRes = await fetch(`${API_BASE}/users/profile`);
            const profileData = await profileRes.json();
            setProfile(profileData);
            setSuccess('Card added successfully!');
            // Reset form
            setNewCard({
                card_type: 'credit',
                card_number: '',
                card_exp: '',
                billing_street: '',
                billing_state: '',
                billing_zip_code: ''
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        try {
            const res = await fetch(`${API_BASE}/users/cards/${cardId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete card');
            // Refresh profile to get updated cards
            const profileRes = await fetch(`${API_BASE}/users/profile`);
            const profileData = await profileRes.json();
            setProfile(profileData);
            setSuccess('Card deleted successfully!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Edit Profile</h1>
            
            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '20px' }}>{success}</div>}

            <section style={{ marginBottom: '40px' }}>
                <h2>Personal Information</h2>
                <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email (cannot be changed)</label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>First Name</label>
                        <input
                            type="text"
                            value={profile.first_name}
                            onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Last Name</label>
                        <input
                            type="text"
                            value={profile.last_name}
                            onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number</label>
                        <input
                            type="tel"
                            value={profile.phone_number || ''}
                            onChange={e => setProfile({ ...profile, phone_number: e.target.value })}
                            placeholder="1234567890"
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={profile.is_email_list}
                                onChange={e => setProfile({ ...profile, is_email_list: e.target.checked })}
                            />
                            Register for promotional emails
                        </label>
                    </div>

                    <h3>Address</h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        <input
                            type="text"
                            value={profile.address.street || ''}
                            onChange={e => setProfile({
                                ...profile,
                                address: { ...profile.address, street: e.target.value }
                            })}
                            placeholder="Street Address"
                            style={{ width: '100%', padding: '8px' }}
                        />
                        <input
                            type="text"
                            value={profile.address.city || ''}
                            onChange={e => setProfile({
                                ...profile,
                                address: { ...profile.address, city: e.target.value }
                            })}
                            placeholder="City"
                            style={{ width: '100%', padding: '8px' }}
                        />
                        <input
                            type="text"
                            value={profile.address.state || ''}
                            onChange={e => setProfile({
                                ...profile,
                                address: { ...profile.address, state: e.target.value }
                            })}
                            placeholder="State"
                            style={{ width: '100%', padding: '8px' }}
                        />
                        <input
                            type="text"
                            value={profile.address.zip_code || ''}
                            onChange={e => setProfile({
                                ...profile,
                                address: { ...profile.address, zip_code: e.target.value }
                            })}
                            placeholder="ZIP Code"
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <button type="submit" style={{ padding: '10px', marginTop: '10px' }}>
                        Save Changes
                    </button>
                </form>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2>Payment Cards ({profile.payment_cards.length}/4)</h2>
                <div style={{ marginBottom: '20px' }}>
                    {profile.payment_cards.map(card => (
                        <div key={card.billing_info_id} style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '4px'
                        }}>
                            <div>Card: {card.card_number}</div>
                            <div>Type: {card.card_type}</div>
                            <div>Expires: {card.card_exp}</div>
                            <button
                                onClick={() => handleDeleteCard(card.billing_info_id)}
                                style={{ marginTop: '10px', padding: '5px 10px', color: 'red' }}
                            >
                                Remove Card
                            </button>
                        </div>
                    ))}
                </div>

                {profile.payment_cards.length < 4 && (
                    <form onSubmit={handleAddCard} style={{ display: 'grid', gap: '15px' }}>
                        <h3>Add New Card</h3>
                        <select
                            value={newCard.card_type}
                            onChange={e => setNewCard({ ...newCard, card_type: e.target.value as 'credit' | 'debit' })}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>

                        <input
                            type="text"
                            value={newCard.card_number}
                            onChange={e => setNewCard({ ...newCard, card_number: e.target.value })}
                            placeholder="Card Number"
                            maxLength={16}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />

                        <input
                            type="text"
                            value={newCard.card_exp}
                            onChange={e => setNewCard({ ...newCard, card_exp: e.target.value })}
                            placeholder="Expiration (MM/YY)"
                            maxLength={5}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />

                        <input
                            type="text"
                            value={newCard.billing_street}
                            onChange={e => setNewCard({ ...newCard, billing_street: e.target.value })}
                            placeholder="Billing Street"
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />

                        <input
                            type="text"
                            value={newCard.billing_state}
                            onChange={e => setNewCard({ ...newCard, billing_state: e.target.value })}
                            placeholder="Billing State"
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />

                        <input
                            type="text"
                            value={newCard.billing_zip_code}
                            onChange={e => setNewCard({ ...newCard, billing_zip_code: e.target.value })}
                            placeholder="Billing ZIP Code"
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />

                        <button type="submit" style={{ padding: '10px' }}>
                            Add Card
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}