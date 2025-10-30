'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../auth.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            // Always show success for security reasons
            setSubmitted(true);
        } catch (err: any) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="auth-container">
                <div className="auth-card glass">
                    <h1 className="auth-title">Check Your Email</h1>
                    <p className="auth-subtitle">
                        If an account exists with {email}, we've sent a password reset code.
                    </p>
                    <div className="form-actions" style={{ marginTop: '2rem' }}>
                        <Link href="/auth/reset-password" className="submit-button" style={{ textAlign: 'center', display: 'block' }}>
                            Enter Reset Code
                        </Link>
                    </div>
                    <p className="auth-footer">
                        <Link href="/auth/login" className="auth-link">
                            Back to login
                        </Link>
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="auth-container">
            <div className="auth-card glass">
                <h1 className="auth-title">Forgot Password?</h1>
                <p className="auth-subtitle">
                    Enter your email address and we'll send you a reset code.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-message glass-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Sending...' : 'Send Reset Code'}
                    </button>

                    <p className="auth-footer">
                        Remember your password?{' '}
                        <Link href="/auth/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
