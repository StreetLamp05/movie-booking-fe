'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../auth.css';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        new_password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.new_password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.new_password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    code: formData.code,
                    new_password: formData.new_password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Reset failed');
            }

            // Success - redirect to login
            router.push('/auth/login?reset=success');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <main className="auth-container">
            <div className="auth-card glass">
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">
                    Enter your reset code and new password
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-message glass-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="code">Reset Code</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            className="form-input verification-input"
                            placeholder="123456"
                            maxLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="new_password">New Password</label>
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="••••••••"
                            minLength={8}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
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
