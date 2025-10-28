'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '30px'
            }}>
                <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Login</h1>

                <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            color: '#000'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            color: '#000'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <Link href="/forgot-password" style={{ color: '#6366f1', fontSize: '14px' }}>
                        Forgot password?
                    </Link>
                </div>

                {error && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Login
                </button>

                <p style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>
                    Don't have an account? <Link href="/register" style={{ color: '#6366f1' }}>Register</Link>
                </p>
                </form>
            </div>
        </div>
    );
}
