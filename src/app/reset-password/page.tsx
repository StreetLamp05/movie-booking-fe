'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthAPI } from '@/lib/api';
import { validatePassword } from '@/lib/validation';


export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setErrorMessage('Invalid or missing reset token.');
        }
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!token) {
            setErrorMessage('Invalid or missing reset token.');
            return;
        }

        if (!validate()) return;

        setLoading(true);

        try {
            await AuthAPI.resetPassword({
                token,
                new_password: formData.password
            });

            setSuccessMessage('Password reset successful! Redirecting to login...');

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to reset password. The link may have expired.');
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
                    Create New Password
                </h1>

                <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    marginBottom: '32px'
                }}>
                    Enter your new password below.
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
                            New Password <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={!token}
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
                            Confirm New Password <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={!token}
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
                        disabled={loading || !token}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: loading || !token ? 'rgba(99, 102, 241, 0.5)' : '#6366f1',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: loading || !token ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
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
