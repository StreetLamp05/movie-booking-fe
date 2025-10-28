'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthAPI } from '@/lib/api';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    const [email, setEmail] = useState(emailFromUrl);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await AuthAPI.verify({ email, code });
            setSuccess('Email verified! Redirecting...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Verification failed');
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
                <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '10px' }}>Verify Email</h1>
                <p style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
                    Enter the code sent to your email
                </p>

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
                        Verification Code
                    </label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        maxLength={6}
                        placeholder="123456"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            color: '#000',
                            textAlign: 'center',
                            fontSize: '18px'
                        }}
                    />
                </div>

                {success && (
                    <div style={{ color: 'green', marginBottom: '10px' }}>
                        {success}
                    </div>
                )}

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
                    Verify
                </button>

                <p style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>
                    Already verified? <Link href="/login" style={{ color: '#6366f1' }}>Login</Link>
                </p>
                </form>
            </div>
        </div>
    );
}
