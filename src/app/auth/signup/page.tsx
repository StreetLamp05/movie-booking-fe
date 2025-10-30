'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../auth.css';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<'signup' | 'verify'>('signup');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        is_email_list: false
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    is_email_list: formData.is_email_list
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            setStep('verify');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/auth/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    code: verificationCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            router.push('/auth/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (step === 'verify') {
        return (
            <main className="auth-container">
                <div className="auth-card glass">
                    <h1 className="auth-title">Verify Your Email</h1>
                    <p className="auth-subtitle">
                        We sent a verification code to {formData.email}
                    </p>

                    <form onSubmit={handleVerify} className="auth-form">
                        {error && (
                            <div className="error-message glass-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="code">Verification Code</label>
                            <input
                                type="text"
                                id="code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                className="form-input verification-input"
                                placeholder="123456"
                                maxLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>

                        <p className="auth-footer">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={() => setStep('signup')}
                                className="auth-link inline-button"
                            >
                                Go back
                            </button>
                        </p>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="auth-container">
            <div className="auth-card glass">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join CineGlass Theatre</p>

                <form onSubmit={handleSignup} className="auth-form">
                    {error && (
                        <div className="error-message glass-error">
                            {error}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="John"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

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
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="••••••••"
                            minLength={8}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
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

                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            id="is_email_list"
                            name="is_email_list"
                            checked={formData.is_email_list}
                            onChange={handleChange}
                        />
                        <label htmlFor="is_email_list">
                            I want to receive promotional emails and updates
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p className="auth-footer">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
