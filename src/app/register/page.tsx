'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, validatePassword, validateRequired, validatePhone } from '@/lib/validation';


export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: '',
        subscribed_to_promotions: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const firstNameError = validateRequired(formData.first_name, 'First name');
        if (firstNameError) newErrors.first_name = firstNameError;

        const lastNameError = validateRequired(formData.last_name, 'Last name');
        if (lastNameError) newErrors.last_name = lastNameError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.phone) {
            const phoneError = validatePhone(formData.phone);
            if (phoneError) newErrors.phone = phoneError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!validate()) return;

        setLoading(true);

        try {
            await register({
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone || undefined,
                subscribed_to_promotions: formData.subscribed_to_promotions
            });

            setSuccessMessage('Registration successful! Please check your email to verify your account.');

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 100px)',
            padding: '40px 16px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '40px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    color: 'white',
                    marginBottom: '32px',
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                }}>
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
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
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: `1px solid ${errors.first_name ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)'}`,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            {errors.first_name && (
                                <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px' }}>
                                    {errors.first_name}
                                </p>
                            )}
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
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: `1px solid ${errors.last_name ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)'}`,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            {errors.last_name && (
                                <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px' }}>
                                    {errors.last_name}
                                </p>
                            )}
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
                            Email Address <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${errors.email ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)'}`,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        {errors.email && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px' }}>
                                {errors.email}
                            </p>
                        )}
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
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(555) 555-5555"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${errors.phone ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)'}`,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        {errors.phone && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px' }}>
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            Password <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${errors.password ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)'}`,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        {errors.password && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px' }}>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            Confirm Password <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${errors.confirmPassword ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)'}`,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        {errors.confirmPassword && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px' }}>
                                {errors.confirmPassword}
                            </p>
                        )}
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
                            checked={formData.subscribed_to_promotions}
                            onChange={handleChange}
                            style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                            Subscribe to promotional emails and special offers
                        </span>
                    </label>

                    {successMessage && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(76, 175, 80, 0.2)',
                            border: '1px solid rgba(76, 175, 80, 0.5)',
                            color: '#4caf50',
                            fontSize: '0.9rem'
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
                            fontSize: '0.9rem'
                        }}>
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: loading ? 'rgba(99, 102, 241, 0.5)' : '#6366f1',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.95rem'
                    }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{
                            color: '#6366f1',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}>
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
