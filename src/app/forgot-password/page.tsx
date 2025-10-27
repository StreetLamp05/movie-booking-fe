'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { AuthAPI } from '@/lib/api';
import { validateEmail } from '@/lib/validation';


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validate = (): boolean => {
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validate()) return;

        setLoading(true);

        try {
            await AuthAPI.forgotPassword({ email });
            setSuccessMessage('Password reset instructions have been sent to your email address.');
            setEmail('');
        } catch (error: any) {
            setError(error.message || 'Failed to send reset email. Please try again.');
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
                    Reset Password
                </h1>

                <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    marginBottom: '32px'
                }}>
                    Enter your email address and we'll send you instructions to reset your password.
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
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${error ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)'}`,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        {error && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '4px' }}>
                                {error}
                            </p>
                        )}
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
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <p style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.95rem',
                        marginTop: '8px'
                    }}>
                        Remember your password?{' '}
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
