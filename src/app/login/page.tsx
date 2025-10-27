'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, validateRequired } from '@/lib/validation';


export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember_me: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
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

        const passwordError = validateRequired(formData.password, 'Password');
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!validate()) return;

        setLoading(true);

        try {
            await login({
                email: formData.email,
                password: formData.password,
                remember_me: formData.remember_me
            });

            router.push('/');
        } catch (error: any) {
            setErrorMessage(error.message || 'Invalid email or password. Please try again.');
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
                maxWidth: '450px',
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
                    Welcome Back
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
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

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                name="remember_me"
                                checked={formData.remember_me}
                                onChange={handleChange}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                                Remember me
                            </span>
                        </label>

                        <Link href="/forgot-password" style={{
                            color: '#6366f1',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            Forgot password?
                        </Link>
                    </div>

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
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <p style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.95rem',
                        marginTop: '8px'
                    }}>
                        Don't have an account?{' '}
                        <Link href="/register" style={{
                            color: '#6366f1',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}>
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
