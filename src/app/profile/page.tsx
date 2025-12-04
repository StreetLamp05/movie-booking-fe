'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './profile.css';

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

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        is_email_list: false,
        address: {
            street: '',
            city: '',
            state: '',
            country: 'USA',
            zip_code: ''
        },
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/users/profile`, {
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setProfile(data);
            setFormData({
                first_name: data.first_name,
                last_name: data.last_name,
                phone_number: data.phone_number || '',
                is_email_list: data.is_email_list,
                address: {
                    street: data.address.street || '',
                    city: data.address.city || '',
                    state: data.address.state || '',
                    country: data.address.country || 'USA',
                    zip_code: data.address.zip_code || ''
                },
                password: '',
                confirmPassword: ''
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (changingPassword) {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (formData.password && formData.password.length < 8) {
                setError('Password must be at least 8 characters');
                return;
            }
        }

        try {
            const updateData: any = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                is_email_list: formData.is_email_list,
                address: formData.address
            };

            if (changingPassword && formData.password) {
                updateData.password = formData.password;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error?.message || 'Failed to update profile');
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setEditing(false);
            setChangingPassword(false);
            setSuccess('Profile updated successfully!');
            
            // Clear password fields
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            router.push('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (loading) {
        return (
            <main className="profile-container">
                <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    Loading profile...
                </div>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="profile-container">
                <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    Failed to load profile. Please try again.
                </div>
            </main>
        );
    }

    return (
        <main className="profile-container">
            <div className="profile-header glass">
                <h1 className="profile-title">My Account</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
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
                <section className="profile-section glass">
                    <div className="section-header">
                        <h2>Personal Information</h2>
                        {!editing && (
                            <button onClick={() => setEditing(true)} className="edit-button">
                                Edit
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="form-input disabled"
                                />
                                <small>Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    className="form-input"
                                />
                            </div>

                            <h3>Address</h3>
                            <div className="form-group">
                                <label>Street</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        maxLength={2}
                                        placeholder="GA"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>ZIP Code</label>
                                    <input
                                        type="text"
                                        name="address.zip_code"
                                        value={formData.address.zip_code}
                                        onChange={handleChange}
                                        maxLength={5}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-checkbox">
                                <input
                                    type="checkbox"
                                    id="is_email_list"
                                    name="is_email_list"
                                    checked={formData.is_email_list}
                                    onChange={handleChange}
                                />
                                <label htmlFor="is_email_list">
                                    Receive promotional emails and updates
                                </label>
                            </div>

                            {changingPassword && (
                                <>
                                    <h3>Change Password</h3>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-input"
                                            minLength={8}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        setChangingPassword(false);
                                    }}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                                {!changingPassword && (
                                    <button
                                        type="button"
                                        onClick={() => setChangingPassword(true)}
                                        className="secondary-button"
                                    >
                                        Change Password
                                    </button>
                                )}
                                <button type="submit" className="submit-button">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-row">
                                <span className="info-label">Name:</span>
                                <span>{profile.first_name} {profile.last_name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span>{profile.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Phone:</span>
                                <span>{profile.phone_number || 'Not provided'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Address:</span>
                                <span>
                                    {profile.address.street && profile.address.city && profile.address.state
                                        ? `${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.zip_code}`
                                        : 'Not provided'}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Promotions:</span>
                                <span>{profile.is_email_list ? 'Subscribed' : 'Not subscribed'}</span>
                            </div>
                        </div>
                    )}
                </section>

                <section className="profile-section glass">
                    <div className="section-header">
                        <h2>Payment Methods</h2>
                        <Link href="/profile/payment" className="edit-button">
                            Manage
                        </Link>
                    </div>
                    <div className="cards-list">
                        {profile.payment_cards.length > 0 ? (
                            profile.payment_cards.map(card => (
                                <div key={card.billing_info_id} className="card-item">
                                    <div className="card-type">{card.card_type.toUpperCase()}</div>
                                    <div>•••• {card.card_last4}</div>
                                    <div>Expires: {card.card_exp}</div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">No payment methods added</p>
                        )}
                    </div>
                </section>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2rem',
            }}>
                <Link 
                    href="/profile/orders" 
                    className='edit-button'
                    style ={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                    }}
                >
                    View Order History
                </Link>
            </div>
        </main>
    );
}
