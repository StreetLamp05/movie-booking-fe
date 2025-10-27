'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthAPI } from '@/lib/api';


export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromParams = searchParams.get('email') || '';

    const [formData, setFormData] = useState({
        email: emailFromParams,
        code: ''
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!formData.email || !formData.code) {
            setErrorMessage('Please enter both email and verification code.');
            return;
        }

        setLoading(true);

        try {
            await AuthAPI.verify({
                email: formData.email,
                code: formData.code
            });

            setSuccessMessage('Email verified successfully! Redirecting to login...');

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Verification failed. Please check your code and try again.');
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
                    marginBottom: '16px',
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                }}>
                    Verify Your Email
                </h1>

                <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    marginBottom: '32px'
                }}>
                    Please enter the verification code sent to your email address.
                </p>

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
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
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
                            Verification Code <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                letterSpacing: '0.2em',
                                textAlign: 'center'
                            }}
                        />
                    </div>

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
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>

                    <p style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.95rem',
                        marginTop: '8px'
                    }}>
                        Already verified?{' '}
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
