'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function AccountPage() {
    const { user, loading, refresh } = useAuth();
    const router = useRouter();
    const [firstName, setFirstName] = useState(user?.first_name ?? '');
    const [lastName, setLastName] = useState(user?.last_name ?? '');

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [loading, user, router]);

    useEffect(() => {
        setFirstName(user?.first_name ?? '');
        setLastName(user?.last_name ?? '');
    }, [user]);

    if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;
    if (!user) return null;

    const canEditEmail = user.role === 'admin'; // policy: regular users cannot change email

    async function onSubmit(form: FormData) {
        const first_name = String(form.get('first_name') || '').trim();
        const last_name = String(form.get('last_name') || '').trim();
        try {
            await AuthAPI.updateProfile({ first_name, last_name });
            toast.success('Profile updated');
            await refresh();
        } catch (e: any) {
            toast.error(e?.message || 'Update failed');
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
            <Card title="Your account">
                <div style={{ color: 'var(--text-secondary)' }}>
                    <div>
                        Email:{' '}
                        <strong>{user.email}</strong>
                        {!user.is_verified && <span style={{ marginLeft: 8, color: '#ffae42' }}>(unverified)</span>}
                    </div>
                    <div>Role: <strong>{user.role}</strong></div>
                </div>

                <form action={onSubmit} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
                    <TextInput label="First name" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <TextInput label="Last name" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

                    {/* Email field shown as read-only for user; editable for admin (if you implement an admin edit UX) */}
                    <label style={{ display: 'grid', gap: 8 }}>
                        <span style={{ fontWeight: 500 }}>Email</span>
                        <input
                            value={user.email}
                            disabled={!canEditEmail}
                            readOnly={!canEditEmail}
                            style={{
                                background: 'var(--surface-primary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '10px 16px',
                                borderRadius: 'var(--border-radius-small)',
                                fontFamily: 'inherit',
                                opacity: canEditEmail ? 1 : 0.7,
                            }}
                        />
                    </label>

                    <SubmitButton type="submit">Save</SubmitButton>
                </form>
            </Card>
        </main>
    );
}
