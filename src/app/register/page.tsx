'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await signup({
                email,
                password,
                first_name: firstName,
                last_name: lastName
            });
            setSuccess(response.message);
            setTimeout(() => {
                router.push(`/verify-email?email=${email}`);
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
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
                <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Register</h1>

                <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                        First Name
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
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
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Register
                </button>

                <p style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>
                    Already have an account? <Link href="/login" style={{ color: '#6366f1' }}>Login</Link>
                </p>
                </form>
            </div>
        </div>
    );
}
